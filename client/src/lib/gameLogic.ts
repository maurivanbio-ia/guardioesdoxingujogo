import * as THREE from 'three';

export interface VultureAI {
  mesh: THREE.Group;
  state: 'circling' | 'diving' | 'attacking' | 'fleeing';
  target: THREE.Group | null;
  circleAngle: number;
  circleRadius: number;
  height: number;
  attackTimer: number;
  fleeTimer: number;
  hasWarnedPlayer: boolean; // Flag para evitar avisos repetidos
}

export interface TurtleState {
  mesh: THREE.Group;
  health: number;
  isBeingAttacked: boolean;
  isSafe: boolean;
  species: string;
}

export interface EcologicalNotification {
  id: string;
  type: 'success' | 'failure' | 'info';
  species?: 'expansa' | 'unifilis' | 'sextuberculata';
  message: string;
  time: number;
  duration?: number;
}

export class GameplayManager {
  private vultures: VultureAI[] = [];
  private turtles: Map<THREE.Group, TurtleState> = new Map();
  private savedTurtles: number = 0;
  private lostTurtles: number = 0;
  private score: number = 0;
  private notifications: EcologicalNotification[] = [];
  private onObjectiveUpdate: ((objectiveId: string, increment: number) => void) | null = null;
  private lastThreatNotificationTime: number = 0;
  private hasShownInitialThreatWarning: boolean = false;

  constructor() {}

  setObjectiveCallback(callback: (objectiveId: string, increment: number) => void) {
    this.onObjectiveUpdate = callback;
  }

  addVulture(vulture: VultureAI) {
    this.vultures.push(vulture);
  }

  addTurtle(mesh: THREE.Group, species: string) {
    this.turtles.set(mesh, {
      mesh,
      health: 100,
      isBeingAttacked: false,
      isSafe: false,
      species,
    });
  }

  updateVultures(delta: number, playerPosition: THREE.Vector3) {
    this.vultures.forEach((vulture) => {
      switch (vulture.state) {
        case 'circling':
          // Voar em círculos procurando tartarugas
          vulture.circleAngle += delta * 0.5;
          vulture.mesh.position.x = Math.cos(vulture.circleAngle) * vulture.circleRadius;
          vulture.mesh.position.z = Math.sin(vulture.circleAngle) * vulture.circleRadius;
          vulture.mesh.position.y = vulture.height + Math.sin(vulture.circleAngle * 2) * 2;
          
          // Procurar tartaruga vulnerável
          if (Math.random() < 0.01) {
            const vulnerableTurtles = Array.from(this.turtles.values())
              .filter(t => !t.isSafe && !t.isBeingAttacked && t.health > 0);
            
            if (vulnerableTurtles.length > 0) {
              vulture.target = vulnerableTurtles[Math.floor(Math.random() * vulnerableTurtles.length)].mesh;
              vulture.state = 'diving';
            }
          }
          break;

        case 'diving':
          // Descer em direção à tartaruga
          if (vulture.target) {
            const targetPos = vulture.target.position;
            vulture.mesh.position.x += (targetPos.x - vulture.mesh.position.x) * delta * 2;
            vulture.mesh.position.z += (targetPos.z - vulture.mesh.position.z) * delta * 2;
            vulture.mesh.position.y -= delta * 8;

            if (vulture.mesh.position.y < 3) {
              vulture.state = 'attacking';
              vulture.attackTimer = 0;
              const turtleState = this.turtles.get(vulture.target);
              if (turtleState) {
                turtleState.isBeingAttacked = true;
              }
            }
          }
          break;

        case 'attacking':
          // Atacar tartaruga
          vulture.attackTimer += delta;
          
          if (vulture.target) {
            const turtleState = this.turtles.get(vulture.target);
            if (turtleState && turtleState.health > 0) {
              // AVISO CONSOLIDADO: Mostrar apenas quando PRIMEIRA ameaça aparecer
              // Cooldown de 15 segundos entre avisos de ameaça
              if (!vulture.hasWarnedPlayer) {
                vulture.hasWarnedPlayer = true;
                
                const now = Date.now();
                const activeThreats = this.vultures.filter(v => v.state === 'attacking' || v.state === 'diving').length;
                
                // Só mostrar notificação se for a primeira ameaça OU passou o cooldown
                if (!this.hasShownInitialThreatWarning || now - this.lastThreatNotificationTime > 15000) {
                  this.hasShownInitialThreatWarning = true;
                  this.lastThreatNotificationTime = now;
                  
                  const message = activeThreats > 1 
                    ? `⚠️ ${activeThreats} urubus atacando tartarugas! Espante-os!`
                    : '⚠️ Urubu atacando! Aproxime-se para espantá-lo!';
                  
                  this.addEcologicalNotification(
                    'failure', 
                    turtleState.species as 'expansa' | 'unifilis' | 'sextuberculata', 
                    message,
                    5000
                  );
                }
              }
              
              // Causar dano
              if (vulture.attackTimer > 1) {
                turtleState.health -= 10;
                vulture.attackTimer = 0;
                
                if (turtleState.health <= 0) {
                  this.lostTurtles++;
                  this.score -= 20;
                  // Removido aviso repetitivo de "predada" 
                  turtleState.isBeingAttacked = false;
                  vulture.state = 'circling';
                  vulture.target = null;
                  vulture.hasWarnedPlayer = false; // Reset flag
                  
                  // Update phase objectives
                  if (this.onObjectiveUpdate) {
                    this.onObjectiveUpdate('max_losses', 1);
                  }
                }
              }
            }
          }
          break;

        case 'fleeing':
          // Fugir do biólogo
          vulture.fleeTimer += delta;
          vulture.mesh.position.y += delta * 10;
          
          if (vulture.fleeTimer > 2) {
            vulture.state = 'circling';
            vulture.fleeTimer = 0;
            vulture.hasWarnedPlayer = false; // Reset flag quando voltar a circular
            const turtleState = vulture.target ? this.turtles.get(vulture.target) : null;
            if (turtleState) {
              turtleState.isBeingAttacked = false;
            }
            vulture.target = null;
          }
          break;
      }

      // Verificar se biólogo está próximo para espantar urubu
      const distanceToPlayer = vulture.mesh.position.distanceTo(playerPosition);
      if (distanceToPlayer < 5 && vulture.state !== 'fleeing') {
        vulture.state = 'fleeing';
        vulture.fleeTimer = 0;
        vulture.hasWarnedPlayer = false; // Reset flag ao espantar
        this.score += 5;
        
        // DISPARAR EVENTO DE XP GAIN (+5 XP por espantar urubu)
        window.dispatchEvent(new CustomEvent('xpGained', { detail: 5 }));
        
        const turtleState = vulture.target ? this.turtles.get(vulture.target) : null;
        
        // Add educational message about vultures (every 3rd scare)
        if (Math.random() < 0.33) {
          setTimeout(() => {
            this.addEcologicalNotification(
              'info', 
              undefined, 
              'No Tabuleiro do Embaubal, os urubus são os principais predadores de filhotes de tartarugas.',
              8000 // 8 seconds duration for educational message
            );
          }, 1000);
        }
        
        // Update phase objectives
        if (this.onObjectiveUpdate) {
          this.onObjectiveUpdate('scare_vultures', 1);
          this.onObjectiveUpdate('night_vultures', 1);
          this.onObjectiveUpdate('final_vultures', 1);
        }
        
        if (turtleState) {
          turtleState.isBeingAttacked = false;
          if (turtleState.health > 0 && turtleState.health < 100) {
            this.savedTurtles++;
            this.score += 15;
            this.addEcologicalNotification('success', turtleState.species as 'expansa' | 'unifilis' | 'sextuberculata', '🛡️ Tartaruga salva ao espantar urubu!');
            
            // Update phase objectives
            if (this.onObjectiveUpdate) {
              this.onObjectiveUpdate('save_turtles', 1);
              this.onObjectiveUpdate('protect_hatchlings', 1);
              this.onObjectiveUpdate('final_turtles', 1);
            }
          }
        }
        vulture.target = null;
      }
    });
  }

