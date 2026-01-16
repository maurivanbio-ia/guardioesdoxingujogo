# 🎮 Guia de Sistemas de Jogabilidade Aprimorados

Este guia explica como integrar os novos sistemas de cards contextuais, pontuação balanceada e gerenciamento robusto de fases.

---

## 📦 Sistemas Implementados

### 1. **useCardSystem** - Cards Contextuais
Exibe cards educativos em resposta a ações específicas do jogador.

```tsx
import { useCardSystem } from '@/lib/useCardSystem';
import { ContextualCardDisplay } from '@/components/game/ContextualCardDisplay';

function MyGameComponent() {
  const { activeCard, showCard, hideCard } = useCardSystem();

  const handleMeasureTemperature = () => {
    showCard('measureTemp'); // Mostra card contextual
  };

  return (
    <>
      <button onClick={handleMeasureTemperature}>Medir Temperatura</button>
      <ContextualCardDisplay activeCard={activeCard} onClose={hideCard} />
    </>
  );
}
```

**12 Cards Disponíveis:**
- `measureTemp`, `measureDepth`, `measureWidth` - Medições de ninho
- `markNest`, `tagTurtle`, `measureTurtle` - Ações de registro
- `scareVulture`, `observeAdult`, `nightPatrol` - Ações comportamentais
- `releaseHatchling`, `findEgg`, `collectData` - Ações de conservação

---

### 2. **useScoreSystem** - Pontuação Balanceada
Sistema de pontuação com diferentes valores para diferentes tipos de ações.

```tsx
import { useScoreSystem } from '@/lib/useScoreSystem';
import { ScoreFeedback } from '@/components/game/ScoreFeedback';

function MyGameComponent() {
  const { score, addScore, lastScoreChange } = useScoreSystem();

  const handleScientificAction = () => {
    addScore('measureTemp'); // +100 pontos
  };

  return (
    <>
      <div>Pontuação: {score}</div>
      <ScoreFeedback lastScoreChange={lastScoreChange} />
    </>
  );
}
```

**Categorias de Pontuação:**
- **Atividades Científicas (+100)**: measureTemp, measureDepth, measureTurtle
- **Ações Corretas (+50)**: markNest, scareVulture, observeAdult
- **Descobertas Raras (+200)**: findRareSpecies, saveNestFromPredator
- **Ações Incorretas (-50)**: disturbAnimal, skipProtocol

---

### 3. **usePhaseSystem** - Gerenciamento Robusto de Fases
Previne transições prematuras e garante progressão controlada.

```tsx
import { usePhaseSystem } from '@/lib/usePhaseSystem';

function MyGameComponent() {
  const {
    currentPhaseData,
    progress,
    recordActivity,
    completePhase,
    isPhaseComplete
  } = usePhaseSystem();

  const handleMeasureTemp = () => {
    recordActivity('measureTemp'); // Registra atividade na fase
  };

  return (
    <div>
      <h2>{currentPhaseData.title}</h2>
      <progress value={progress.percentage} max={100} />
      
      {isPhaseComplete && (
        <button onClick={completePhase}>Avançar para Próxima Fase</button>
      )}
    </div>
  );
}
```

**4 Fases Configuradas:**
1. **Identificação de Ninhos** (300 pts) - Medir temperatura, profundidade, marcar
2. **Monitoramento de Adultos** (500 pts) - Identificar e medir tartarugas
3. **Proteção de Ninhos** (600 pts) - Espantar predadores, proteger
4. **Soltura de Filhotes** (800 pts) - Liberar filhotes, monitorar

---

## 🔗 Integração Completa (Exemplo)

```tsx
export function GameUI() {
  const { activeCard, showCard, hideCard } = useCardSystem();
  const { score, addScore, lastScoreChange } = useScoreSystem();
  const { 
    currentPhaseData, 
    progress, 
    recordActivity, 
    completePhase,
    isPhaseComplete 
  } = usePhaseSystem();

  // Função unificada para ações do jogo
  const handleGameAction = (actionType: string) => {
    switch (actionType) {
      case 'measureTemp':
        recordActivity('measureTemp');  // 1. Registra na fase
        addScore('measureTemp');        // 2. Adiciona pontos (+100)
        showCard('measureTemp');        // 3. Mostra card educativo
        break;
    }
  };

  return (
    <div>
      <ContextualCardDisplay activeCard={activeCard} onClose={hideCard} />
      <ScoreFeedback lastScoreChange={lastScoreChange} />
    </div>
  );
}
```

---

## 🎯 Mapeamento de Interações

| Interação 3D | recordActivity | addScore | showCard |
|-------------|----------------|----------|----------|
| Medir temperatura | `measureTemp` | `measureTemp` (+100) | `measureTemp` |
| Medir profundidade | `measureDepth` | `measureDepth` (+100) | `measureDepth` |
| Marcar ninho | `markNest` | `markNest` (+50) | `markNest` |
| Medir tartaruga | `measureTurtle` | `measureTurtle` (+100) | `measureTurtle` |
| Espantar urubu | `scareVulture` | `scareVulture` (+50) | `scareVulture` |

---

## 🔊 Eventos Customizados

```tsx
// Mudança de pontuação
window.addEventListener('scoreChange', (e: CustomEvent) => {
  console.log('Pontos:', e.detail.points);
});

// Fase completada
window.addEventListener('phaseCompleted', (e: CustomEvent) => {
  console.log('Fase completada:', e.detail.completedPhase);
});

// Fase pronta para conclusão
window.addEventListener('phaseReadyToComplete', (e: CustomEvent) => {
  console.log('Mostrar modal de comemoração');
});
```

---

## 📚 Arquivos Criados

1. `client/src/lib/useCardSystem.ts` - Hook de cards contextuais
2. `client/src/lib/useScoreSystem.ts` - Hook de pontuação
3. `client/src/lib/usePhaseSystem.ts` - Hook de gerenciamento de fases
4. `client/src/lib/phaseConfig.ts` - Configuração modular de fases
5. `client/src/components/game/ContextualCardDisplay.tsx` - Componente visual de cards
6. `client/src/components/game/ScoreFeedback.tsx` - Feedback de pontuação

---

## ✅ Checklist de Integração

- [ ] Importar hooks nos componentes de jogo
- [ ] Adicionar `<ContextualCardDisplay />` e `<ScoreFeedback />` no GameUI
- [ ] Mapear todas as interações 3D para `handleGameAction()`
- [ ] Criar modal de comemoração para `isPhaseComplete`
- [ ] Atualizar HUD para mostrar `progress.percentage`
- [ ] Testar progressão completa das 4 fases
- [ ] Verificar que cards não sobrepõem elementos do HUD
- [ ] Confirmar que tecla ESPAÇO fecha cards manualmente

---

**Próximos passos:**
1. Integrar hooks no GameUI.tsx existente
2. Conectar interações do GameScene.tsx aos sistemas
3. Criar modal de comemoração de fases
4. Testar fluxo completo
