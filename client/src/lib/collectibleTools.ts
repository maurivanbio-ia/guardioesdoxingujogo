/**
 * Collectible Tools System
 * Sistema de ferramentas científicas coletáveis
 */

import * as THREE from 'three';

export type ToolType = 'thermometer' | 'ruler' | 'scale' | 'notebook' | 'gps';

export interface CollectibleTool {
  type: ToolType;
  name: string;
  namePT: string;
  description: string;
  mesh: THREE.Group;
  collected: boolean;
  position: THREE.Vector3;
}

export class CollectibleToolsManager {
  private tools: CollectibleTool[] = [];
  private scene: THREE.Scene;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  
  /**
   * Cria todas as ferramentas coletáveis no cenário
   */
  createTools(): void {
    const toolsData: Array<{ type: ToolType; x: number; z: number; y: number }> = [
      { type: 'thermometer', x: -30, z: 15, y: 1.5 },     // Esquerda-cima, mais alto e visível
      { type: 'ruler', x: 25, z: -20, y: 1.5 },           // Direita-baixo, mais alto e visível
      { type: 'scale', x: -15, z: -30, y: 1.5 },          // Centro-baixo, mais alto e visível
      { type: 'notebook', x: 35, z: 20, y: 1.5 },         // Direita-cima, mais alto e visível
      { type: 'gps', x: 0, z: 0, y: 1.5 },                // Centro da praia, mais alto e visível
    ];
    
    toolsData.forEach(({ type, x, z, y }) => {
      const tool = this.createToolMesh(type);
      tool.mesh.position.set(x, y, z);
      // Preservar userData existente (animationPhase) e adicionar novos campos
      Object.assign(tool.mesh.userData, {
        type: 'collectible_tool',
        toolType: type,
        interactable: true,
        baseY: y, // Armazenar altura base para animação
      });
      
      this.tools.push(tool);
      this.scene.add(tool.mesh);
    });
    
    console.log(`🧰 ${this.tools.length} ferramentas criadas no cenário`);
  }
  
  /**
   * Cria a mesh visual de uma ferramenta
   */
  private createToolMesh(type: ToolType): CollectibleTool {
    const group = new THREE.Group();
    group.name = `tool_${type}`;
    
    const toolInfo = this.getToolInfo(type);
    
    // Base luminosa MAIOR para destaque mais visível
    const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.5,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0;
    group.add(glow);
    
    // Adicionar luz pontual para iluminar ao redor da ferramenta
    const toolLight = new THREE.PointLight(0xFFD700, 2, 8);
    toolLight.position.y = 0;
    group.add(toolLight);
    
    // Criar modelo 3D da ferramenta
    const toolMesh = this.createToolModel(type);
    toolMesh.position.y = 0.3;
    group.add(toolMesh);
    
    // Animação de rotação e flutuação
    group.userData.animationPhase = Math.random() * Math.PI * 2;
    
    return {
      type,
      name: type,
      namePT: toolInfo.namePT,
      description: toolInfo.description,
      mesh: group,
      collected: false,
      position: new THREE.Vector3(),
    };
  }
  
  /**
   * Cria o modelo 3D específico de cada ferramenta
   */
  private createToolModel(type: ToolType): THREE.Group {
    const model = new THREE.Group();
    
    switch (type) {
      case 'thermometer':
        // Termômetro: tubo vermelho
        const thermBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8),
          new THREE.MeshStandardMaterial({ color: 0xFF0000 })
        );
        thermBody.castShadow = true;
        model.add(thermBody);
        break;
        
      case 'ruler':
        // Régua: barra amarela
        const ruler = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.05, 0.05),
          new THREE.MeshStandardMaterial({ color: 0xFFFF00 })
        );
        ruler.castShadow = true;
        model.add(ruler);
        break;
        
      case 'scale':
        // Balança: plataforma + base
        const scalePlatform = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16),
          new THREE.MeshStandardMaterial({ color: 0x808080 })
        );
        scalePlatform.position.y = 0.15;
        scalePlatform.castShadow = true;
        model.add(scalePlatform);
        
        const scaleBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16),
          new THREE.MeshStandardMaterial({ color: 0x404040 })
        );
        scaleBase.castShadow = true;
        model.add(scaleBase);
        break;
        
      case 'notebook':
        // Caderneta: livro verde
        const notebook = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.35, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        notebook.castShadow = true;
        model.add(notebook);
        break;
        
      case 'gps':
        // GPS: dispositivo azul
        const gpsBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.25, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x1E90FF })
        );
        gpsBody.castShadow = true;
        model.add(gpsBody);
        
        const gpsScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(0.12, 0.15),
          new THREE.MeshBasicMaterial({ color: 0x00FF00 })
        );
        gpsScreen.position.set(0, 0, 0.026);
        model.add(gpsScreen);
        break;
    }
    
    return model;
  }
  
  /**
   * Retorna informações sobre a ferramenta
   */
  private getToolInfo(type: ToolType): { namePT: string; description: string } {
    const info = {
      thermometer: {
        namePT: 'Termômetro Digital',
        description: 'Mede a temperatura do ninho (define sexo dos filhotes)',
      },
      ruler: {
        namePT: 'Régua de Medição',
        description: 'Mede comprimento e largura de tartarugas',
      },
      scale: {
        namePT: 'Balança Portátil',
        description: 'Pesa tartarugas adultas e filhotes',
      },
      notebook: {
        namePT: 'Caderneta de Campo',
        description: 'Registra observações científicas',
      },
      gps: {
        namePT: 'GPS de Mão',
        description: 'Marca localização de ninhos no mapa',
      },
    };
    
    return info[type];
  }
  
  /**
   * Atualiza animações das ferramentas
   */
  update(delta: number): void {
    this.tools.forEach((tool) => {
      if (!tool.collected && tool.mesh) {
        // Rotação suave
        tool.mesh.rotation.y += delta * 0.5;
        
        // Flutuação vertical usando a altura base configurada
        tool.mesh.userData.animationPhase += delta * 2;
        const bobbing = Math.sin(tool.mesh.userData.animationPhase) * 0.15;
        const baseY = tool.mesh.userData.baseY || 1.5; // Usar baseY armazenado ou padrão 1.5
        tool.mesh.position.y = baseY + bobbing;
      }
    });
  }
  
  /**
   * Coleta uma ferramenta
   */
  collectTool(type: ToolType): boolean {
    const tool = this.tools.find((t) => t.type === type && !t.collected);
    
    if (tool) {
      tool.collected = true;
      this.scene.remove(tool.mesh);
      console.log(`✅ Ferramenta coletada: ${tool.namePT}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Retorna todas as ferramentas
   */
  getTools(): CollectibleTool[] {
    return this.tools;
  }
  
  /**
   * Retorna ferramentas coletadas
   */
  getCollectedTools(): ToolType[] {
    return this.tools.filter((t) => t.collected).map((t) => t.type);
  }
  
  /**
   * Verifica se uma ferramenta foi coletada
   */
  hasTool(type: ToolType): boolean {
    return this.tools.some((t) => t.type === type && t.collected);
  }
  
  /**
   * Retorna ferramentas não coletadas como meshes para interação
   */
  getInteractableMeshes(): THREE.Group[] {
    return this.tools.filter((t) => !t.collected).map((t) => t.mesh);
  }
  
  /**
   * Limpa recursos
   */
  dispose(): void {
    this.tools.forEach((tool) => {
      if (!tool.collected) {
        this.scene.remove(tool.mesh);
      }
      tool.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    });
    
    this.tools = [];
  }
}