  markTurtleSafe(turtleMesh: THREE.Group) {
    const state = this.turtles.get(turtleMesh);
    if (state && !state.isSafe) {
      state.isSafe = true;
      this.score += 10;
      this.addEcologicalNotification('success', state.species as 'expansa' | 'unifilis' | 'sextuberculata', 'marcada e protegida!');
      
      // Update phase objectives
      if (this.onObjectiveUpdate) {
        this.onObjectiveUpdate('mark_turtles', 1);
        this.onObjectiveUpdate('biometric_data', 1);
        this.onObjectiveUpdate('species_id', 1);
      }
    }
  }

  addEcologicalNotification(
    type: 'success' | 'failure' | 'info', 
    species?: 'expansa' | 'unifilis' | 'sextuberculata', 
    message?: string,
    duration?: number
  ) {
    const id = `${Date.now()}-${Math.random()}`;
    this.notifications.push({ 
      id,
      type,
      species,
      message: message || '',
      time: Date.now(),
      duration
    });
    // LIMITE MÁXIMO: 2 notificações simultâneas (evita spam visual)
    if (this.notifications.length > 2) {
      this.notifications.shift();
    }
  }

  getNotifications(): EcologicalNotification[] {
    const now = Date.now();
    const activeNotifications = this.notifications.filter(n => {
      const maxDuration = n.duration || 5000; // Default 5s, or custom duration
      return now - n.time < maxDuration;
    });
    
    // Garantir máximo de 2 notificações ativas (hard cap)
    return activeNotifications.slice(-2);
  }

  getStats() {
    const activeThreats = this.vultures.filter(v => v.state === 'attacking' || v.state === 'diving').length;
    return {
      savedTurtles: this.savedTurtles,
      lostTurtles: this.lostTurtles,
      score: this.score,
      turtlesAtRisk: Array.from(this.turtles.values()).filter(t => t.isBeingAttacked).length,
      activeThreats: activeThreats,
    };
  }

  getTurtleHealth(turtleMesh: THREE.Group): number {
    return this.turtles.get(turtleMesh)?.health || 0;
  }
}
