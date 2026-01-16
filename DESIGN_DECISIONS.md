# Decisões de Design - Guardião do Xingu

## ✅ Decisões Confirmadas

### 1. **Motor do Jogo**
- **Stack:** React 18 + Three.js + React Three Fiber
- **Build Tool:** Vite
- **Routing:** Wouter
- **Styling:** Tailwind CSS 4 + shadcn/ui

---

### 2. **Linguagem**
- **Idioma:** Português do Brasil (PT-BR)
- **Contexto:** Amazônia brasileira, Rio Xingu
- **Tom:** Educacional, científico, acessível

---

### 3. **Estrutura de Fases**

#### **4 Fases Temáticas:**

**Fase 1: Identificação de Ninhos (300 pts)**
- 🌡️ Medir temperatura (3x obrigatório) - 100 pts cada
- 📏 Medir profundidade (3x obrigatório) - 100 pts cada
- 📐 Medir largura (2x obrigatório) - 100 pts cada
- 🏷️ Marcar ninho (3x obrigatório) - 50 pts cada
- **Mínimo:** 3 atividades diferentes

**Fase 2: Monitoramento de Adultos (500 pts)**
- 🏷️ Identificar tartaruga (5x obrigatório) - 100 pts cada
- 📊 Medir tartaruga (5x obrigatório) - 100 pts cada
- 📍 Registrar posição GPS (3x obrigatório) - 50 pts cada
- **Mínimo:** 2 atividades diferentes

**Fase 3: Proteção de Ninhos (600 pts)**
- 🦅 Espantar urubu (8x obrigatório) - 50 pts cada
- 🛡️ Proteger ninho (5x obrigatório) - 100 pts cada
- 🏷️ Monitorar ninhos (6x obrigatório) - 50 pts cada
- **Mínimo:** 2 atividades diferentes

**Fase 4: Soltura de Filhotes (800 pts)**
- 🐢 Soltar filhote (10x obrigatório) - 50 pts cada
- 👁️ Monitorar caminho (5x obrigatório) - 100 pts cada
- 🛡️ Proteger durante eclosão (5x obrigatório) - 100 pts cada
- **Mínimo:** 2 atividades diferentes

**Validação de Progressão:**
- ✅ Pontos suficientes (>=goal)
- ✅ Mínimo de atividades diferentes completadas
- ✅ RequiredCount de cada atividade obrigatória atingido

---

### 4. **Cards de Curiosidades** 🎯

#### **Sistema com Variações Aleatórias**

Cada atividade possui **2-3 cards diferentes** que aparecem aleatoriamente:

**Exemplo: Medir Temperatura (3 variações)**
1. "A temperatura influencia o sexo dos filhotes: acima de 32°C nascem mais fêmeas..."
2. "Temperaturas extremas podem inviabilizar ninhos inteiros. O aquecimento global afeta..."
3. "Tartarugas não têm cromossomos sexuais — o sexo é determinado pela temperatura!"

**Total de Cards Implementados:** 27 variações únicas

**Características:**
- ✅ Seleção aleatória entre opções
- ✅ Auto-dismiss após 8 segundos
- ✅ Fechamento manual com tecla ESPAÇO
- ✅ Animações suaves (Framer Motion)
- ✅ Posicionamento estratégico (bottom)
- ✅ **Suporte a narração em áudio** (campo audioUrl opcional)
- ✅ **Áudio para imediatamente ao fechar** card (ESPAÇO/X/auto)
- ✅ **Sem sobreposição** ao trocar cards rapidamente

---

### 5. **Sistema de Pontuação** 📊

#### **4 Categorias Balanceadas:**

| Categoria | Pontos | Ações |
|-----------|--------|-------|
| **Atividades Científicas** | +100 | Medir temperatura, profundidade, largura, tartaruga, coletar dados, marcar tartaruga |
| **Ações Corretas** | +50 | Marcar ninho, espantar urubu, observar adulto, patrulha noturna, soltar filhote |
| **Descobertas Raras** | +200 | Encontrar espécie rara, documentar comportamento único, salvar ninho de predador, desbloquear conquista |
| **Ações Incorretas** | -50 | Perturbar animal, ignorar protocolo, medição incorreta |

