/**
 * Floating Eggs System
 * Sistema de ovos flutuantes para identificação visual de ninhos
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface FloatingEgg {
  mesh: THREE.Group | THREE.Mesh;
  nestId: string;
  initialY: number;
  floatSpeed: number;
  rotationSpeed: number;
}

// Cache global para modelo GLB
let eggModelCache: THREE.Group | null = null;
let eggModelLoading: Promise<THREE.Group> | null = null;

export class FloatingEggsManager {
  private eggs: Map<string, FloatingEgg>;
  private scene: THREE.Scene;
  private loader: GLTFLoader;

  constructor(scene: THREE.Scene) {
    this.eggs = new Map();
    this.scene = scene;
    this.loader = new GLTFLoader();
  }

  /**
   * Carrega o modelo GLB do ovo (cached)
   */
  private async loadEggModel(): Promise<THREE.Group> {
    if (eggModelCache) {
      return Promise.resolve(eggModelCache);
    }

    if (eggModelLoading) {
      return eggModelLoading;
    }

    eggModelLoading = new Promise((resolve, reject) => {
      this.loader.load(
        '/models/ovo.glb',
        (gltf: any) => {
          const model = gltf.scene;
          model.scale.set(0.15, 0.15, 0.15); // Ajustar escala do ovo
          
          // Configurar materiais para brilho
          model.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                const mat = child.material as THREE.MeshStandardMaterial;
                mat.emissive = new THREE.Color(0xFFA500);
                mat.emissiveIntensity = 0.3;
              }
            }
          });
          
          eggModelCache = model;
          resolve(model);
        },
        undefined,
        (error: any) => {
          console.error('Erro ao carregar modelo do ovo:', error);
          reject(error);
        }
      );
    });

    return eggModelLoading;
  }

  /**
   * Deep clone de um modelo GLB (duplica geometrias e materiais)
   */
  private deepCloneGLB(source: THREE.Group): THREE.Group {
    const cloned = source.clone();
    
    // Percorrer e clonar materiais/geometrias para evitar compartilhamento
    cloned.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        // Clonar geometria
        if (child.geometry) {
          child.geometry = child.geometry.clone();
        }
        
        // Clonar material(is)
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat: THREE.Material) => mat.clone());
          } else {
            child.material = child.material.clone();
          }
        }
      }
    });
    
    return cloned;
  }

  /**
   * Cria um ovo flutuante para um ninho
   */
  async createEgg(nestId: string, position: { x: number; y: number; z: number }): Promise<FloatingEgg> {
    try {
      // Tentar carregar modelo 3D
      const modelTemplate = await this.loadEggModel();
      const egg = this.deepCloneGLB(modelTemplate); // Deep clone ao invés de clone()
      
      // Posicionar acima do ninho
      const floatHeight = 2.0 + Math.random() * 0.5; // 2-2.5m de altura
      egg.position.set(position.x, floatHeight, position.z);

      // Dados de animação
      const floatingEgg: FloatingEgg = {
        mesh: egg,
        nestId,
        initialY: floatHeight,
        floatSpeed: 0.5 + Math.random() * 0.3,
        rotationSpeed: 0.5 + Math.random() * 0.5
      };

      // Adicionar à cena
      this.scene.add(egg);
      this.eggs.set(nestId, floatingEgg);

      // Adicionar luz para brilho
      const light = new THREE.PointLight(0xFFD700, 0.8, 5);
      light.position.set(0, 0, 0);
      egg.add(light);

      return floatingEgg;
    } catch (error) {
      // Fallback para geometria procedural se modelo falhar
      console.warn('Usando ovo procedural como fallback');
      return this.createProceduralEgg(nestId, position);
    }
  }

  /**
   * Cria ovo procedural (fallback)
   */
  private createProceduralEgg(nestId: string, position: { x: number; y: number; z: number }): FloatingEgg {
    const eggGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    eggGeometry.scale(1, 1.3, 1);

    const eggMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      emissive: 0xFFA500,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85
    });

    const egg = new THREE.Mesh(eggGeometry, eggMaterial);
    const floatHeight = 2.0 + Math.random() * 0.5;
    egg.position.set(position.x, floatHeight, position.z);
    egg.castShadow = true;

    const floatingEgg: FloatingEgg = {
      mesh: egg,
      nestId,
      initialY: floatHeight,
      floatSpeed: 0.5 + Math.random() * 0.3,
      rotationSpeed: 0.5 + Math.random() * 0.5
    };

    this.scene.add(egg);
    this.eggs.set(nestId, floatingEgg);

    const light = new THREE.PointLight(0xFFD700, 0.8, 5);
    light.position.copy(egg.position);
    egg.add(light);

    return floatingEgg;
  }

  /**
   * Remove o ovo de um ninho (quando marcado)
   */
  removeEgg(nestId: string): void {
    const egg = this.eggs.get(nestId);
    if (egg) {
      // Remover imediatamente (sem animação para evitar complexidade com Groups)
      this.scene.remove(egg.mesh);
      
      // Dispose de recursos baseado no tipo
      if (egg.mesh instanceof THREE.Mesh) {
        // Ovo procedural - dispose direto
        egg.mesh.geometry.dispose();
        (egg.mesh.material as THREE.Material).dispose();
      } else if (egg.mesh instanceof THREE.Group) {
        // Ovo GLB - percorrer e fazer dispose de todos os recursos
        egg.mesh.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat: THREE.Material) => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
      
      this.eggs.delete(nestId);
    }
  }

  /**
   * Atualiza animações de todos os ovos
   */
  update(deltaTime: number): void {
    const time = Date.now() * 0.001; // Tempo em segundos

    this.eggs.forEach((egg) => {
      // Movimento de flutuação (senoidal)
      egg.mesh.position.y = egg.initialY + Math.sin(time * egg.floatSpeed) * 0.3;

      // Rotação suave no eixo Y
      egg.mesh.rotation.y += deltaTime * egg.rotationSpeed;

      // Pulso suave na emissão (brilho) - funciona tanto para Mesh quanto Group
      if (egg.mesh instanceof THREE.Mesh) {
        const material = egg.mesh.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.2;
      } else if (egg.mesh instanceof THREE.Group) {
        // Para GLB (Group), percorrer todos os meshes filhos
        egg.mesh.traverse((child: any) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            if (mat.emissive) {
              mat.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.2;
            }
          }
        });
      }
    });
  }

  /**
   * Obtém todos os ovos
   */
  getAllEggs(): FloatingEgg[] {
    return Array.from(this.eggs.values());
  }

  /**
   * Verifica se um ninho tem ovo
   */
  hasEgg(nestId: string): boolean {
    return this.eggs.has(nestId);
  }

  /**
   * Limpa todos os ovos
   */
  clear(): void {
    this.eggs.forEach((egg) => {
      this.scene.remove(egg.mesh);
      
      // Dispose de recursos baseado no tipo
      if (egg.mesh instanceof THREE.Mesh) {
        // Ovo procedural
        egg.mesh.geometry.dispose();
        (egg.mesh.material as THREE.Material).dispose();
      } else if (egg.mesh instanceof THREE.Group) {
        // Ovo GLB - percorrer e fazer dispose
        egg.mesh.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat: THREE.Material) => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    });
    this.eggs.clear();
  }

  /**
   * Obtém quantidade de ovos ativos
   */
  getCount(): number {
    return this.eggs.size;
  }
}
