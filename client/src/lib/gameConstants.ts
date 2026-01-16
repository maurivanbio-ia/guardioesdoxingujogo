// Constantes do jogo Guardião do Xingu

export const GAME_CONFIG = {
  // Configurações de física e movimento
  PLAYER_SPEED: 3.25,  // Aumentado 30% (2.5 → 3.25)
  PLAYER_RUN_SPEED: 6.5,  // Aumentado 30% (5.0 → 6.5)
  PLAYER_JUMP_FORCE: 6.5,
  PLAYER_GRAVITY: 20,
  PLAYER_ROTATION_SPEED: 3,
  CAMERA_FOLLOW_SPEED: 0.1,
  CAMERA_OFFSET: { x: 0, y: 5, z: 10 },
  
  // Configurações de tempo
  DAY_DURATION: 300, // segundos para um ciclo completo dia/noite
  NIGHT_START: 0.7, // 70% do ciclo
  DAWN_START: 0.9, // 90% do ciclo
  
  // Configurações de ambiente
  WATER_LEVEL: 0,
  BEACH_WIDTH: 100,
  BEACH_LENGTH: 200,
  FOREST_DENSITY: 0.3,
  
  // Configurações do barco
  BOAT_ARRIVAL: {
    enabled: true,
    position: { x: 15, y: 0, z: -35 }, // Pescadores BEM DENTRO da praia (longe da borda)
    rotation: Math.PI / 2, // Virado para a praia
    bobbingAmplitude: 0.08,
    bobbingSpeed: 0.8,
    passengers: [
      { position: { x: 0, y: 0.3, z: 0.5 }, sitting: true, color: 0x8B4513 },
      { position: { x: -0.8, y: 0.3, z: -0.5 }, sitting: true, color: 0x4A6FA5 },
      { position: { x: 0.8, y: 0.3, z: -0.5 }, sitting: true, color: 0x6B8E23 },
    ]
  }
};

export const MISSIONS = {
  CHAPTER_1: {
    id: 'chapter_1',
    title: 'O Chamado do Rio',
    description: 'Chegue ao acampamento e conheça a equipe',
    objectives: [
      'Explorar o acampamento',
      'Conhecer Dra. Adriana',
      'Receber equipamentos',
      'Completar treinamento de rastros'
    ]
  },
  CHAPTER_2: {
    id: 'chapter_2',
    title: 'A Primeira Desova',
    description: 'Localize e registre uma fêmea desovando',
    objectives: [
      'Seguir rastros na praia',
      'Aproximar-se com cuidado',
      'Realizar medições biométricas',
      'Registrar dados no GPS'
    ]
  },
  CHAPTER_3: {
    id: 'chapter_3',
    title: 'Ninhos e Riscos',
    description: 'Identifique e proteja os ninhos',
    objectives: [
      'Localizar ninhos na praia',
      'Marcar com GPS',
      'Instalar proteções',
      'Registrar coordenadas'
    ]
  },
  CHAPTER_4: {
    id: 'chapter_4',
    title: 'As Vozes da Comunidade',
    description: 'Interaja com a comunidade ribeirinha',
    objectives: [
      'Visitar a vila',
      'Conversar com moradores',
      'Participar da reunião',
      'Ganhar confiança da comunidade'
    ]
  },
  CHAPTER_5: {
    id: 'chapter_5',
    title: 'O Dia da Eclosão',
    description: 'Resgate e solte os filhotes',
    objectives: [
      'Localizar ninhos ativos',
      'Cavar com cuidado',
      'Medir filhotes',
      'Soltar no rio'
    ]
  },
  CHAPTER_6: {
    id: 'chapter_6',
    title: 'A Cheia e o Silêncio',
    description: 'Conclusão da temporada',
    objectives: [
      'Observar o rio subindo',
      'Desmontar acampamento',
      'Refletir sobre a jornada',
      'Ver créditos finais'
    ]
  }
};

