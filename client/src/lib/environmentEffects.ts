/**
 * Environmental Effects Manager
 * Gerencia efeitos visuais do ambiente baseado no ICX
 */

import * as THREE from 'three';

export interface EnvironmentConfig {
  icx: number;
}

export class EnvironmentEffects {
  private scene: THREE.Scene;
  private sunLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemisphere: THREE.HemisphereLight;
  private fogColor: THREE.Color;
  private trashObjects: THREE.Object3D[];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.trashObjects = [];
    
    // Inicializa luzes
    this.sunLight = this.scene.getObjectByName('sunLight') as THREE.DirectionalLight 
      || new THREE.DirectionalLight(0xffffff, 1);
    this.ambientLight = this.scene.getObjectByName('ambientLight') as THREE.AmbientLight 
      || new THREE.AmbientLight(0xffffff, 0.3);
    this.hemisphere = this.scene.getObjectByName('hemisphereLight') as THREE.HemisphereLight 
      || new THREE.HemisphereLight(0x87CEEB, 0x8B7355, 0.6);
    
    this.fogColor = new THREE.Color(0x87CEEB);
  }

  /**
   * Atualiza o ambiente baseado no ICX
   */
  updateEnvironment(icx: number): void {
    this.updateLighting(icx);
    this.updateFog(icx);
    this.updateTrash(icx);
  }

  /**
   * Atualiza a iluminação baseada no ICX
   */
  private updateLighting(icx: number): void {
    if (icx >= 80) {
      // ICX Alto: Luz dourada e natureza viva
      this.sunLight.color.setHex(0xFFD700); // Dourado
      this.sunLight.intensity = 1.2;
      this.ambientLight.color.setHex(0xFFE4B5); // Moccasin dourado
      this.ambientLight.intensity = 0.5;
      this.hemisphere.color.setHex(0x87CEEB); // Céu azul claro
      this.hemisphere.groundColor.setHex(0xD2B48C); // Tan (areia dourada)
      
    } else if (icx >= 50) {
      // ICX Médio: Luz neutra e ambiente estável
      this.sunLight.color.setHex(0xFFFFEE); // Branco neutro
      this.sunLight.intensity = 1.0;
      this.ambientLight.color.setHex(0xFFFFFF); // Branco
      this.ambientLight.intensity = 0.4;
      this.hemisphere.color.setHex(0x87CEEB); // Céu azul
      this.hemisphere.groundColor.setHex(0xC2B280); // Areia normal
      
    } else {
      // ICX Baixo: Céu acinzentado
      this.sunLight.color.setHex(0xCCCCCC); // Cinza claro
      this.sunLight.intensity = 0.7;
      this.ambientLight.color.setHex(0x999999); // Cinza
      this.ambientLight.intensity = 0.3;
      this.hemisphere.color.setHex(0x778899); // Céu acinzentado
      this.hemisphere.groundColor.setHex(0x8B7355); // Areia escura
    }

    // Transição suave
    this.sunLight.color.lerp(this.sunLight.color, 0.1);
    this.ambientLight.color.lerp(this.ambientLight.color, 0.1);
  }

  /**
   * Atualiza a neblina baseada no ICX
   */
  private updateFog(icx: number): void {
    if (icx >= 80) {
      // Céu claro
      this.fogColor.setHex(0x87CEEB);
      if (this.scene.fog && this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.near = 100;
        this.scene.fog.far = 500;
      }
    } else if (icx >= 50) {
      // Neblina leve
      this.fogColor.setHex(0x999999);
      if (this.scene.fog && this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.near = 80;
        this.scene.fog.far = 400;
      }
    } else {
      // Neblina densa
      this.fogColor.setHex(0x666666);
      if (this.scene.fog && this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.near = 50;
        this.scene.fog.far = 300;
      }
    }

    if (this.scene.fog) {
      this.scene.fog.color.copy(this.fogColor);
    }
  }

  /**
   * Gerencia spawn de lixo baseado no ICX
   */
  private updateTrash(icx: number): void {
    const shouldHaveTrash = icx < 50;
    const trashCount = Math.floor((50 - icx) / 5); // 0-10 objetos de lixo

    if (shouldHaveTrash && this.trashObjects.length < trashCount) {
      // Adiciona mais lixo
      const toAdd = trashCount - this.trashObjects.length;
      for (let i = 0; i < toAdd; i++) {
        this.spawnTrash();
      }
    } else if (!shouldHaveTrash || this.trashObjects.length > trashCount) {
      // Remove lixo
      const toRemove = shouldHaveTrash ? this.trashObjects.length - trashCount : this.trashObjects.length;
      for (let i = 0; i < toRemove; i++) {
        this.removeTrash();
      }
    }
  }

  /**
   * Spawna um objeto de lixo na praia
   */
  private spawnTrash(): void {
    const trashTypes = [
      { color: 0x0066CC, size: 0.3, name: 'bottle' },      // Garrafa plástica azul
      { color: 0xFF0000, size: 0.2, name: 'can' },         // Lata vermelha
      { color: 0xFFFFFF, size: 0.25, name: 'bag' },        // Sacola plástica
      { color: 0x333333, size: 0.15, name: 'shoe' },       // Chinelo
      { color: 0x00CC00, size: 0.2, name: 'bottle_green' } // Garrafa verde
    ];

    const type = trashTypes[Math.floor(Math.random() * trashTypes.length)];
    
    // Cria objeto de lixo simples (cubo/cilindro)
    const geometry = type.name === 'bag' 
      ? new THREE.PlaneGeometry(type.size, type.size)
      : new THREE.CylinderGeometry(type.size / 2, type.size / 2, type.size, 8);
    
    const material = new THREE.MeshStandardMaterial({
      color: type.color,
      roughness: 0.7,
      metalness: 0.1
    });

    const trash = new THREE.Mesh(geometry, material);
    trash.name = `trash_${type.name}_${Date.now()}`;
    
    // Posiciona aleatoriamente na praia (zona de areia)
    const beachRadius = 40;
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * (beachRadius - 15);
    
    trash.position.x = Math.cos(angle) * distance;
    trash.position.y = type.size / 2 + 0.1; // Pouco acima do chão
    trash.position.z = Math.sin(angle) * distance;
    
    // Rotação aleatória
    trash.rotation.y = Math.random() * Math.PI * 2;
    if (type.name === 'bag') {
      trash.rotation.x = -Math.PI / 2;
    }

    // Adiciona sombra
    trash.castShadow = true;
    trash.receiveShadow = true;

    this.scene.add(trash);
    this.trashObjects.push(trash);
  }

  /**
   * Remove um objeto de lixo
   */
  private removeTrash(): void {
    if (this.trashObjects.length === 0) return;

    const trash = this.trashObjects.pop();
    if (trash) {
      this.scene.remove(trash);
      
      // Libera memória
      if (trash instanceof THREE.Mesh) {
        trash.geometry.dispose();
        if (trash.material instanceof THREE.Material) {
          trash.material.dispose();
        }
      }
    }
  }

  /**
   * Remove todo o lixo
   */
  clearAllTrash(): void {
    while (this.trashObjects.length > 0) {
      this.removeTrash();
    }
  }

  /**
   * Obtém a cor do céu baseada no ICX
   */
  getSkyColor(icx: number): number {
    if (icx >= 80) return 0x87CEEB; // Azul claro
    if (icx >= 50) return 0x87CEEB; // Azul
    return 0x778899; // Acinzentado
  }

  /**
   * Obtém a intensidade da luz solar baseada no ICX
   */
  getSunIntensity(icx: number): number {
    if (icx >= 80) return 1.2;
    if (icx >= 50) return 1.0;
    return 0.7;
  }
}
