# Sistema de Áudio para Cards Contextuais

## 🔊 Visão Geral

Os cards contextuais agora suportam **narração em português** que toca automaticamente quando o card aparece e **para imediatamente** quando o jogador fechar o card (seja com ESPAÇO, botão X, ou auto-fechamento após 8s).

---

## ✅ Recursos Implementados

### **1. Reprodução Automática**
- Áudio toca automaticamente quando card aparece
- Respeita estado de mute global (`globalAudioState`)
- Volume padrão: 0.7 (70%)

### **2. Parada Imediata ao Fechar**
O áudio para instantaneamente em **todos** os cenários:

| Ação do Jogador | Comportamento |
|-----------------|---------------|
| Pressionar **ESPAÇO** | ✅ Áudio para imediatamente |
| Clicar no **botão X** | ✅ Áudio para imediatamente |
| **Auto-fechar** após 8s | ✅ Áudio para imediatamente |
| **Trocar** para outro card | ✅ Áudio anterior para, novo áudio inicia |

### **3. Sem Sobreposição**
- Ao trocar cards rapidamente, o áudio anterior **sempre** para antes do novo começar
- Não há race conditions ou sobreposição de narrações

---

## 🎯 Como Adicionar Áudio aos Cards

### **Passo 1: Gerar Narração (ElevenLabs)**

Use a API ElevenLabs para gerar narrações em português:

```bash
# Exemplo: Gerar narração para card de temperatura
node scripts/generate-audio.js "A temperatura influencia o sexo dos filhotes..."
```

Salve os arquivos em:
```
public/audio/cards/
├── card_temp_1.mp3
├── card_temp_2.mp3
├── card_temp_3.mp3
└── ...
```

---

### **Passo 2: Adicionar audioUrl ao Card**

Edite `client/src/lib/useCardSystem.ts`:

```typescript
measureTemp: [
  {
    id: 'card_temp_1',
    eventKey: 'measureTemp',
    title: '🌡️ Temperatura do Ninho',
    text: 'A temperatura influencia o sexo dos filhotes...',
    duration: 8000,
    position: 'bottom',
    audioUrl: '/audio/cards/card_temp_1.mp3', // ← Adicione esta linha!
  },
  // ... outras variações
],
```

---

### **Passo 3: Testar**

1. Inicie o jogo
2. Execute uma ação que mostra um card
3. Verifique:
   - ✅ Áudio toca automaticamente
   - ✅ Ao pressionar ESPAÇO, áudio para imediatamente
   - ✅ Ao clicar X, áudio para imediatamente
   - ✅ Após 8s, áudio para automaticamente

---

## 📋 Checklist de Cards com Áudio ✅

### ✅ **Todos Completos!**

- [x] 🌡️ `measureTemp` (3 variações) - **3/3 ✅**
- [x] 🐢 `releaseHatchling` (3 variações) - **3/3 ✅**
- [x] 🦅 `scareVulture` (3 variações) - **3/3 ✅**
- [x] 📏 `measureDepth` (2 variações) - **2/2 ✅**
- [x] 📐 `measureWidth` (2 variações) - **2/2 ✅**
- [x] 📊 `measureTurtle` (2 variações) - **2/2 ✅**
- [x] 🏷️ `markNest` (2 variações) - **2/2 ✅**
- [x] 🏷️ `tagTurtle` (2 variações) - **2/2 ✅**
- [x] 🥚 `findEgg` (2 variações) - **2/2 ✅**
- [x] 👁️ `observeAdult` (2 variações) - **2/2 ✅**
- [x] 📝 `collectData` (2 variações) - **2/2 ✅**
- [x] 🌙 `nightPatrol` (2 variações) - **2/2 ✅**

**Total:** 27/27 narrações geradas (3.1 MB)

---

## 🎙️ Diretrizes para Narração

### **Tom e Estilo:**
- Voz feminina, tom educacional e acolhedor
- Ritmo moderado (não muito rápido)
- Ênfase em termos científicos importantes
- Duração ideal: 5-8 segundos

### **Exemplo de Script:**

```
Card: "A temperatura influencia o sexo dos filhotes: 
       acima de 32°C nascem mais fêmeas, 
       abaixo de 28°C mais machos."

Narração (ElevenLabs):
"A temperatura influência o SEXO dos filhotes... 
 acima de trinta e dois graus nascem mais fêmeas... 
 abaixo de vinte e oito graus, mais machos."
```

---

## 🔧 Configurações Técnicas

### **Volume:**
Padrão: 0.7 (70%)  
Editável em: `client/src/components/game/ContextualCardDisplay.tsx`

```typescript
audioRef.current.volume = 0.7; // Altere aqui se necessário
```

### **Respeita Mute Global:**
```typescript
if (activeCard.audioUrl && !globalAudioState.isMuted()) {
  // Só toca se áudio não estiver mutado
}
```

---

## 🐛 Troubleshooting

### **Áudio não toca:**
1. Verificar se `audioUrl` está definido no card
2. Verificar se arquivo existe em `public/audio/cards/`
3. Verificar se áudio global não está muted
4. Checar console do navegador para erros

### **Áudio continua tocando após fechar:**
Isso **não deve acontecer** com a implementação atual.  
Se ocorrer, é um bug crítico — reporte imediatamente!

### **Áudios se sobrepõem:**
Isso **não deve acontecer** com a implementação atual.  
A lógica garante que o áudio anterior para antes do novo começar.

---

## 📊 Status Atual

| Componente | Status | Observações |
|------------|--------|-------------|
| Interface `ContextualCard` | ✅ Implementado | Campo `audioUrl` opcional |
| Reprodução automática | ✅ Implementado | Toca ao aparecer card |
| Parada imediata | ✅ Implementado | Para ao fechar (ESPAÇO/X/auto) |
| Sem sobreposição | ✅ Implementado | Áudio anterior para primeiro |
| Respeita mute global | ✅ Implementado | Verifica `globalAudioState` |
| Arquivos de áudio | ✅ **COMPLETO** | **27/27 narrações geradas** |
| Cards com audioUrl | ✅ **COMPLETO** | **27/27 cards configurados** |

---

## ✅ Sistema Completo e Funcional!

Todos os 27 cards educacionais agora possuem narração profissional em português brasileiro:

- ✅ **27 arquivos de áudio gerados** via ElevenLabs
- ✅ **Todos os cards configurados** com campo `audioUrl`
- ✅ **Sistema de parada imediata** funcionando (ESPAÇO/X/auto)
- ✅ **Sem sobreposição** ao trocar cards rapidamente
- ✅ **Respeita estado de mute** do jogo

### 🎮 Como Testar

1. Inicie o jogo
2. Execute uma ação que mostra um card (ex: medir temperatura)
3. **Áudio toca automaticamente** com narração infantil
4. Pressione **ESPAÇO** → áudio para imediatamente
5. Execute outra ação → novo card com novo áudio (sem sobreposição)

### 🔧 Ajustes Opcionais

Se precisar ajustar o volume:
```typescript
// Em: client/src/components/game/ContextualCardDisplay.tsx
audioRef.current.volume = 0.7; // Altere aqui (0.0 a 1.0)
```

---

**Última atualização:** 28 de outubro de 2025