export const NPCS = {
  ADRIANA: {
    id: 'adriana',
    name: 'Dra. Adriana',
    role: 'Coordenadora do Projeto Tartarugas do Xingu',
    personality: 'Sábia, experiente, dedicada, inspiradora',
    gender: 'female' as const,
    dialogues: {
      intro: 'Bem-vindo ao Projeto Tartarugas do Xingu! Desde 2011, já soltamos mais de 6 milhões de filhotes. Trabalhamos com três espécies aqui no Tabuleiro do Embaubal: a tartaruga-da-Amazônia, o tracajá e o pitiú. Nossa missão é proteger os ninhos e garantir que os filhotes cheguem ao rio em segurança.',
      chapter3: 'Nem todo rastro é sinal de vida. A paciência é a primeira virtude de um conservacionista.',
      chapter5: 'Cada filhote que chega à água carrega a história de um trabalho silencioso. Você agora faz parte dessa conquista.'
    }
  },
  LUCAS: {
    id: 'lucas',
    name: 'Dr. Lucas',
    role: 'Especialista em Biologia Reprodutiva',
    personality: 'Analítico, didático, apaixonado por ciência',
    gender: 'male' as const,
    dialogues: {
      intro: 'Eu estudo a reprodução das tartarugas. A maior bota até 100 ovos, o tracajá de 20 a 30, e o pitiú de 8 a 15. O mais fascinante? A temperatura define o sexo: acima de 32°C nascem fêmeas, abaixo de 30°C nascem machos. Por isso monitoramos cada ninho.',
      temperature: 'A temperatura da areia determina o sexo dos filhotes. As mudanças climáticas estão desequilibrando essa proporção.',
      monitoring: 'Monitoramos com sensores para entender como o clima está afetando as populações.'
    }
  },
  ZE_RAIMUNDO: {
    id: 'ze_raimundo',
    name: 'Zé Raimundo',
    role: 'Ribeirinho e Guardião do Xingu',
    personality: 'Carismático, contador de histórias',
    gender: 'male' as const,
    dialogues: {
      intro: 'Bem-vindo ao Xingu! Sou Zé Raimundo, ribeirinho daqui. Esse tabuleiro é sagrado. Antigamente a caça quase acabou com as tartarugas, mas o projeto de 2011 mudou tudo. Já soltamos mais de 6 milhões de filhotes! Esse rio é vida.',
      chapter4: 'O rio dá, o rio tira... Mas se a gente não cuidar, um dia ele se cala.'
    }
  },
  ALINE: {
    id: 'aline',
    name: 'Aline',
    role: 'Bióloga de Campo',
    personality: 'Jovem, idealista, detalhista',
    gender: 'female' as const,
    dialogues: {
      intro: 'Oi! Eu sou a Aline, faço a coleta de dados biométricos. Medimos comprimento, largura e peso de cada tartaruga. A maior chega a 80 cm, o tracajá a 40 cm e o pitiú a 25 cm. Usamos radiotelemetria para rastrear a migração!',
      chapter2: 'Ela pesa quase 40 quilos... imagina o esforço pra subir essa praia.',
      response: 'E a gente ainda acha que somos os únicos a lutar pela vida.',
      vultures: 'Os urubus são oportunistas. Metade dos ninhos pode ser perdida se não estivermos atentos.'
    }
  },
  TAINA: {
    id: 'taina',
    name: 'Tainá',
    role: 'Estudante Indígena e Educadora Ambiental',
    personality: 'Calma, introspectiva, espiritual',
    gender: 'female' as const,
    dialogues: {
      intro: 'Olá, sou Tainá da etnia Juruna. Para meu povo, as tartarugas são sagradas, guardiãs do rio. Meus avós diziam: quando elas desaparecem, o rio esquece quem ele é. Aqui, ciência e conhecimento tradicional protegem juntos o ciclo da vida.',
      chapter5: 'As tartarugas são guardiãs do rio. Quando elas desaparecem, o rio esquece quem ele é.'
    }
  }
};

export const TURTLE_SPECIES = {
  PODOCNEMIS_EXPANSA: {
    scientificName: 'Podocnemis expansa',
    commonName: 'Tartaruga-da-Amazônia',
    avgWeight: 35, // kg
    avgCarapaceLength: 70, // cm
    avgCarapaceWidth: 50, // cm
    nestingPeriod: 'Setembro a Novembro',
    eggsPerNest: 80,
    incubationDays: 45
  },
  PODOCNEMIS_UNIFILIS: {
    scientificName: 'Podocnemis unifilis',
    commonName: 'Tracajá',
    avgWeight: 8, // kg
    avgCarapaceLength: 40, // cm
    avgCarapaceWidth: 30, // cm
    nestingPeriod: 'Setembro a Novembro',
    eggsPerNest: 25,
    incubationDays: 60
  }
};