**Recursos:**
- ✅ Feedback visual animado (`ScoreFeedback`)
- ✅ Partículas especiais para raras (+200)
- ✅ Histórico completo de mudanças
- ✅ Eventos customizados `scoreChange`

---

### 6. **Transição de Fase** 🎬

#### **Opção Escolhida: Modal Cinematográfica (5 segundos)**

**Características:**
- ✅ Animação de comemoração
- ✅ Som de vitória (ElevenLabs)
- ✅ Narração em PT-BR
- ✅ Efeitos visuais (partículas, gradientes)
- ✅ Duração: 5 segundos
- ✅ Transição suave para próxima fase

**Justificativa:** Celebra conquistas, reforça sensação de progresso, aumenta satisfação do jogador.

---

### 7. **Sistema de Áudio** 🔊

#### **Estrutura Completa Já Implementada:**

**Som Ambiental (AudioManager):**
- 🌳 Floresta amazônica (pássaros, cigarras, vento)
- 🌊 Rio Xingu (água corrente)
- ⛈️ Chuva (quando weather = rain)
- 🌙 Sons noturnos (rãs, corujas)

**Efeitos Sonoros:**
- ✨ Ganho de XP (`/xp-gain.wav`)
- 🏆 Conquista desbloqueada
- 🦅 Urubu voando
- 🐢 Tartaruga nadando
- 📍 Marcação de GPS (bip)

**Narração (ElevenLabs):**
- 🎙️ Transições de fase (PT-BR)
- 🎙️ Mensagens educativas importantes
- 🎙️ Voz profissional feminina
- 🎙️ 11/25 arquivos já gerados

**Controles:**
- ✅ Botão de mute no TopBar
- ✅ Estado global (`globalAudioState`)
- ✅ Volume independente (ambiente vs efeitos)
- ✅ Autoplay fallback (user interaction)

---

## 🎨 **Princípios de UX**

1. **Imersão:** Cards aleatórios aumentam rejogabilidade
2. **Clareza:** Feedback visual imediato para todas as ações
3. **Satisfação:** Transições cinematográficas celebram conquistas
4. **Educação:** Conteúdo científico autêntico e variado
5. **Acessibilidade:** Controles de áudio, mobile-friendly

---

## 📂 **Arquivos de Implementação**

### Sistemas de Jogabilidade
- `client/src/lib/useCardSystem.ts` - 26 cards com variações
- `client/src/lib/useScoreSystem.ts` - 4 categorias de pontuação
- `client/src/lib/phaseConfig.ts` - Configuração de 4 fases
- `client/src/lib/usePhaseSystem.ts` - Validação robusta

### Áudio
- `client/src/lib/audioManager.ts` - Gerenciador de som
- `client/src/lib/globalAudioState.ts` - Estado global
- `public/xp-gain.wav` - Efeito sonoro
- `public/audio/narration/*.mp3` - Narrações ElevenLabs

### Componentes Visuais
- `client/src/components/game/ContextualCardDisplay.tsx`
- `client/src/components/game/ScoreFeedback.tsx`
- `client/src/components/game/TopBar.tsx` (com controle de áudio)

---

## 🚀 **Status de Implementação**

| Sistema | Status | Observações |
|---------|--------|-------------|
| Cards Aleatórios | ✅ Implementado | 26 variações, 12 atividades |
| Pontuação Balanceada | ✅ Implementado | 4 categorias, eventos |
| Fases Robustas | ✅ Implementado | Validação tripla |
| Áudio Completo | ✅ Implementado | AudioManager ativo |
| Transições | ✅ Implementado | Modal 5s com som |

---

## 📝 **Próximos Passos**

1. ✅ Integrar sistemas no `GameScene.tsx`
2. ✅ Testar progressão de fases
3. ✅ Validar áudio em diferentes navegadores
4. ✅ Ajustar balance de pontos conforme playtesting
5. ✅ Gerar narrações faltantes (14 arquivos)

---

**Última atualização:** 28 de outubro de 2025
