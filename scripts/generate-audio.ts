#!/usr/bin/env tsx
/**
 * Script de Geração de Áudio com ElevenLabs
 * 
 * Gera narração profissional em português brasileiro para:
 * - Mensagens de boas-vindas (WelcomeModal)
 * - Introduções de fases
 * - Diálogos de NPCs
 * - Curiosidades científicas
 * - Conquistas
 */

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'fs';
import path from 'path';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY não encontrada nas variáveis de ambiente');
  process.exit(1);
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY
});

// Vozes ElevenLabs em Português
const VOICES = {
  narrator_male: 'pNInz6obpgDQGcFmaJgB', // Adam (narrador masculino)
  narrator_female: 'EXAVITQu4vr4xnSDxMaL', // Rachel (narradora feminina)
  scientist_female: '21m00Tcm4TlvDq8ikWAM', // Bella (cientista)
  local_male: 'flq6f7yk4E4fJM5XTYuZ', // Callum (ribeirinho)
};

interface AudioScript {
  id: string;
  text: string;
  voice: string;
  outputPath: string;
  description: string;
}

// 📝 Todos os textos que precisam de narração
const audioScripts: AudioScript[] = [
  // === WELCOME MODAL (3 páginas) ===
  {
    id: 'welcome_page1',
    text: 'Bem-vindo ao Guardião do Xingu! Você está prestes a mergulhar na experiência de um biólogo de campo, protegendo tartarugas amazônicas durante a temporada reprodutiva no Rio Xingu, Brasil.',
    voice: VOICES.narrator_female,
    outputPath: 'client/public/audio/welcome/page1.mp3',
    description: 'Página 1 - Boas-vindas'
  },
  {
    id: 'welcome_page2',
    text: 'Este jogo educativo é parte do Projeto de Manejo de Quelônios da UHE Belo Monte, uma condicionante ambiental real que protege espécies ameaçadas de extinção através de metodologia científica rigorosa.',
    voice: VOICES.narrator_female,
    outputPath: 'client/public/audio/welcome/page2.mp3',
    description: 'Página 2 - Projeto EcoBrasil'
  },
  {
    id: 'welcome_page3',
    text: 'Você aprenderá protocolos científicos reais, tomará decisões éticas, e descobrirá como cada pequena ação contribui para a conservação da biodiversidade amazônica. Prepare-se para esta jornada emocionante!',
    voice: VOICES.narrator_female,
    outputPath: 'client/public/audio/welcome/page3.mp3',
    description: 'Página 3 - Missão'
  },

  // === INTRODUÇÕES DE FASES ===
  {
    id: 'phase1_intro',
    text: 'Fase 1: Chegada ao Campo. Bem-vindo à estação de pesquisa no Rio Xingu. Doutora Adriana te espera para apresentar a equipe e os procedimentos. Explore a área, conheça seus colegas e prepare-se para o monitoramento.',
    voice: VOICES.scientist_female,
    outputPath: 'client/public/audio/phases/phase1_intro.mp3',
    description: 'Fase 1 - Chegada ao Campo'
  },
  {
    id: 'phase2_intro',
    text: 'Fase 2: Monitoramento Noturno. A noite chegou, e com ela a hora crítica do monitoramento. Vista seu colete, pegue sua lanterna e saia para patrulhar as praias. As tartarugas estão saindo para desovar.',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/phases/phase2_intro.mp3',
    description: 'Fase 2 - Monitoramento Noturno'
  },
  {
    id: 'phase3_intro',
    text: 'Fase 3: Eclosão dos Filhotes. É manhã e os ninhos começam a eclodir! Os filhotes precisam chegar ao rio com segurança. Proteja-os de predadores e registre dados importantes para a ciência.',
    voice: VOICES.narrator_female,
    outputPath: 'client/public/audio/phases/phase3_intro.mp3',
    description: 'Fase 3 - Eclosão dos Filhotes'
  },
  {
    id: 'phase4_intro',
    text: 'Fase 4: Coleta de Dados Biométricos. Hora de medir, pesar e marcar as tartarugas. Use os equipamentos científicos com precisão e registre cada medida. Seus dados contribuirão para pesquisas futuras.',
    voice: VOICES.scientist_female,
    outputPath: 'client/public/audio/phases/phase4_intro.mp3',
    description: 'Fase 4 - Coleta de Dados'
  },
  {
    id: 'phase5_intro',
    text: 'Fase 5: Análise e Conservação. É hora de analisar os resultados e entender o impacto do seu trabalho. O Índice de Conservação do Xingu reflete cada decisão que você tomou. Parabéns por completar esta jornada!',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/phases/phase5_intro.mp3',
    description: 'Fase 5 - Análise Final'
  },

  // === DIÁLOGO DRA. ADRIANA ===
  {
    id: 'dra_adriana_fase1',
    text: 'Olá! Sou a Doutora Adriana, coordenadora desta estação. Bem-vindo à equipe! Aqui trabalhamos com Podocnemis expansa e Podocnemis unifilis, duas espécies de tartarugas amazônicas. Vamos começar conhecendo a área e os procedimentos básicos.',
    voice: VOICES.scientist_female,
    outputPath: 'client/public/audio/dialogues/dra_adriana_fase1.mp3',
    description: 'Dra. Adriana - Apresentação'
  },

  // === DIÁLOGOS DO BARCO (Ribeirinhos) - EDUCAÇÃO SOBRE CONSERVAÇÃO ===
  {
    id: 'boat_line1',
    text: 'Boa tarde, doutor. Minha família sempre coletou ovos de tartaruga aqui no rio. Por que agora dizem que não pode mais?',
    voice: VOICES.local_male,
    outputPath: 'client/public/audio/dialogues/boat_line1.mp3',
    description: 'Barco - Linha 1 (Coletor questiona proibição)'
  },
  {
    id: 'boat_line2',
    text: 'Entendo sua preocupação. O problema é que a coleta intensiva de ovos está levando essas espécies à extinção. Hoje é PROIBIDO por lei federal.',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/dialogues/boat_line2.mp3',
    description: 'Barco - Linha 2 (Biólogo explica lei)'
  },
  {
    id: 'boat_line3',
    text: 'Mas se eu pegar só alguns ovos de cada ninho, não faz diferença, não é?',
    voice: VOICES.local_male,
    outputPath: 'client/public/audio/dialogues/boat_line3.mp3',
    description: 'Barco - Linha 3 (Coletor argumenta)'
  },
  {
    id: 'boat_line4',
    text: 'Faz sim! Cada ovo é importante. De cada 100 ovos, apenas 2 ou 3 filhotes chegam à vida adulta. Tirar "só alguns" pode impedir que a população se recupere.',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/dialogues/boat_line4.mp3',
    description: 'Barco - Linha 4 (Biólogo explica impacto)'
  },
  {
    id: 'boat_line5',
    text: 'E as tartarugas adultas? Meu vizinho disse que pode pegar para comer se for poucas...',
    voice: VOICES.local_male,
    outputPath: 'client/public/audio/dialogues/boat_line5.mp3',
    description: 'Barco - Linha 5 (Coletor questiona adultas)'
  },
  {
    id: 'boat_line6',
    text: 'Isso também é PROIBIDO! Uma fêmea leva 8 a 10 anos para se reproduzir pela primeira vez e pode viver mais de 50 anos. Matar uma adulta é perder décadas de reprodução.',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/dialogues/boat_line6.mp3',
    description: 'Barco - Linha 6 (Biólogo explica reprodução)'
  },
  {
    id: 'boat_line7',
    text: 'Então como vou alimentar minha família? Sempre dependemos disso...',
    voice: VOICES.local_male,
    outputPath: 'client/public/audio/dialogues/boat_line7.mp3',
    description: 'Barco - Linha 7 (Coletor preocupado)'
  },
  {
    id: 'boat_line8',
    text: 'Há alternativas! Programas de manejo sustentável, ecoturismo, e projetos que pagam para proteger os ninhos. Você pode ganhar ajudando na conservação, não destruindo.',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/dialogues/boat_line8.mp3',
    description: 'Barco - Linha 8 (Biólogo mostra alternativas)'
  },
  {
    id: 'boat_line9',
    text: 'Nunca pensei por esse lado... E se eu ajudar a proteger, como funciona?',
    voice: VOICES.local_male,
    outputPath: 'client/public/audio/dialogues/boat_line9.mp3',
    description: 'Barco - Linha 9 (Coletor interessado)'
  },
  {
    id: 'boat_line10',
    text: 'Você pode ser um guardião dos ninhos! Monitorar, avisar sobre predadores, ajudar na pesquisa. Assim sua família se beneficia E as tartarugas sobrevivem para as próximas gerações.',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/dialogues/boat_line10.mp3',
    description: 'Barco - Linha 10 (Biólogo propõe solução)'
  },

  // === CONQUISTAS ===
  {
    id: 'achievement_etico',
    text: 'Parabéns! Você desbloqueou a conquista Pesquisador Ético. Sua integridade científica é exemplar!',
    voice: VOICES.narrator_female,
    outputPath: 'client/public/audio/achievements/etico.mp3',
    description: 'Conquista - Pesquisador Ético'
  },
  {
    id: 'achievement_educador',
    text: 'Conquista desbloqueada: Educador Ambiental. Seu conhecimento inspira a conservação!',
    voice: VOICES.narrator_female,
    outputPath: 'client/public/audio/achievements/educador.mp3',
    description: 'Conquista - Educador Ambiental'
  },
  {
    id: 'achievement_guardiao',
    text: 'Incrível! Você é agora um Guardião do Rio. O Xingu agradece sua dedicação!',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/achievements/guardiao.mp3',
    description: 'Conquista - Guardião do Rio'
  },
  {
    id: 'achievement_especialista',
    text: 'Especialista em Ninhos desbloqueado! Você domina todas as técnicas de monitoramento.',
    voice: VOICES.scientist_female,
    outputPath: 'client/public/audio/achievements/especialista.mp3',
    description: 'Conquista - Especialista em Ninhos'
  },
  {
    id: 'achievement_protetor',
    text: 'Protetor da Fauna conquistado! Sua vigilância salvou inúmeras vidas.',
    voice: VOICES.narrator_male,
    outputPath: 'client/public/audio/achievements/protetor.mp3',
    description: 'Conquista - Protetor da Fauna'
  },
  {
    id: 'achievement_heroi',
    text: 'Você é um verdadeiro Herói do Xingu! Seu trabalho exemplar inspira futuras gerações de conservacionistas!',
    voice: VOICES.narrator_female,
    outputPath: 'client/public/audio/achievements/heroi.mp3',
    description: 'Conquista - Herói do Xingu'
  },
];

async function generateAudio(script: AudioScript): Promise<void> {
  try {
    console.log(`🎙️  Gerando: ${script.description}...`);

    const audio = await client.textToSpeech.convert(script.voice, {
      text: script.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    });

    // Criar diretório se não existir
    const dir = path.dirname(script.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Converter stream para buffer e salvar
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    
    fs.writeFileSync(script.outputPath, buffer);
    console.log(`✅ Salvo: ${script.outputPath}`);
  } catch (error) {
    console.error(`❌ Erro ao gerar ${script.id}:`, error);
    throw error;
  }
}

async function generateAllAudio(): Promise<void> {
  console.log('🎬 Iniciando geração de áudio...\n');
  console.log(`📊 Total de áudios: ${audioScripts.length}\n`);

  let success = 0;
  let failed = 0;

  for (const script of audioScripts) {
    try {
      await generateAudio(script);
      success++;
      // Pequeno delay para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      failed++;
      console.error(`Falha em: ${script.id}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Gerados com sucesso: ${success}`);
  console.log(`❌ Falharam: ${failed}`);
  console.log('='.repeat(50));
}

// Executar
generateAllAudio()
  .then(() => {
    console.log('\n🎉 Geração de áudio concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