export const EQUIPMENT = {
  GPS: {
    id: 'gps',
    name: 'GPS Portátil',
    description: 'Registra coordenadas dos ninhos',
    icon: '📍',
    active: false
  },
  CALIPER: {
    id: 'caliper',
    name: 'Paquímetro Digital',
    description: 'Mede comprimento e largura da carapaça',
    icon: '📏',
    active: false
  },
  SCALE: {
    id: 'scale',
    name: 'Balança de Precisão',
    description: 'Pesa filhotes e fêmeas',
    icon: '⚖️',
    active: false
  },
  TAPE: {
    id: 'tape',
    name: 'Trena',
    description: 'Medições de campo',
    icon: '📐',
    active: false
  },
  FLASHLIGHT: {
    id: 'flashlight',
    name: 'Lanterna Frontal',
    description: 'Iluminação noturna',
    icon: '🔦',
    active: false
  },
  CLIPBOARD: {
    id: 'clipboard',
    name: 'Prancheta Digital',
    description: 'Registros de campo',
    icon: '📋',
    active: false
  },
  RADIO: {
    id: 'radio',
    name: 'Rádio Comunicador',
    description: 'Comunicação com equipe',
    icon: '📻',
    active: false
  },
  THERMOMETER: {
    id: 'thermometer',
    name: 'Termômetro de Areia',
    description: 'Mede temperatura da areia (29-36°C)',
    icon: '🌡️',
    active: false
  },
  STAKE_KIT: {
    id: 'stake_kit',
    name: 'Kit de Estacas',
    description: 'Marca ninhos com estacas numeradas',
    icon: '📌',
    active: false
  }
};

export const EDUCATIONAL_MESSAGES = {
  DAMS_IMPACT: {
    theme: 'Impacto das barragens',
    message: 'A alteração do pulso hidrológico modifica as áreas de desova e pode reduzir o sucesso reprodutivo das tartarugas.',
    icon: '🏗️'
  },
  CLIMATE_CHANGE: {
    theme: 'Mudanças climáticas',
    message: 'O aumento da temperatura da areia tende a gerar mais fêmeas, comprometendo a estrutura populacional a longo prazo.',
    icon: '🌡️'
  },
  EGG_COLLECTION: {
    theme: 'Caça e coleta',
    message: 'A coleta excessiva de ovos afeta diretamente o recrutamento populacional das espécies amazônicas.',
    icon: '🥚'
  },
  COMMUNITY_AWARENESS: {
    theme: 'Conscientização comunitária',
    message: 'A proteção das praias depende da parceria com as comunidades ribeirinhas.',
    icon: '👥'
  },
  SEX_DETERMINATION: {
    theme: 'Determinação sexual',
    message: 'A temperatura da areia determina o sexo dos filhotes. Temperaturas acima de 33°C geram principalmente fêmeas.',
    icon: '🌡️'
  },
  PREDATION: {
    theme: 'Predação natural',
    message: 'No Tabuleiro do Embaubal, os urubus são os principais predadores de filhotes de tartarugas.',
    icon: '🦅'
  }
};

export const CONSERVATION_INDEX = {
  LEVELS: {
    CRITICAL: { min: 0, max: 20, label: 'Crítico', color: '#E74C3C' },
    LOW: { min: 21, max: 40, label: 'Baixo', color: '#E67E22' },
    MODERATE: { min: 41, max: 60, label: 'Moderado', color: '#F39C12' },
    GOOD: { min: 61, max: 80, label: 'Bom', color: '#2ECC71' },
    EXCELLENT: { min: 81, max: 100, label: 'Excelente', color: '#27AE60' }
  },
  EFFECTS: {
    HIGH: {
      description: 'Praias limpas, mais ninhos ativos, som de natureza',
      nestSuccess: 0.9,
      wildlifePresence: 1.2
    },
    LOW: {
      description: 'Lixo, urubus, erosão e menos fauna',
      nestSuccess: 0.5,
      wildlifePresence: 0.6
    }
  }
};

export const COLORS = {
  // Paleta Ecobrasil
  ecobrasil: {
    green: '#00A651',
    greenDark: '#008541',
    yellow: '#FFD700',
    blue: '#0066CC',
    blueDark: '#004C99',
    white: '#FFFFFF',
    gray: '#666666'
  },
  // Paleta amazônica realista
  sand: '#D4B896',
  sandDark: '#B89968',
  water: '#6B8E7F',
  waterDark: '#4A6B5E',
  forest: '#2D5016',
  foliage: '#4A7C2C',
  sky: '#87CEEB',
  skyNight: '#1A1A2E',
  sun: '#FFD700',
  moon: '#F0F0F0'
};

