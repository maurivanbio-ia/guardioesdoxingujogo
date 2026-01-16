import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESHY_API_KEY = process.env.MESHY_API_KEY;
const MESHY_API_BASE = 'https://api.meshy.ai';

if (!MESHY_API_KEY) {
  console.error('❌ MESHY_API_KEY não encontrada nas variáveis de ambiente');
  process.exit(1);
}

async function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.meshy.ai',
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${MESHY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${JSON.stringify(jsonData)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message} - Body: ${body}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectRes) => {
          const fileStream = fs.createWriteStream(outputPath);
          redirectRes.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
          
          fileStream.on('error', reject);
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        
        fileStream.on('error', reject);
      }
    }).on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateTurtle() {
  console.log('🐢 Iniciando geração de tartaruga Podocnemis expansa...\n');

  const prompt = `Highly detailed realistic Amazon river turtle (Podocnemis expansa), adult female specimen, scientific accuracy, brown-olive carapace with hexagonal scutes, yellow plastron, streamlined shell shape, realistic reptilian skin texture, webbed feet with claws, short tail, natural pose on riverbank sand, photorealistic textures, 4K quality, scientifically accurate anatomy`;

  const artStyle = 'realistic';
  const negativePrompt = 'cartoon, low poly, stylized, toy, fake, smooth, glossy, shiny';

  console.log('📝 Prompt:', prompt);
  console.log('🎨 Estilo:', artStyle);
  console.log('\n🚀 Criando tarefa na API Meshy...');

  try {
    // Step 1: Create text-to-3D task
    const createResponse = await makeRequest('POST', '/v2/text-to-3d', {
      mode: 'preview',
      prompt: prompt,
      art_style: artStyle,
      negative_prompt: negativePrompt
    });

    const taskId = createResponse.result;
    console.log(`✅ Tarefa criada: ${taskId}`);
    console.log('\n⏳ Aguardando geração do modelo (pode levar 60-120 segundos)...\n');

    // Step 2: Poll for task completion
    let taskStatus = 'PENDING';
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (taskStatus !== 'SUCCEEDED' && attempts < maxAttempts) {
      await sleep(5000); // Check every 5 seconds
      attempts++;

      const statusResponse = await makeRequest('GET', `/v2/text-to-3d/${taskId}`);
      taskStatus = statusResponse.status;

      const progress = statusResponse.progress || 0;
      console.log(`⏳ Status: ${taskStatus} | Progresso: ${progress}% | Tentativa: ${attempts}/${maxAttempts}`);

      if (taskStatus === 'FAILED') {
        throw new Error('Geração falhou');
      }

      if (taskStatus === 'SUCCEEDED') {
        console.log('\n✅ Modelo gerado com sucesso!');
        console.log('\n📥 Baixando modelo GLB...');

        // Download the GLB file
        const modelUrl = statusResponse.model_urls.glb;
        const outputDir = path.join(__dirname, '..', 'public', 'models');
        
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'tartaruga-expansa.glb');
        await downloadFile(modelUrl, outputPath);

        console.log(`✅ Modelo salvo em: ${outputPath}`);
        console.log('\n📊 Detalhes do modelo:');
        console.log(`   - ID: ${taskId}`);
        console.log(`   - Arquivo: tartaruga-expansa.glb`);
        console.log(`   - Tamanho: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
        
        if (statusResponse.thumbnail_url) {
          console.log(`   - Preview: ${statusResponse.thumbnail_url}`);
        }

        console.log('\n🎮 Pronto para usar no jogo!');
        return taskId;
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error('Timeout: Geração demorou muito tempo');
    }

  } catch (error) {
    console.error('\n❌ Erro na geração:', error.message);
    throw error;
  }
}

// Execute
generateTurtle()
  .then((taskId) => {
    console.log('\n✨ Geração concluída com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Falha na geração:', error);
    process.exit(1);
  });
