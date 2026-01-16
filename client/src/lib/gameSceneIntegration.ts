/**
 * GameScene Integration Helpers
 * Helpers para integrar sistemas profissionais ao GameScene
 */

import * as THREE from 'three';
// FloatingEggsManager removed - eggs only in nests now
import { ProximityDetector, ProximityTarget } from './proximityDetector';
import { EnvironmentEffects } from './environmentEffects';

export interface NestData {
  id: string;
  number: number;
  position: { x: number; y: number; z: number };
  species: 'expansa' | 'unifilis' | 'sextuberculata';
  marked: boolean;
}

/**
 * DISABLED: setupFloatingEggs removed - eggs only in nests now
 * Nests display their own eggs via NestData system
 */

/**
 * Inicializa detector de proximidade com todos os alvos
 */
export function setupProximityDetector(
  nests: NestData[],
  npcs: any[],
  researchHouse?: THREE.Object3D,
  boat?: THREE.Object3D
): ProximityDetector {
  const detector = new ProximityDetector();
  
  // Adicionar ninhos
  nests.forEach(nest => {
    detector.addTarget({
      id: `nest-${nest.id}`,
      position: new THREE.Vector3(nest.position.x, nest.position.y, nest.position.z),
      radius: 3, // 3 metros de raio
      type: 'nest',
      data: nest
    });
  });
  
  // Adicionar NPCs
  npcs.forEach((npc, index) => {
    if (npc.position) {
      detector.addTarget({
        id: `npc-${index}`,
        position: npc.position.clone(),
        radius: 4, // 4 metros para NPCs
        type: 'npc',
        data: npc
      });
    }
  });
  
  // Adicionar casa de pesquisa
  if (researchHouse) {
    detector.addTarget({
      id: 'research-house',
      position: researchHouse.position.clone(),
      radius: 5,
      type: 'research_house'
    });
  }
  
  // Adicionar barco
  if (boat) {
    detector.addTarget({
      id: 'boat',
      position: boat.position.clone(),
      radius: 6,
      type: 'boat'
    });
  }
  
  return detector;
}

/**
 * Inicializa efeitos ambientais
 */
export function setupEnvironmentEffects(
  scene: THREE.Scene
): EnvironmentEffects {
  return new EnvironmentEffects(scene);
}

/**
 * Atualiza todos os sistemas no loop de animação
 */
export function updateGameSystems(
  deltaTime: number,
  eggsManager: null, // Always null - eggs only in nests
  proximityDetector: ProximityDetector | null,
  playerPosition: THREE.Vector3,
  environmentEffects: EnvironmentEffects | null,
  icx: number
) {
  // No floating eggs to update - eggs are part of nest display
  
  // Verificar proximidade
  let nearestTarget: ProximityTarget | null = null;
  if (proximityDetector) {
    const nearbyTargets = proximityDetector.checkProximity(playerPosition);
    if (nearbyTargets.length > 0) {
      nearestTarget = nearbyTargets[0]; // Pegar o mais próximo
    }
  }
  
  // Atualizar ambiente baseado no ICX
  if (environmentEffects) {
    environmentEffects.updateEnvironment(icx);
  }
  
  return {
    nearestTarget,
    showInteractionPrompt: nearestTarget !== null
  };
}

/**
 * Marca um ninho
 * Note: No floating eggs to remove - nests display their own eggs
 */
export function markNest(
  nestId: string,
  eggsManager: null, // Always null now
  updateICX?: (action: string) => void
) {
  // No egg removal needed - eggs are part of nest display
  
  // Atualizar ICX
  if (updateICX) {
    updateICX('NEST_MARKED');
  }
  
  console.log(`✅ Ninho ${nestId} marcado com sucesso!`);
}

/**
 * Dispara eventos customizados para GameUI
 */
export function dispatchGameEvents(
  playerPosition: THREE.Vector3,
  entities: { nests: NestData[]; npcs: any[]; vultures: any[] }
) {
  // Evento de movimento do jogador
  window.dispatchEvent(new CustomEvent('playerMoved', {
    detail: {
      x: playerPosition.x,
      y: playerPosition.y,
      z: playerPosition.z
    }
  }));
  
  // Evento de atualização de entidades para minimapa
  const entityData = [
    ...entities.nests.map(n => ({
      type: 'nest',
      position: n.position,
      marked: n.marked
    })),
    ...entities.npcs.map(npc => ({
      type: 'npc',
      position: npc.position
    })),
    ...entities.vultures.map(v => ({
      type: 'vulture',
      position: v.position
    }))
  ];
  
  window.dispatchEvent(new CustomEvent('entitiesUpdated', {
    detail: entityData
  }));
}

/**
 * Setup completo - Chamado uma vez no início
 */
export async function setupProfessionalGameSystems(
  scene: THREE.Scene,
  nests: NestData[],
  npcs: any[],
  researchHouse?: THREE.Object3D,
  boat?: THREE.Object3D
) {
  // DISABLED: Floating eggs system - only eggs in nests now
  // const eggsManager = await setupFloatingEggs(scene, nests);
  const eggsManager = null; // No floating eggs
  
  const proximityDetector = setupProximityDetector(nests, npcs, researchHouse, boat);
  const environmentEffects = setupEnvironmentEffects(scene);
  
  console.log('🌟 Sistemas profissionais inicializados:');
  console.log(`  ✅ Ovos nos ninhos (ovos flutuantes desativados)`);
  console.log(`  ✅ ${proximityDetector.getTargetCount()} alvos de proximidade`);
  console.log('  ✅ Efeitos ambientais ativos');
  
  return {
    eggsManager,
    proximityDetector,
    environmentEffects
  };
}
