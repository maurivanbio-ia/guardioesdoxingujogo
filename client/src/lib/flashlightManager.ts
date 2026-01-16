/**
 * Flashlight Manager
 * Gerencia a lanterna do jogador com iluminação SpotLight
 */

import * as THREE from 'three';

export class FlashlightManager {
  private spotLight: THREE.SpotLight;
  private targetObject: THREE.Object3D;
  private isActive: boolean = false;
  
  constructor(scene: THREE.Scene) {
    // Criar alvo para o spotlight
    this.targetObject = new THREE.Object3D();
    scene.add(this.targetObject);
    
    // Criar spotlight para lanterna
    this.spotLight = new THREE.SpotLight(
      0xFFFFDD, // Cor amarelada da lanterna
      2.5,      // Intensidade
      25,       // Distância
      Math.PI / 6, // Ângulo (30 graus)
      0.3,      // Penumbra (borda suave)
      1.5       // Decay
    );
    
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 30;
    
    this.spotLight.target = this.targetObject;
    this.spotLight.visible = false;
    
    scene.add(this.spotLight);
  }
  
  /**
   * Ativa ou desativa a lanterna
   */
  toggle(): boolean {
    this.isActive = !this.isActive;
    this.spotLight.visible = this.isActive;
    return this.isActive;
  }
  
  /**
   * Liga a lanterna
   */
  turnOn(): void {
    this.isActive = true;
    this.spotLight.visible = true;
  }
  
  /**
   * Desliga a lanterna
   */
  turnOff(): void {
    this.isActive = false;
    this.spotLight.visible = false;
  }
  
  /**
   * Atualiza a posição da lanterna baseado no jogador
   */
  update(playerPosition: THREE.Vector3, playerRotation: number): void {
    if (!this.isActive) return;
    
    // Posicionar lanterna na cabeça do jogador
    this.spotLight.position.copy(playerPosition);
    this.spotLight.position.y += 1.6; // Altura da cabeça
    
    // Calcular direção baseado na rotação do jogador
    const direction = new THREE.Vector3(
      Math.sin(playerRotation),
      -0.3, // Apontar ligeiramente para baixo
      Math.cos(playerRotation)
    );
    
    // Posicionar alvo à frente do jogador
    this.targetObject.position.copy(playerPosition);
    this.targetObject.position.add(direction.multiplyScalar(5));
  }
  
  /**
   * Verifica se a lanterna está ativa
   */
  isOn(): boolean {
    return this.isActive;
  }
  
  /**
   * Limpa recursos
   */
  dispose(): void {
    this.spotLight.dispose();
  }
}
