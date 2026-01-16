/**
 * Script para gerar narrações dos cards contextuais usando ElevenLabs
 * Voz infantil (8-10 anos), alegre e educativa em PT-BR
 */
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'fs';
import path from 'path';

// Configurações da voz
const VOICE_CONFIG = {
  voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam (voz clara, pode ser ajustada)
  modelId: 'eleven_multilingual_v2',
  voiceSettings: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.3,
    use_speaker_boost: true,
  },
};

// Textos dos 27 cards (extraídos do useCardSystem.ts)
const CARD_TEXTS = [
  // measureTemp (3)
  { id: 'card_temp_1', text: 'A temperatura influencia o sexo dos filhotes: acima de 32°C nascem mais fêmeas, abaixo de 28°C mais machos.' },
  { id: 'card_temp_2', text: 'Temperaturas extremas podem inviabilizar ninhos inteiros. O aquecimento global afeta diretamente a reprodução.' },
  { id: 'card_temp_3', text: 'Tartarugas não têm cromossomos sexuais — o sexo é determinado pela temperatura durante a incubação!' },
  
  // measureDepth (2)
  { id: 'card_depth_1', text: 'A profundidade protege os ovos de predadores e da insolação direta. Ninhos rasos têm maior risco de predação.' },
  { id: 'card_depth_2', text: 'Fêmeas cavam 40-60 cm de profundidade usando apenas as nadadeiras traseiras — um trabalho exaustivo!' },
  
  // measureWidth (2)
  { id: 'card_width_1', text: 'A largura do ninho indica quantos ovos a fêmea depositou. Tartarugas maiores fazem ninhos mais largos.' },
  { id: 'card_width_2', text: 'Uma fêmea adulta pode botar 60-150 ovos por ninhada, dependendo da espécie e idade!' },
  
  // markNest (2)
  { id: 'card_mark_1', text: 'Marcar ninhos permite o monitoramento contínuo e protege contra pisoteio acidental de pesquisadores.' },
  { id: 'card_mark_2', text: 'Cada ninho marcado gera dados sobre sucesso reprodutivo, período de incubação e taxa de eclosão.' },
  
  // scareVulture (3)
  { id: 'card_vulture_1', text: 'Os urubus são importantes decompositores, mas podem atacar ninhos desprotegidos. O manejo deve ser ético.' },
  { id: 'card_vulture_2', text: 'Urubus memorizam locais de ninhos e retornam. Por isso monitoramos diariamente as áreas de reprodução.' },
  { id: 'card_vulture_3', text: 'Espantar predadores é uma intervenção temporária — não podemos eliminar espécies nativas do ecossistema.' },
  
  // tagTurtle (2)
  { id: 'card_tag_1', text: 'Cada tartaruga marcada nos ajuda a entender migração, crescimento e comportamento reprodutivo.' },
  { id: 'card_tag_2', text: 'Usamos microchips e anilhas metálicas que duram a vida toda — até 80 anos em algumas espécies!' },
  
  // measureTurtle (2)
  { id: 'card_measure_1', text: 'Medir comprimento e largura da carapaça permite estimar idade, saúde e sucesso reprodutivo.' },
  { id: 'card_measure_2', text: 'Medimos sempre no mesmo ponto da carapaça para garantir comparabilidade entre estudos diferentes.' },
  
  // releaseHatchling (3)
  { id: 'card_release_1', text: 'Apenas 2% dos filhotes chegam à vida adulta — cada um é vital para a espécie. A natureza é desafiadora.' },
  { id: 'card_release_2', text: 'Filhotes devem caminhar sozinhos até o rio para memorizar o local de nascimento e retornar no futuro.' },
  { id: 'card_release_3', text: 'A soltura deve ocorrer ao entardecer — assim filhotes evitam o calor extremo e a predação por aves.' },
  
  // findEgg (2)
  { id: 'card_egg_1', text: 'Ovos de tartaruga têm casca flexível e precisam de umidade constante. Nunca virá-los durante o manejo!' },
  { id: 'card_egg_2', text: 'O embrião se fixa na parte superior do ovo. Virar após 24h pode matá-lo. Sempre marque o topo ao coletar!' },
  
  // observeAdult (2)
  { id: 'card_observe_1', text: 'Não perturbar os animais durante a reprodução é fundamental. Estresse pode causar abandono do ninho.' },
  { id: 'card_observe_2', text: 'Distância mínima de 5 metros, sem luz direta, sem tocar. O bem-estar animal vem antes dos dados.' },
  
  // collectData (2)
  { id: 'card_data_1', text: 'Cada medida coletada contribui para a ciência conservacionista e políticas públicas de proteção.' },
  { id: 'card_data_2', text: 'Dados de campo alimentam modelos de conservação usados pelo ICMBio e universidades brasileiras.' },
  
  // nightPatrol (2)
  { id: 'card_patrol_1', text: 'Tartarugas sobem à praia principalmente à noite. O trabalho de campo exige dedicação em horários desafiadores.' },
  { id: 'card_patrol_2', text: 'Patrulhas noturnas acontecem de 4 em 4 horas, durante toda a temporada reprodutiva (setembro a novembro).' },
];

async function generateCardAudios() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY não encontrada');
  }

  const client = new ElevenLabsClient({ apiKey });
  const outputDir = path.join(process.cwd(), 'public', 'audio', 'cards');

  // Garantir que o diretório existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🎙️ Gerando ${CARD_TEXTS.length} narrações com voz infantil...`);
  console.log(`📁 Salvando em: ${outputDir}\n`);

  for (let i = 0; i < CARD_TEXTS.length; i++) {
    const { id, text } = CARD_TEXTS[i];
    const outputPath = path.join(outputDir, `${id}.mp3`);

    // Pular se já existe
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  [${i + 1}/${CARD_TEXTS.length}] ${id}.mp3 já existe`);
      continue;
    }

    try {
      console.log(`🔊 [${i + 1}/${CARD_TEXTS.length}] Gerando ${id}.mp3...`);
      console.log(`   Texto: "${text.substring(0, 60)}..."`);

      const audioStream = await client.textToSpeech.convert(VOICE_CONFIG.voiceId, {
        model_id: VOICE_CONFIG.modelId,
        text: text,
        voice_settings: VOICE_CONFIG.voiceSettings,
      });

      // Salvar arquivo
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      fs.writeFileSync(outputPath, audioBuffer);

      console.log(`✅ Salvo: ${id}.mp3 (${(audioBuffer.length / 1024).toFixed(1)} KB)\n`);

      // Delay para respeitar rate limit
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Erro ao gerar ${id}:`, error);
    }
  }

  console.log('✨ Concluído! Todos os áudios foram gerados.');
}

// Executar
generateCardAudios().catch(console.error);
