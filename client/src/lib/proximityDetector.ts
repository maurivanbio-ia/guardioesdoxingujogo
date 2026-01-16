/**
 * Proximity Detection System
 * Sistema de detecção de proximidade para interações
 */

import * as THREE from 'three';

export interface ProximityTarget {
  id: string;
  position: THREE.Vector3;
  radius: number;
  type: 'nest' | 'npc' | 'research_house' | 'boat' | 'equipment';
  data?: any;
}

export class ProximityDetector {
  private targets: Map<string, ProximityTarget>;
  private activeTargets: Set<string>;
  private callbacks: Map<string, Array<(target: ProximityTarget) => void>>;

  constructor() {
    this.targets = new Map();
    this.activeTargets = new Set();
    this.callbacks = new Map();
  }

  /**
   * Adiciona um alvo para detecção
   */
  addTarget(target: ProximityTarget): void {
    this.targets.set(target.id, target);
  }

  /**
   * Remove um alvo
   */
  removeTarget(id: string): void {
    this.targets.delete(id);
    this.activeTargets.delete(id);
  }

  /**
   * Atualiza a posição de um alvo
   */
  updateTargetPosition(id: string, position: THREE.Vector3): void {
    const target = this.targets.get(id);
    if (target) {
      target.position.copy(position);
    }
  }

  /**
   * Verifica proximidade do jogador com todos os alvos
   */
  checkProximity(playerPosition: THREE.Vector3): ProximityTarget[] {
    const nearbyTargets: ProximityTarget[] = [];
    const previouslyActive = new Set(this.activeTargets);

    this.targets.forEach((target) => {
      const distance = playerPosition.distanceTo(target.position);
      const isNearby = distance <= target.radius;

      if (isNearby) {
        nearbyTargets.push(target);

        // Se não estava ativo antes, dispara callback de "entrada"
        if (!this.activeTargets.has(target.id)) {
          this.activeTargets.add(target.id);
          this.triggerCallbacks('enter', target);
        }
      } else if (this.activeTargets.has(target.id)) {
        // Estava ativo mas agora saiu do raio
        this.activeTargets.delete(target.id);
        this.triggerCallbacks('exit', target);
      }
    });

    return nearbyTargets;
  }

  /**
   * Obtém o alvo mais próximo de um tipo específico
   */
  getNearestTarget(
    playerPosition: THREE.Vector3,
    type?: ProximityTarget['type']
  ): ProximityTarget | null {
    let nearest: ProximityTarget | null = null;
    let minDistance = Infinity;

    this.targets.forEach((target) => {
      if (type && target.type !== type) return;

      const distance = playerPosition.distanceTo(target.position);
      if (distance < minDistance && distance <= target.radius) {
        minDistance = distance;
        nearest = target;
      }
    });

    return nearest;
  }

  /**
   * Registra callback para eventos de proximidade
   */
  onProximity(
    event: 'enter' | 'exit',
    callback: (target: ProximityTarget) => void
  ): () => void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);

    // Retorna função de cleanup
    return () => {
      const callbacks = this.callbacks.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Dispara callbacks
   */
  private triggerCallbacks(event: 'enter' | 'exit', target: ProximityTarget): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(target));
    }
  }

  /**
   * Verifica se está próximo a algum alvo de um tipo
   */
  isNearType(type: ProximityTarget['type']): boolean {
    const activeArray = Array.from(this.activeTargets);
    for (const id of activeArray) {
      const target = this.targets.get(id);
      if (target && target.type === type) {
        return true;
      }
    }
    return false;
  }

  /**
   * Obtém todos os alvos ativos (dentro do raio)
   */
  getActiveTargets(): ProximityTarget[] {
    const activeArray = Array.from(this.activeTargets);
    return activeArray
      .map(id => this.targets.get(id))
      .filter((t): t is ProximityTarget => t !== undefined);
  }

  /**
   * Limpa todos os alvos
   */
  clear(): void {
    this.targets.clear();
    this.activeTargets.clear();
  }

  /**
   * Obtém quantidade de alvos
   */
  getTargetCount(): number {
    return this.targets.size;
  }
}
