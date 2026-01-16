# 🎮 Guia de Integração - Sistemas Profissionais

Este documento explica como integrar todos os sistemas profissionais e educativos ao GameScene.

## ✅ Sistemas Implementados

### 1. **WelcomeModal + InteractiveTutorial** (Integrado)
- ✅ Fluxo automático: WelcomeModal → InteractiveTutorial → Gameplay
- ✅ Evento `tutorialComplete` disparado ao finalizar
- ✅ PremiumHUD aparece após tutorial completo

### 2. **FloatingEggsManager** (Pronto para integração)
- Sistema de ovos flutuantes 3D nos ninhos
- Animações: flutuação, rotação, brilho pulsante
- Remoção automática ao marcar ninho

### 3. **ProximityDetector** (Pronto para integração)
- Detecção de proximidade para ninhos, NPCs, boat, research house
- Callbacks enter/exit
- Query por tipo e raio

### 4. **EnvironmentEffects** (Pronto para integração)
- Iluminação dinâmica baseada no ICX
- Spawn de lixo quando ICX < 50
- Neblina adaptativa

### 5. **ScientificCuriosityManager** (Integrado)
- ✅ Curiosidades aparecem a cada 5 minutos
- ✅ 10 curiosidades em 4 categorias

### 6. **PremiumHUD** (Integrado)
- ✅ 6 ícones circulares com badges
- ✅ Painel de controles expansível

### 7. **Minimapa** (Integrado)
- ✅ Eventos customizados: playerMoved, entitiesUpdated
- ✅ Renderiza jogador, ninhos, NPCs, urubus

---

## 🔧 Integração ao GameScene

### Passo 1: Importar sistemas

```typescript
// No topo do GameScene.tsx
import { setupProfessionalGameSystems, updateGameSystems, markNest, dispatchGameEvents } from '@/lib/gameSceneIntegration';
import { FloatingEggsManager } from '@/lib/floatingEggs';
import { ProximityDetector } from '@/lib/proximityDetector';
import { EnvironmentEffects } from '@/lib/environmentEffects';
```

### Passo 2: Adicionar refs

```typescript
const floatingEggsRef = useRef<FloatingEggsManager | null>(null);
const proximityDetectorRef = useRef<ProximityDetector | null>(null);
const environmentEffectsRef = useRef<EnvironmentEffects | null>(null);
const [showNestPanel, setShowNestPanel] = useState(false);
const [selectedNest, setSelectedNest] = useState<any>(null);
```

### Passo 3: Inicializar após criar cena (dentro do useEffect)

```typescript
// Após criar ninhos, NPCs, luzes, etc...
const { eggsManager, proximityDetector, environmentEffects } = setupProfessionalGameSystems(
  scene,
  nestsData, // Array de ninhos
  npcsArray, // Array de NPCs
  sunLight,
  hemisphereLight,
  researchHouseRef.current,
  boatRef.current
);

floatingEggsRef.current = eggsManager;
proximityDetectorRef.current = proximityDetector;
environmentEffectsRef.current = environmentEffects;
```

### Passo 4: Atualizar no loop de animação

```typescript
// Dentro do animate(), após atualizar jogador
if (gameStateRef.current.gameStarted && !gameStateRef.current.isPaused) {
  const { nearestTarget, showInteractionPrompt } = updateGameSystems(
    delta,
    floatingEggsRef.current,
    proximityDetectorRef.current,
    playerRef.current.position,
    environmentEffectsRef.current,
    conservationManagerRef.current.getICX()
  );

  // Mostrar prompt "Pressione E para interagir"
  if (showInteractionPrompt && nearestTarget?.type === 'nest') {
    // TODO: Mostrar UI "Press E"
  }

  // Disparar eventos para GameUI (Minimapa)
  if (frameCount % 10 === 0) { // A cada 10 frames
    dispatchGameEvents(
      playerRef.current.position,
      {
        nests: nestsData,
        npcs: npcsArray,
        vultures: vultureArray
      }
    );
  }
}
```

### Passo 5: Adicionar listener de tecla E

```typescript
// Dentro do handleKeyDown
if (e.key === 'e' || e.key === 'E') {
  if (proximityDetectorRef.current) {
    const nearest = proximityDetectorRef.current.getNearestTarget(
      playerRef.current.position,
      'nest'
    );
    
    if (nearest && nearest.data) {
      setSelectedNest(nearest.data);
      setShowNestPanel(true);
    }
  }
}
```

### Passo 6: Adicionar NestInteractionPanel ao render

```typescript
// No return do GameScene
{showNestPanel && selectedNest && (
  <NestInteractionPanel
    nest={selectedNest}
    onClose={() => setShowNestPanel(false)}
    onMark={(nestId, data) => {
      // Atualizar dados do ninho
      const nest = nestsData.find(n => n.id === nestId);
      if (nest) {
        Object.assign(nest, data);
        if (data.marked) {
          markNest(nestId, floatingEggsRef.current, updateICX);
        }
      }
      setShowNestPanel(false);
    }}
  />
)}
```

---

## 🎯 Eventos Customizados

### Disparados pelo GameScene:
- `playerMoved` - Posição do jogador (para Minimapa)
- `entitiesUpdated` - Array de entidades (para Minimapa)

### Disparados pelo GameUI:
- `tutorialComplete` - Tutorial finalizado
- `scareVultures` - Espantar urubus (tecla Espaço)

---

## 🧪 Teste da Integração

### Checklist:
- [ ] Ovos aparecem acima dos ninhos não marcados
- [ ] Ovos flutuam e brilham
- [ ] Proximidade detectada (≤3m do ninho)
- [ ] Pressionar E abre NestInteractionPanel
- [ ] Marcar ninho remove ovo
- [ ] ICX > 80: iluminação dourada
- [ ] ICX < 50: spawn de lixo
- [ ] Minimapa mostra jogador + entidades
- [ ] Curiosidades aparecem a cada 5min
- [ ] Tutorial inicial funciona

---

## 📊 Performance

- **Ovos**: ~300 vértices por ovo (otimizado)
- **Proximity**: O(n) por frame, onde n = número de alvos
- **Environment**: Apenas atualiza quando ICX muda
- **Events**: Throttled (a cada 10 frames)

---

## 🚀 Resultado Final

Com todas as integrações:
- ✅ Experiência educativa completa (tutorial + curiosidades)
- ✅ Feedback visual profissional (ovos, iluminação, HUD)
- ✅ Interações intuitivas (proximidade + tecla E)
- ✅ Sistema de conservação dinâmico (ICX afeta ambiente)
- ✅ UI moderna e responsiva
