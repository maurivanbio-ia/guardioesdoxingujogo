import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useGame } from '@/contexts/GameContext';
import { GAME_CONFIG, COLORS, NPCS } from '@/lib/gameConstants';
import { GameplayManager, VultureAI, EcologicalNotification as EcologicalNotificationType } from '@/lib/gameLogic';
import { AudioManager } from '@/lib/audioManager';
import { PhaseTransition } from './PhaseTransition';
import { EcologicalNotification } from './EcologicalNotification';
import { ResearchDialogue } from './ResearchDialogue';
import { BoatDialogue } from './BoatDialogue';
import { NestActionBalloon } from './NestActionBalloon';
import { TurtleActionBalloon } from './TurtleActionBalloon';
import { VultureScareInfo } from './VultureScareInfo';
import { ThreatHUD } from './ThreatHUD';
import { TopBar } from './TopBar';
import { ToolInventory } from './ToolInventory';
import { HydrologicalCycleControl } from './HydrologicalCycleControl';
import { DayNightControl } from './DayNightControl';
import { FlashlightControl } from './FlashlightControl';
import { MapControl } from './MapControl';
import { KeyboardShortcutsPanel } from './KeyboardShortcutsPanel';
import { ToolsInfoPanel } from './ToolsInfoPanel';
import { FullMap } from './FullMap';
import { setupProfessionalGameSystems, updateGameSystems, type NestData } from '@/lib/gameSceneIntegration';
// FloatingEggsManager removed - eggs only in nests now
import { ProximityDetector } from '@/lib/proximityDetector';
import { EnvironmentEffects } from '@/lib/environmentEffects';
import { DayNightCycleManager } from '@/lib/dayNightCycle';
import { HydrologicalCycleManager, HydrologicalPhase } from '@/lib/hydrologicalCycle';
import { FlashlightManager } from '@/lib/flashlightManager';
import { CollectibleToolsManager, type ToolType } from '@/lib/collectibleTools';
import { RainParticlesManager } from '@/lib/rainParticles';
import { createEnvironmentalImpacts, getImpactAtPosition, type ImpactMesh } from '@/lib/environmentalImpactsSpawner';
import { ImpactActionDialog } from './ImpactActionDialog';
import { NestToolsDialog } from './NestToolsDialog';
import { TurtleToolsDialog } from './TurtleToolsDialog';
import { EducationalCard } from './EducationalCard';
import { ENVIRONMENTAL_IMPACTS, type EnvironmentalImpact } from '@/lib/educationalPointsSystem';
import { getEducationalCard } from '@/lib/educationalContent';
import { XPParticles } from './XPParticles';
import { InteractionGlow } from './InteractionGlow';
import { CollectionEffect } from './CollectionEffect';
import { FieldGuide } from './FieldGuide';
import { AchievementsManager } from '@/lib/achievementsSystem';
import { soundLibrary } from '@/lib/soundLibrary';
import { randomEventsManager, type RandomEvent } from '@/lib/randomEventsSystem';
import { RandomEventNotification } from './RandomEventNotification';
import { EducationalMiniGames } from './EducationalMiniGames';
import { MiniGamesMenu } from './MiniGamesMenu';
import { AudioControlPanel } from './AudioControlPanel';
import { weatherSystem } from '@/lib/dynamicWeatherSystem';
import { WeatherNotification } from './WeatherNotification';
import { VirtualJoystick } from './VirtualJoystick';
import { VirtualActionButtons } from './VirtualActionButtons';
import { useIsMobile } from '@/hooks/useIsMobile';
import { DialogueBox } from './DialogueBox';

export function GameScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const virtualJoystick = useRef({ x: 0, y: 0 });
  const virtualRun = useRef(false);
  const clockRef = useRef(new THREE.Clock());
  const rafIdRef = useRef<number | null>(null);
  const gameplayManagerRef = useRef<GameplayManager | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  
  // Professional game systems
  // const eggsManagerRef = useRef<FloatingEggsManager | null>(null); // DISABLED: Only eggs in nests now
  const proximityDetectorRef = useRef<ProximityDetector | null>(null);
  const environmentEffectsRef = useRef<EnvironmentEffects | null>(null);
  const dayNightCycleRef = useRef<DayNightCycleManager | null>(null);
  const hydrologicalCycleRef = useRef<HydrologicalCycleManager | null>(null);
  const flashlightRef = useRef<FlashlightManager | null>(null);
  const collectibleToolsRef = useRef<CollectibleToolsManager | null>(null);
  const rainParticlesRef = useRef<RainParticlesManager | null>(null);
  
  const { gameState, updatePhaseObjective, canAdvancePhase, advancePhase, isGameComplete, getCurrentPhase, checkAndUpdateAchievements, updateICX, addPhaseXP } = useGame();
  const [showTransition, setShowTransition] = useState(true);
  const lastCompletedPhaseRef = useRef<number | null>(null);
  
  // Use a ref to keep gameState current in the animation loop
  const gameStateRef = useRef(gameState);

  // Game stats state
  const [gameStats, setGameStats] = useState({
    savedTurtles: 0,
    lostTurtles: 0,
    score: 0,
    turtlesAtRisk: 0,
  });
  const [notifications, setNotifications] = useState<EcologicalNotificationType[]>([]);
  const [activeThreats, setActiveThreats] = useState(0);
  const [showResearchDialogue, setShowResearchDialogue] = useState(false);
  const [nearResearchHouse, setNearResearchHouse] = useState(false);
  const nearResearchHouseRef = useRef(false); // Ref to track proximity in event handlers
  
  // Helper function to add notification with hard limit of 2
  const addNotification = (notification: EcologicalNotificationType) => {
    setNotifications(prev => {
      const newNotifications = [...prev, notification];
      // Manter apenas as 2 mais recentes
      return newNotifications.slice(-2);
    });
  };
  const researchHouseRef = useRef<THREE.Group | null>(null);
  const [showBoatDialogue, setShowBoatDialogue] = useState(false);
  const [nearBoat, setNearBoat] = useState(false);
  const nearBoatRef = useRef(false); // Ref to track proximity to boat
  const [boatNotificationShown, setBoatNotificationShown] = useState(false);
  
  // Day/Night and Flashlight states
  const [isNightTime, setIsNightTime] = useState(false);
  const [needsFlashlight, setNeedsFlashlight] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [currentHour, setCurrentHour] = useState(8); // Game starts at 8:00
  
  // Collectible tools state
  const [collectedTools, setCollectedTools] = useState<ToolType[]>([]);
  const collectedToolsRef = useRef<ToolType[]>([]); // Ref to always have the latest value
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  
  // Hydrological cycle state
  const [currentHydrologicalPhase, setCurrentHydrologicalPhase] = useState<HydrologicalPhase>('seca');
  
  // Full Map state
  const [showFullMap, setShowFullMap] = useState(false);
  const [mapEntities, setMapEntities] = useState<any[]>([]);
  
  // Nest interaction state
  const [showNestActionBalloon, setShowNestActionBalloon] = useState(false);
  const [selectedNestId, setSelectedNestId] = useState<string | null>(null);
  const [showNestToolsDialog, setShowNestToolsDialog] = useState(false);
  const [selectedNestData, setSelectedNestData] = useState<{ id: string; species: 'expansa' | 'unifilis' | 'sextuberculata' } | null>(null);
  
  // Turtle interaction state
  const [showTurtleActionBalloon, setShowTurtleActionBalloon] = useState(false);
  const [selectedTurtleId, setSelectedTurtleId] = useState<string | null>(null);
  const [showTurtleToolsDialog, setShowTurtleToolsDialog] = useState(false);
  const [selectedTurtleData, setSelectedTurtleData] = useState<{ id: string; species: 'expansa' | 'unifilis' | 'sextuberculata' } | null>(null);
  
  // Vulture scare info state
  const [showVultureScareInfo, setShowVultureScareInfo] = useState(false);
  
  // Tutorial completion state - game only starts after tutorial
  const [tutorialFinished, setTutorialFinished] = useState(false);
  
  // Environmental impacts state
  const [showImpactDialog, setShowImpactDialog] = useState(false);
  const [selectedImpact, setSelectedImpact] = useState<EnvironmentalImpact | null>(null);
  
  // New enhancement states
  const [showFieldGuide, setShowFieldGuide] = useState(false);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  
  // NPC Dialogue state
  const [showNPCDialogue, setShowNPCDialogue] = useState(false);
  const [currentNPCDialogue, setCurrentNPCDialogue] = useState<{ name: string; role: string; dialogue: string } | null>(null);
  const [unlockedSpecies, setUnlockedSpecies] = useState<('expansa' | 'unifilis' | 'sextuberculata')[]>([]);
  const achievementsManagerRef = useRef<AchievementsManager>(new AchievementsManager());
  const impactMeshesRef = useRef<ImpactMesh[]>([]);
  
  // Wildlife refs
  const fishArrayRef = useRef<{ mesh: THREE.Group; jumpTimer: number; jumping: boolean; velocity: THREE.Vector3 }[]>([]);
  const alligatorArrayRef = useRef<{ mesh: THREE.Group; swimTimer: number; targetTurtle: THREE.Group | null }[]>([]);
  
  // Interaction prompt state (for mobile controls)
  const [showInteractPrompt, setShowInteractPrompt] = useState(false);
  
  // Educational card state
  const [educationalCard, setEducationalCard] = useState<{
    id: string;
    title: string;
    content: string;
    icon?: string;
    autoCloseDelay?: number;
  } | null>(null);
  
  // Random events state
  const [activeRandomEvent, setActiveRandomEvent] = useState<RandomEvent | null>(null);
  const [eventTimeRemaining, setEventTimeRemaining] = useState(0);
  const lastEventCheckRef = useRef(0);
  
  // Mini-games state
  const [showMiniGamesMenu, setShowMiniGamesMenu] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<'nest_temperature' | 'species_identification' | 'turtle_anatomy' | null>(null);
  
  // Audio control state
  const [showAudioControl, setShowAudioControl] = useState(false);
  
  // Mobile detection
  const isMobile = useIsMobile();
  
  // XP and ICX states for TopBar
  const [playerXP, setPlayerXP] = useState(0);
  // Conservation ICX is now managed by GameContext/ConservationManager
  // const [conservationICX, setConservationICX] = useState(75);
  
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Listen for entities updates (for map)
  useEffect(() => {
    const handleEntitiesUpdate = (e: any) => {
      setMapEntities(e.detail || []);
    };
    
    window.addEventListener('entitiesUpdated', handleEntitiesUpdate);
    
    return () => {
      window.removeEventListener('entitiesUpdated', handleEntitiesUpdate);
    };
  }, []);
  
  // Listen for tutorial completion
  useEffect(() => {
    const handleTutorialComplete = () => {
      console.log('✅ Tutorial completo! Iniciando gameplay...');
      setTutorialFinished(true);
    };

    window.addEventListener('tutorialComplete', handleTutorialComplete);
    return () => {
      window.removeEventListener('tutorialComplete', handleTutorialComplete);
    };
  }, []);
  
  // Listen for educational card events
  useEffect(() => {
    const handleShowEducationalCard = (e: any) => {
      const cardData = e.detail;
      console.log('📚 Mostrando card educacional:', cardData.title);
      setEducationalCard(cardData);
    };

    window.addEventListener('showEducationalCard', handleShowEducationalCard);
    return () => {
      window.removeEventListener('showEducationalCard', handleShowEducationalCard);
    };
  }, []);

  // Update gameState ref whenever it changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  // Update collectedTools ref whenever it changes
  useEffect(() => {
    collectedToolsRef.current = collectedTools;
    console.log(`✅ collectedToolsRef atualizado:`, collectedTools, `(${collectedTools.length}/5)`);
  }, [collectedTools]);

  // Listen for XP gains
  useEffect(() => {
    const handleXPGain = (e: CustomEvent<number>) => {
      setPlayerXP(prev => prev + e.detail);
      soundLibrary.play('xp_gain');
    };

    window.addEventListener('xpGained', handleXPGain as EventListener);
    return () => {
      window.removeEventListener('xpGained', handleXPGain as EventListener);
    };
  }, []);

  // Sound effects for game events
  useEffect(() => {
    const handleAchievementUnlock = () => {
      soundLibrary.play('achievement_unlock');
    };

    const handleToolCollected = () => {
      soundLibrary.play('tool_collect');
    };

    const handleNestMarked = () => {
      soundLibrary.play('nest_mark');
    };

    const handleTurtleMeasured = () => {
      soundLibrary.play('turtle_measure');
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlock);
    window.addEventListener('toolCollected', handleToolCollected);
    window.addEventListener('nestMarked', handleNestMarked);
    window.addEventListener('turtleMeasured', handleTurtleMeasured);

    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementUnlock);
      window.removeEventListener('toolCollected', handleToolCollected);
      window.removeEventListener('nestMarked', handleNestMarked);
      window.removeEventListener('turtleMeasured', handleTurtleMeasured);
    };
  }, []);

  // Random event timer
  useEffect(() => {
    if (!activeRandomEvent || eventTimeRemaining <= 0) return;

    const timer = setInterval(() => {
      setEventTimeRemaining(prev => {
        if (prev <= 1) {
          // Event completed - award XP
          window.dispatchEvent(new CustomEvent('xpGained', { detail: activeRandomEvent.xpReward }));
          soundLibrary.play('phase_complete');
          setActiveRandomEvent(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRandomEvent, eventTimeRemaining]);
  
  // Listen for global audio toggle (TopBar button)
  useEffect(() => {
    const handleGlobalAudioToggle = (e: CustomEvent<{ muted: boolean }>) => {
      const { muted } = e.detail;
      console.log(`🔊 Áudio global ${muted ? 'DESLIGADO' : 'LIGADO'} via TopBar`);
      
      // Controlar AudioManager (sons de pássaros e ambiente seco)
      if (audioManagerRef.current) {
        audioManagerRef.current.setEnabled(!muted);
        console.log(`🎵 AudioManager atualizado: enabled=${!muted}`);
      }
      
      // Controlar RainParticlesManager (som de chuva sintético)
      if (rainParticlesRef.current) {
        rainParticlesRef.current.setMuted(muted);
        console.log(`🌧️ RainParticlesManager atualizado: muted=${muted}`);
      }
    };

    window.addEventListener('globalAudioToggle', handleGlobalAudioToggle as EventListener);
    return () => {
      window.removeEventListener('globalAudioToggle', handleGlobalAudioToggle as EventListener);
    };
  }, []);

  // Show transition when phase is completed (only once per phase)
  useEffect(() => {
    const currentPhase = getCurrentPhase();
    if (currentPhase.completed && lastCompletedPhaseRef.current !== currentPhase.id) {
      lastCompletedPhaseRef.current = currentPhase.id;
      setShowTransition(true);
    }
  }, [getCurrentPhase().id, getCurrentPhase().completed]);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!containerRef.current) return;

    // XP Sound Effect Handler - Plays kaching sound when XP is gained
    const handleXPGain = () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.playXpGain();
      }
    };

    // Setup Scene with realistic sky color
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0xA3C5D9, 0.001); // Exponential fog com densidade
    sceneRef.current = scene;
    
    // Initialize weather system
    weatherSystem.initialize(scene);
    console.log('🌦️ Dynamic Weather System initialized');

    // Setup Camera with better FOV
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Detect mobile device for performance optimization
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    
    // Setup Renderer with adaptive quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobileDevice, // Disable antialiasing on mobile for performance
      powerPreference: isMobileDevice ? "default" : "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Lower pixel ratio on mobile for better performance
    renderer.setPixelRatio(isMobileDevice ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isMobileDevice; // Disable shadows on mobile
    if (!isMobileDevice) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    console.log(`🎮 Mobile device: ${isMobileDevice}, Pixel Ratio: ${renderer.getPixelRatio()}, Shadows: ${renderer.shadowMap.enabled}`);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Warm Sun Light (late afternoon Amazon sun)
    const sunLight = new THREE.DirectionalLight(0xFFE8B3, 2.8); // Warmer golden sun
    sunLight.name = 'sunLight'; // Named for EnvironmentEffects
    sunLight.position.set(100, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    // Warm ambient light
    const ambientLight = new THREE.AmbientLight(0xFFF4E0, 0.7); // Warm fill
    ambientLight.name = 'ambientLight'; // Named for EnvironmentEffects
    scene.add(ambientLight);

    // Hemisphere light for natural sky/ground
    const hemisphereLight = new THREE.HemisphereLight(
      0xB8D8E8, // Lighter warm sky
      0xE8C89C, // Warm golden ground
      0.9
    );
    hemisphereLight.name = 'hemisphereLight'; // Named for EnvironmentEffects
    scene.add(hemisphereLight);

    // Create Realistic Beach Terrain
    const textureLoader = new THREE.TextureLoader();
    
    // Beach sand with realistic textures
    const beachGeometry = new THREE.PlaneGeometry(GAME_CONFIG.BEACH_LENGTH, GAME_CONFIG.BEACH_WIDTH, 256, 256);
    
    // Add realistic height variation to the beach
    const positionAttribute = beachGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      // Multi-layer noise for more realistic terrain
      const noise1 = Math.sin(x * 0.3) * Math.cos(y * 0.2) * 0.4;
      const noise2 = Math.sin(x * 0.8) * Math.cos(y * 0.6) * 0.15;
      const noise3 = (Math.random() - 0.5) * 0.08;
      positionAttribute.setZ(i, noise1 + noise2 + noise3);
    }
    beachGeometry.computeVertexNormals();
    
    // Create procedural sand texture
    const sandCanvas = document.createElement('canvas');
    sandCanvas.width = 1024;
    sandCanvas.height = 1024;
    const ctx = sandCanvas.getContext('2d')!;
    
    // Base sand color (golden/tan like natural beach)
    ctx.fillStyle = '#D4B896'; // Warmer, golden sand
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add sand grain texture with golden tones
    for (let i = 0; i < 50000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const brightness = 200 + Math.random() * 40;
      const golden = brightness - 10;
      const warm = brightness - 30;
      ctx.fillStyle = `rgb(${brightness}, ${golden}, ${warm})`;
      ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
    }
    
    const sandTexture = new THREE.CanvasTexture(sandCanvas);
    sandTexture.wrapS = THREE.RepeatWrapping;
    sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(8, 8);
    
    const beachMaterial = new THREE.MeshStandardMaterial({
      map: sandTexture,
      color: 0xFFFFFF,
      roughness: 0.98,
      metalness: 0.0,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });
    
    const beach = new THREE.Mesh(beachGeometry, beachMaterial);
    beach.rotation.x = -Math.PI / 2;
    beach.position.y = -0.1;
    beach.receiveShadow = true;
    scene.add(beach);

    // Load Research House GLB model with fallback
    const loadResearchHouseGLB = async (): Promise<THREE.Group> => {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          '/models/casa-pesquisa.glb',
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(2, 2, 2);
            
            // Configure shadows
            model.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            console.log('✅ Casa de pesquisa 3D carregada com sucesso!');
            resolve(model);
          },
          undefined,
          (error) => {
            console.warn('Falha ao carregar casa de pesquisa GLB, usando fallback procedural', error);
            reject(error);
          }
        );
      });
    };

    // Create Research House on the beach (procedural fallback)
    const createResearchHouse = () => {
      const house = new THREE.Group();
      
      // Base platform (wooden deck)
      const platformGeometry = new THREE.BoxGeometry(8, 0.3, 6);
      const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B6F47,
        roughness: 0.9,
        metalness: 0.1,
      });
      const platform = new THREE.Mesh(platformGeometry, woodMaterial);
      platform.position.y = 0.15;
      platform.castShadow = true;
      platform.receiveShadow = true;
      house.add(platform);
      
      // Main structure (walls)
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xA0826D,
        roughness: 0.95,
        metalness: 0.0,
      });
      
      // Front wall
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 0.2), wallMaterial);
      frontWall.position.set(0, 1.8, 3);
      frontWall.castShadow = true;
      house.add(frontWall);
      
      // Back wall
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 0.2), wallMaterial);
      backWall.position.set(0, 1.8, -3);
      backWall.castShadow = true;
      house.add(backWall);
      
      // Left wall
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 6), wallMaterial);
      leftWall.position.set(-4, 1.8, 0);
      leftWall.castShadow = true;
      house.add(leftWall);
      
      // Right wall
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 6), wallMaterial);
      rightWall.position.set(4, 1.8, 0);
      rightWall.castShadow = true;
      house.add(rightWall);
      
      // Door opening
      const doorOpening = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.3), new THREE.MeshStandardMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0,
      }));
      doorOpening.position.set(0, 1.5, 3);
      house.add(doorOpening);
      
      // Roof (pitched)
      const roofGeometry = new THREE.ConeGeometry(6, 2, 4);
      const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.95,
        metalness: 0.0,
      });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 4.3;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);
      
      // Windows
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.8,
      });
      
      const window1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 0.1), windowMaterial);
      window1.position.set(-2, 2.2, 3.05);
      house.add(window1);
      
      const window2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 0.1), windowMaterial);
      window2.position.set(2, 2.2, 3.05);
      house.add(window2);
      
      // Support posts
      const postMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 1.0,
      });
      
      const posts = [
        [-3.5, 0, 2.5],
        [3.5, 0, 2.5],
        [-3.5, 0, -2.5],
        [3.5, 0, -2.5],
      ];
      
      posts.forEach(([x, y, z]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.6, 8), postMaterial);
        post.position.set(x, y + 1.8, z);
        post.castShadow = true;
        house.add(post);
      });
      
      return house;
    };
    
    // Try loading GLB first, fallback to procedural - casa no canto extremo LESTE
    loadResearchHouseGLB()
      .then((glbHouse) => {
        glbHouse.position.set(45, 0.0, -55);
        scene.add(glbHouse);
        researchHouseRef.current = glbHouse;
        console.log('✅ Casa de pesquisa GLB adicionada em (45, 0, -55) - canto extremo LESTE');
      })
      .catch(() => {
        const proceduralHouse = createResearchHouse();
        proceduralHouse.position.set(45, 0.0, -55);
        scene.add(proceduralHouse);
        researchHouseRef.current = proceduralHouse;
        console.log('🏠 Casa de pesquisa procedural adicionada em (45, 0, -55) - canto extremo LESTE');
      });

    // Create Amazon Canoe (Rabeta/Canoa)
    const createAmazonCanoe = () => {
      const boat = new THREE.Group();
      
      // Hull (casco) - elongated and curved
      const hullGeometry = new THREE.BoxGeometry(4, 0.6, 1.5);
      const hullMaterial = new THREE.MeshStandardMaterial({
        color: 0x5D4E37, // Brown wood
        roughness: 0.8,
        metalness: 0.1,
      });
      const hull = new THREE.Mesh(hullGeometry, hullMaterial);
      hull.position.y = 0.3;
      hull.castShadow = true;
      hull.receiveShadow = true;
      boat.add(hull);
      
      // Front tip (proa)
      const frontTipGeometry = new THREE.ConeGeometry(0.75, 1, 8);
      const frontTip = new THREE.Mesh(frontTipGeometry, hullMaterial);
      frontTip.rotation.z = -Math.PI / 2;
      frontTip.position.set(2.5, 0.3, 0);
      frontTip.castShadow = true;
      boat.add(frontTip);
      
      // Back tip (popa)
      const backTipGeometry = new THREE.ConeGeometry(0.7, 0.8, 8);
      const backTip = new THREE.Mesh(backTipGeometry, hullMaterial);
      backTip.rotation.z = Math.PI / 2;
      backTip.position.set(-2.4, 0.3, 0);
      backTip.castShadow = true;
      boat.add(backTip);
      
      // Wooden benches (bancos)
      const benchMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        roughness: 0.9,
      });
      
      const bench1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.15, 0.4), benchMaterial);
      bench1.position.set(0.8, 0.7, 0);
      bench1.castShadow = true;
      boat.add(bench1);
      
      const bench2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.15, 0.4), benchMaterial);
      bench2.position.set(-0.8, 0.7, 0);
      bench2.castShadow = true;
      boat.add(bench2);
      
      // Motor cover (simple box at back)
      const motorGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.6);
      const motorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2C3E50,
        roughness: 0.4,
        metalness: 0.6,
      });
      const motor = new THREE.Mesh(motorGeometry, motorMaterial);
      motor.position.set(-2, 0.7, 0);
      motor.castShadow = true;
      boat.add(motor);
      
      return boat;
    };

    // Create detailed passenger for boat (same detail level as NPCs)
    const createBoatPassenger = (color: number, sitting: boolean) => {
      const passenger = new THREE.Group();
      
      // Torso (corpo superior) com cor personalizada
      const torsoGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.3, 4, 4, 4);
      const torsoMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
      });
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
      torso.position.y = sitting ? 1.2 : 1.5;
      torso.castShadow = true;
      torso.receiveShadow = true;
      passenger.add(torso);

      // Braços
      const armGeometry = new THREE.CapsuleGeometry(0.08, 0.45, 6, 12);
      const armMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
      });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.35, sitting ? 1.2 : 1.5, 0);
      leftArm.rotation.z = 0.2;
      leftArm.castShadow = true;
      passenger.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.35, sitting ? 1.2 : 1.5, 0);
      rightArm.rotation.z = -0.2;
      rightArm.castShadow = true;
      passenger.add(rightArm);

      // Calça
      const pantsGeometry = new THREE.BoxGeometry(0.55, 0.4, 0.35, 4, 4, 4);
      const pantsMaterial = new THREE.MeshStandardMaterial({
        color: 0x5A6B4D,
        roughness: 0.9,
      });
      const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
      pants.position.y = sitting ? 1.3 : 1.5;
      pants.castShadow = true;
      pants.receiveShadow = true;
      passenger.add(pants);

      // Pernas (dobradas se sentado)
      const legGeometry = new THREE.CapsuleGeometry(0.1, 0.5, 6, 12);
      const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x5A6B4D,
        roughness: 0.9,
      });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.15, sitting ? 0.5 : 0.5, sitting ? 0.15 : 0);
      if (sitting) leftLeg.rotation.x = Math.PI / 3;
      leftLeg.castShadow = true;
      passenger.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.15, sitting ? 0.5 : 0.5, sitting ? 0.15 : 0);
      if (sitting) rightLeg.rotation.x = Math.PI / 3;
      rightLeg.castShadow = true;
      passenger.add(rightLeg);

      // Botas
      const bootGeometry = new THREE.BoxGeometry(0.18, 0.12, 0.28, 4, 4, 4);
      const bootMaterial = new THREE.MeshStandardMaterial({
        color: 0x3E2723,
        roughness: 0.6,
        metalness: 0.1,
      });
      
      const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
      leftBoot.position.set(-0.15, sitting ? 0.32 : 0.12, sitting ? 0.3 : 0.05);
      leftBoot.castShadow = true;
      passenger.add(leftBoot);

      const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
      rightBoot.position.set(0.15, sitting ? 0.32 : 0.12, sitting ? 0.3 : 0.05);
      rightBoot.castShadow = true;
      passenger.add(rightBoot);

      // Cabeça realista
      const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const skinMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4A76A,
        roughness: 0.7,
      });
      const head = new THREE.Mesh(headGeometry, skinMaterial);
      head.position.y = sitting ? 1.65 : 2.0;
      head.castShadow = true;
      passenger.add(head);

      // Nariz
      const noseGeometry = new THREE.ConeGeometry(0.04, 0.08, 8);
      const nose = new THREE.Mesh(noseGeometry, skinMaterial);
      nose.position.set(0, sitting ? 1.65 : 2.0, 0.25);
      nose.rotation.x = Math.PI / 2;
      nose.castShadow = true;
      passenger.add(nose);

      // Orelhas
      const earGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const leftEar = new THREE.Mesh(earGeometry, skinMaterial);
      leftEar.position.set(-0.25, sitting ? 1.65 : 2.0, 0);
      leftEar.castShadow = true;
      passenger.add(leftEar);

      const rightEar = new THREE.Mesh(earGeometry, skinMaterial);
      rightEar.position.set(0.25, sitting ? 1.65 : 2.0, 0);
      rightEar.castShadow = true;
      passenger.add(rightEar);

      // Boné de safari completo
      const capTopGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.15, 16);
      const capMaterial = new THREE.MeshStandardMaterial({
        color: 0x4A5A3A,
        roughness: 0.9,
      });
      const capTop = new THREE.Mesh(capTopGeometry, capMaterial);
      capTop.position.y = sitting ? 1.82 : 2.17;
      capTop.castShadow = true;
      passenger.add(capTop);

      const capBrimGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.04, 16);
      const capBrim = new THREE.Mesh(capBrimGeometry, capMaterial);
      capBrim.position.y = sitting ? 1.75 : 2.1;
      capBrim.castShadow = true;
      passenger.add(capBrim);

      const capBandGeometry = new THREE.CylinderGeometry(0.29, 0.29, 0.06, 16);
      const capBandMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.8,
      });
      const capBand = new THREE.Mesh(capBandGeometry, capBandMaterial);
      capBand.position.y = sitting ? 1.25 : 1.6;
      capBand.castShadow = true;
      passenger.add(capBand);

      // Mochila detalhada
      const backpackGeometry = new THREE.BoxGeometry(0.35, 0.45, 0.2, 4, 4, 4);
      const backpackMaterial = new THREE.MeshStandardMaterial({
        color: 0x2D5016,
        roughness: 0.9,
      });
      const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
      backpack.position.set(0, sitting ? 0.7 : 1.0, -0.25);
      backpack.castShadow = true;
      passenger.add(backpack);

      const pocketGeometry = new THREE.BoxGeometry(0.25, 0.2, 0.08);
      const pocket = new THREE.Mesh(pocketGeometry, new THREE.MeshStandardMaterial({
        color: 0x1E3A0F,
        roughness: 0.9,
      }));
      pocket.position.set(0, sitting ? 0.6 : 0.9, -0.35);
      pocket.castShadow = true;
      passenger.add(pocket);

      const strapGeometry = new THREE.CapsuleGeometry(0.02, 0.4, 4, 8);
      const strapMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.8,
      });
      
      const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
      leftStrap.position.set(-0.12, sitting ? 0.9 : 1.2, -0.15);
      leftStrap.rotation.x = Math.PI / 6;
      leftStrap.castShadow = true;
      passenger.add(leftStrap);

      const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
      rightStrap.position.set(0.12, sitting ? 0.9 : 1.2, -0.15);
      rightStrap.rotation.x = Math.PI / 6;
      rightStrap.castShadow = true;
      passenger.add(rightStrap);

      // Prancheta com papel
      const clipboardGeometry = new THREE.BoxGeometry(0.18, 0.25, 0.02);
      const clipboardMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.8,
      });
      const clipboard = new THREE.Mesh(clipboardGeometry, clipboardMaterial);
      clipboard.position.set(sitting ? 0.25 : 0.3, sitting ? 0.5 : 0.8, 0.25);
      clipboard.rotation.y = -Math.PI / 6;
      clipboard.castShadow = true;
      passenger.add(clipboard);

      const paperGeometry = new THREE.PlaneGeometry(0.16, 0.22);
      const paperMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFF0,
        roughness: 0.9,
      });
      const paper = new THREE.Mesh(paperGeometry, paperMaterial);
      paper.position.set(sitting ? 0.25 : 0.3, sitting ? 0.5 : 0.8, 0.26);
      paper.rotation.y = -Math.PI / 6;
      paper.castShadow = true;
      passenger.add(paper);

      const clipGeometry = new THREE.BoxGeometry(0.12, 0.02, 0.02);
      const clipMaterial = new THREE.MeshStandardMaterial({
        color: 0xC0C0C0,
        roughness: 0.3,
        metalness: 0.8,
      });
      const clip = new THREE.Mesh(clipGeometry, clipMaterial);
      clip.position.set(sitting ? 0.25 : 0.3, sitting ? 0.62 : 0.92, 0.27);
      clip.rotation.y = -Math.PI / 6;
      clip.castShadow = true;
      passenger.add(clip);
      
      return passenger;
    };

    // Create Realistic Water using Water2 shader (increased to match larger beach)
    const waterGeometry = new THREE.PlaneGeometry(500, 500);
    
    const water = new Water(waterGeometry, {
      color: 0x4A9FB5, // Blue-green water like in Xingu river
      scale: 2,
      flowDirection: new THREE.Vector2(1, 0.3),
      textureWidth: 512,
      textureHeight: 512,
      normalMap0: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/water/Water_1_M_Normal.jpg'),
      normalMap1: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/water/Water_2_M_Normal.jpg'),
    });
    
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.1, -GAME_CONFIG.BEACH_WIDTH / 2 - 20);
    scene.add(water);

    // Create Realistic Trees
    const createRealisticTree = (x: number, z: number) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const trunkHeight = 10 + Math.random() * 8;
      const trunkRadius = 0.4 + Math.random() * 0.3;

      // Trunk with texture-like appearance
      const trunkGeometry = new THREE.CylinderGeometry(
        trunkRadius * 0.8, 
        trunkRadius, 
        trunkHeight, 
        12, 
        4
      );
      
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x3D2817,
        roughness: 1.0,
        metalness: 0.0,
      });
      
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = trunkHeight / 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);

      // More realistic canopy with multiple spheres
      const canopyLevels = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < canopyLevels; i++) {
        const canopyRadius = 3 + Math.random() * 2 - i * 0.5;
        const canopyGeometry = new THREE.SphereGeometry(canopyRadius, 16, 16);
        
        const greenVariation = 0.2 + Math.random() * 0.3;
        const canopyMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0, greenVariation, 0),
          roughness: 0.9,
          metalness: 0.0,
        });
        
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.y = trunkHeight + i * 2 - canopyLevels;
        canopy.position.x = (Math.random() - 0.5) * 0.8;
        canopy.position.z = (Math.random() - 0.5) * 0.8;
        canopy.castShadow = true;
        canopy.receiveShadow = true;
        tree.add(canopy);
      }

      return tree;
    };

    // Add forest with varied trees
    for (let i = 0; i < 80; i++) {
      const x = (Math.random() - 0.5) * GAME_CONFIG.BEACH_LENGTH * 0.9;
      const z = GAME_CONFIG.BEACH_WIDTH / 2 + Math.random() * 30 + 5;
      const tree = createRealisticTree(x, z);
      scene.add(tree);
    }

    // Add tropical plants on beach
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * GAME_CONFIG.BEACH_LENGTH * 0.7;
      const z = (Math.random() - 0.5) * GAME_CONFIG.BEACH_WIDTH * 0.7;
      
      // Palm-like plant
      const plantGroup = new THREE.Group();
      plantGroup.position.set(x, 0, z);
      
      const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 6);
      const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2D5016,
        roughness: 0.9,
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = 0.75;
      plantGroup.add(stem);
      
      // Leaves
      for (let j = 0; j < 5; j++) {
        const leafGeometry = new THREE.ConeGeometry(0.3, 1, 4);
        const leafMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x4A7C34,
          roughness: 0.8,
        });
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.y = 1.5;
        leaf.rotation.x = Math.PI / 4;
        leaf.rotation.y = (Math.PI * 2 / 5) * j;
        leaf.castShadow = true;
        plantGroup.add(leaf);
      }
      
      scene.add(plantGroup);
    }

    // Create REALISTIC BIOLOGIST Player (based on reference images)
    const player = new THREE.Group();
    player.position.set(0, 0, 0);
    playerRef.current = player;

    // Realistic head with proper skin tone
    const headGeometry = new THREE.SphereGeometry(0.32, 32, 32);
    const skinMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF5D4B3, // Natural skin tone
      roughness: 0.7,
      metalness: 0.0,
    });
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.position.y = 2.15;
    head.scale.set(1, 1.15, 0.9);
    head.castShadow = true;
    head.receiveShadow = true;
    player.add(head);

    // Safari hat (TAN/BEIGE color like reference)
    const hatCrownGeometry = new THREE.CylinderGeometry(0.3, 0.32, 0.28, 24);
    const hatMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xC9A87C, // Tan/beige safari hat
      roughness: 0.85,
      metalness: 0.0,
    });
    const hatCrown = new THREE.Mesh(hatCrownGeometry, hatMaterial);
    hatCrown.position.set(0, 2.45, 0);
    hatCrown.castShadow = true;
    player.add(hatCrown);

    // Hat brim
    const hatBrimGeometry = new THREE.CylinderGeometry(0.55, 0.58, 0.04, 32);
    const hatBrim = new THREE.Mesh(hatBrimGeometry, hatMaterial);
    hatBrim.position.set(0, 2.32, 0);
    hatBrim.castShadow = true;
    player.add(hatBrim);

    // Hat band (dark brown)
    const hatBandGeometry = new THREE.TorusGeometry(0.31, 0.02, 8, 24);
    const hatBandMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4A3728,
      roughness: 0.6,
    });
    const hatBand = new THREE.Mesh(hatBandGeometry, hatBandMaterial);
    hatBand.position.set(0, 2.32, 0);
    hatBand.rotation.x = Math.PI / 2;
    player.add(hatBand);

    // Glasses
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 2.2, 0.28);
    
    // Frame
    const frameGeometry = new THREE.TorusGeometry(0.12, 0.015, 8, 16);
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.4,
      metalness: 0.3,
    });
    const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    leftFrame.position.set(-0.15, 0, 0);
    leftFrame.rotation.y = Math.PI / 2;
    glassesGroup.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    rightFrame.position.set(0.15, 0, 0);
    rightFrame.rotation.y = Math.PI / 2;
    glassesGroup.add(rightFrame);
    
    // Bridge
    const bridgeGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8);
    const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
    bridge.position.set(0, 0, 0);
    bridge.rotation.z = Math.PI / 2;
    glassesGroup.add(bridge);
    
    player.add(glassesGroup);

    // Beard (brown/dark brown)
    const beardGeometry = new THREE.SphereGeometry(0.22, 16, 16);
    const beardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4A3020, // Brown beard
      roughness: 1.0,
    });
    const beard = new THREE.Mesh(beardGeometry, beardMaterial);
    beard.position.set(0, 1.5, 0.25);
    beard.scale.set(0.9, 0.7, 0.6);
    beard.castShadow = true;
    player.add(beard);

    // Create texture for EcoBrasil shirt using real logo
    const shirtCanvas = document.createElement('canvas');
    shirtCanvas.width = 512;
    shirtCanvas.height = 512;
    const shirtCtx = shirtCanvas.getContext('2d')!;
    
    // Beige/cream shirt background
    shirtCtx.fillStyle = '#F5E6D3';
    shirtCtx.fillRect(0, 0, 512, 512);
    
    // Load and draw real EcoBrasil logo
    const logoImg = new Image();
    logoImg.src = '/attached_assets/logo eco_1761348575817.png';
    let shirtTexture: THREE.CanvasTexture;
    
    logoImg.onload = () => {
      // Draw logo centered on shirt
      const logoWidth = 350;
      const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
      shirtCtx.drawImage(
        logoImg,
        (512 - logoWidth) / 2,
        (512 - logoHeight) / 2,
        logoWidth,
        logoHeight
      );
      shirtTexture.needsUpdate = true;
    };
    
    logoImg.onerror = () => {
      // Fallback: draw simple text if logo fails to load
      shirtCtx.fillStyle = '#00A651';
      shirtCtx.font = 'Bold 48px Arial';
      shirtCtx.textAlign = 'center';
      shirtCtx.fillText('EcoBrasil', 256, 256);
      shirtTexture.needsUpdate = true;
    };
    
    shirtTexture = new THREE.CanvasTexture(shirtCanvas);
    
    // Torso with EcoBrasil shirt (beige/cream color)
    const torsoGeometry = new THREE.BoxGeometry(0.65, 0.85, 0.35, 4, 4, 4);
    const torsoMaterial = new THREE.MeshStandardMaterial({
      map: shirtTexture,
      color: 0xFFFFFF,
      roughness: 0.8,
      metalness: 0.0,
    });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 1.5;
    torso.castShadow = true;
    torso.receiveShadow = true;
    player.add(torso);

    // Arms (shirt sleeves - beige)
    const armGeometry = new THREE.CapsuleGeometry(0.09, 0.55, 8, 16);
    const armMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF5E6D3, // Beige shirt
      roughness: 0.8,
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.45, 1.5, 0);
    leftArm.rotation.z = 0.2;
    leftArm.castShadow = true;
    player.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.45, 1.5, 0);
    rightArm.rotation.z = -0.2;
    rightArm.castShadow = true;
    player.add(rightArm);

    // Cargo pants (khaki/olive green like in reference)
    const pantsGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.4, 4, 4, 4);
    const pantsMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6B7456, // Olive/khaki cargo pants
      roughness: 0.9,
    });
    const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
    pants.position.y = 1.5;
    pants.castShadow = true;
    pants.receiveShadow = true;
    player.add(pants);

    // Cargo pants legs
    const legGeometry = new THREE.CapsuleGeometry(0.13, 0.6, 8, 16);
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6B7456, // Olive/khaki
      roughness: 0.9,
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.18, 0.5, 0);
    leftLeg.castShadow = true;
    player.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.18, 0.5, 0);
    rightLeg.castShadow = true;
    player.add(rightLeg);

    // Realistic boots
    const bootGeometry = new THREE.BoxGeometry(0.22, 0.15, 0.35, 4, 4, 4);
    const bootMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3E2723,
      roughness: 0.6,
      metalness: 0.1,
    });
    
    const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
    leftBoot.position.set(-0.18, 0.12, 0.05);
    leftBoot.castShadow = true;
    player.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
    rightBoot.position.set(0.18, 0.12, 0.05);
    rightBoot.castShadow = true;
    player.add(rightBoot);

    // Detailed Backpack with pockets and straps
    const backpackGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.25);
    const backpackMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4A4A4A, // Dark gray
      roughness: 0.8,
    });
    const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
    backpack.position.set(0, 1.5, -0.35);
    backpack.castShadow = true;
    player.add(backpack);
    
    // Backpack front pocket
    const pocketGeometry = new THREE.BoxGeometry(0.35, 0.25, 0.12);
    const pocketMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3A3A3A,
      roughness: 0.85,
    });
    const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
    pocket.position.set(0, 1.45, -0.47);
    pocket.castShadow = true;
    player.add(pocket);
    
    // Shoulder straps
    const strapGeometry = new THREE.BoxGeometry(0.08, 0.7, 0.04);
    const strapMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2A2A2A,
      roughness: 0.7,
    });
    const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    leftStrap.position.set(-0.2, 1.65, -0.15);
    leftStrap.rotation.z = 0.15;
    leftStrap.castShadow = true;
    player.add(leftStrap);
    
    const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    rightStrap.position.set(0.2, 1.65, -0.15);
    rightStrap.rotation.z = -0.15;
    rightStrap.castShadow = true;
    player.add(rightStrap);

    // Clipboard with paper (realistic field biologist tool)
    const clipboardGroup = new THREE.Group();
    clipboardGroup.position.set(-0.3, 1.4, 0.25);
    clipboardGroup.rotation.set(-0.2, 0.3, 0);
    
    // Clipboard base (brown wood)
    const boardGeometry = new THREE.BoxGeometry(0.22, 0.32, 0.02);
    const boardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x5D4E37, // Brown wood
      roughness: 0.9,
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    clipboardGroup.add(board);
    
    // Paper on clipboard
    const paperGeometry = new THREE.BoxGeometry(0.20, 0.28, 0.005);
    const paperMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFAFAFA, // White paper
      roughness: 0.95,
    });
    const paper = new THREE.Mesh(paperGeometry, paperMaterial);
    paper.position.z = 0.015;
    clipboardGroup.add(paper);
    
    // Clip (metal)
    const clipGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.01);
    const clipMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      roughness: 0.3,
      metalness: 0.7,
    });
    const clip = new THREE.Mesh(clipGeometry, clipMaterial);
    clip.position.set(0, 0.165, 0.02);
    clipboardGroup.add(clip);
    
    // Pencil on clipboard
    const pencilGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8);
    const pencilMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFD700, // Yellow pencil
      roughness: 0.7,
    });
    const pencil = new THREE.Mesh(pencilGeometry, pencilMaterial);
    pencil.position.set(0.08, 0.05, 0.02);
    pencil.rotation.z = Math.PI / 6;
    clipboardGroup.add(pencil);
    
    // Pencil tip (graphite)
    const tipGeometry = new THREE.ConeGeometry(0.008, 0.025, 8);
    const tipMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.5,
    });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.set(0.08 - Math.cos(Math.PI / 6) * 0.1, 0.05 - Math.sin(Math.PI / 6) * 0.1, 0.02);
    tip.rotation.z = Math.PI / 6;
    clipboardGroup.add(tip);
    
    player.add(clipboardGroup);
    
    // Add realistic facial features - nose
    const noseGeometry = new THREE.ConeGeometry(0.05, 0.12, 8);
    const nose = new THREE.Mesh(noseGeometry, skinMaterial);
    nose.position.set(0, 1.65, 0.35);
    nose.rotation.x = Math.PI / 2;
    nose.castShadow = true;
    player.add(nose);
    
    // Ears
    const earGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const leftEar = new THREE.Mesh(earGeometry, skinMaterial);
    leftEar.position.set(-0.28, 1.65, 0.05);
    leftEar.scale.set(0.8, 1, 0.4);
    leftEar.castShadow = true;
    player.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, skinMaterial);
    rightEar.position.set(0.28, 1.65, 0.05);
    rightEar.scale.set(0.8, 1, 0.4);
    rightEar.castShadow = true;
    player.add(rightEar);

    scene.add(player);

    // Helper: Escolher espécie aleatória de tartaruga
    const getRandomTurtleSpecies = (): 'expansa' | 'unifilis' | 'sextuberculata' => {
      const species: ('expansa' | 'unifilis' | 'sextuberculata')[] = ['expansa', 'unifilis', 'sextuberculata'];
      return species[Math.floor(Math.random() * species.length)];
    };
    
    // Create Turtles (Podocnemis expansa, unifilis e sextuberculata) - 15 unique walking turtles espalhadas por toda a praia
    const turtles: THREE.Group[] = [];
    const turtlePositions = [
      // Região Norte
      { x: 12, z: 30, species: getRandomTurtleSpecies(), id: 1 },
      { x: -15, z: 35, species: getRandomTurtleSpecies(), id: 2 },
      { x: 25, z: 28, species: getRandomTurtleSpecies(), id: 3 },
      // Região Central-Norte
      { x: -8, z: 15, species: getRandomTurtleSpecies(), id: 4 },
      { x: 18, z: 12, species: getRandomTurtleSpecies(), id: 5 },
      { x: -22, z: 18, species: getRandomTurtleSpecies(), id: 6 },
      // Região Central
      { x: 5, z: 3, species: getRandomTurtleSpecies(), id: 7 },
      { x: -12, z: -2, species: getRandomTurtleSpecies(), id: 8 },
      { x: 20, z: 0, species: getRandomTurtleSpecies(), id: 9 },
      // Região Central-Sul
      { x: -18, z: -15, species: getRandomTurtleSpecies(), id: 10 },
      { x: 10, z: -12, species: getRandomTurtleSpecies(), id: 11 },
      { x: -5, z: -18, species: getRandomTurtleSpecies(), id: 12 },
      // Região Sul
      { x: 15, z: -28, species: getRandomTurtleSpecies(), id: 13 },
      { x: -20, z: -30, species: getRandomTurtleSpecies(), id: 14 },
      { x: 8, z: -35, species: getRandomTurtleSpecies(), id: 15 },
    ];

    turtlePositions.forEach(({ x, z, species, id }) => {
      const turtle = new THREE.Group();
      turtle.position.set(x, 0.2, z);
      // Add walking animation data
      const walkSpeed = 0.3 + Math.random() * 0.2;
      const walkDirection = Math.random() * Math.PI * 2;
      turtle.userData = { 
        type: 'turtle', 
        species, 
        isNesting: false,
        interactable: true,
        walkSpeed,
        walkDirection,
        walkTimer: Math.random() * 10,
        isWalking: true,
        turtleId: id,
        measured: false  // Track if this turtle has been measured
      };

      const size = species === 'expansa' ? 0.8 : 0.5;
      
      // Carapaça (shell)
      const shellGeometry = new THREE.SphereGeometry(size, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const shellMaterial = new THREE.MeshStandardMaterial({
        color: species === 'expansa' ? 0x4A3020 : 0x5A4030,
        roughness: 0.7,
        metalness: 0.1,
      });
      const shell = new THREE.Mesh(shellGeometry, shellMaterial);
      shell.rotation.x = -Math.PI / 2;
      shell.castShadow = true;
      turtle.add(shell);

      // Cabeça
      const headGeometry = new THREE.SphereGeometry(size * 0.3, 16, 16);
      const skinMaterial = new THREE.MeshStandardMaterial({
        color: 0x3A2820,
        roughness: 0.9,
      });
      const head = new THREE.Mesh(headGeometry, skinMaterial);
      head.position.set(size * 0.8, -0.1, 0);
      head.castShadow = true;
      turtle.add(head);

      // Nadadeiras (4)
      const flipperGeometry = new THREE.BoxGeometry(size * 0.3, 0.05, size * 0.5);
      const flipperMaterial = new THREE.MeshStandardMaterial({
        color: 0x2A1810,
        roughness: 0.8,
      });
      
      const positions = [
        [size * 0.4, -0.15, size * 0.6],
        [size * 0.4, -0.15, -size * 0.6],
        [-size * 0.4, -0.15, size * 0.6],
        [-size * 0.4, -0.15, -size * 0.6],
      ];

      positions.forEach(([px, py, pz]) => {
        const flipper = new THREE.Mesh(flipperGeometry, flipperMaterial);
        flipper.position.set(px, py, pz);
        flipper.castShadow = true;
        turtle.add(flipper);
      });

      turtles.push(turtle);
      scene.add(turtle);
    });

    // Create NPCs - distributed across the beach area (avoiding center) - MAIS PRÓXIMOS DA AREIA
    const npcs: THREE.Group[] = [];
    const npcData = [
      { name: 'Dra. Adriana', x: -28, z: 8, color: 0x9B59B6 },      // Norte da praia, margem oeste (mais perto)
      { name: 'Dr. Lucas', x: 28, z: 5, color: 0x3A7BD5 },          // Norte da praia, margem leste (mais perto)
      { name: 'Zé Raimundo', x: -25, z: -25, color: 0x8B4513 },     // Sul da praia, margem oeste (mais perto)
      { name: 'Aline', x: 32, z: -10, color: 0xE74C3C },            // Meio da praia, margem leste (mais perto)
      { name: 'Tainá', x: -32, z: -12, color: 0x1ABC9C },           // Meio da praia, margem oeste (mais perto)
    ];

    npcData.forEach(({ name, x, z, color }) => {
      const npc = new THREE.Group();
      npc.position.set(x, 0, z);
      npc.userData = { type: 'npc', name, interactable: true, talkedTo: false };

      // Torso (corpo superior) com cor personalizada
      const torsoGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.3, 4, 4, 4);
      const torsoMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
      });
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
      torso.position.y = 1.5;
      torso.castShadow = true;
      torso.receiveShadow = true;
      npc.add(torso);

      // Braços
      const armGeometry = new THREE.CapsuleGeometry(0.08, 0.45, 6, 12);
      const armMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
      });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.35, 1.5, 0);
      leftArm.rotation.z = 0.2;
      leftArm.castShadow = true;
      npc.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.35, 1.5, 0);
      rightArm.rotation.z = -0.2;
      rightArm.castShadow = true;
      npc.add(rightArm);

      // Calça
      const pantsGeometry = new THREE.BoxGeometry(0.55, 0.4, 0.35, 4, 4, 4);
      const pantsMaterial = new THREE.MeshStandardMaterial({
        color: 0x5A6B4D,
        roughness: 0.9,
      });
      const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
      pants.position.y = 1.5;
      pants.castShadow = true;
      pants.receiveShadow = true;
      npc.add(pants);

      // Pernas
      const legGeometry = new THREE.CapsuleGeometry(0.1, 0.5, 6, 12);
      const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x5A6B4D,
        roughness: 0.9,
      });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.15, 0.5, 0);
      leftLeg.castShadow = true;
      npc.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.15, 0.5, 0);
      rightLeg.castShadow = true;
      npc.add(rightLeg);

      // Botas
      const bootGeometry = new THREE.BoxGeometry(0.18, 0.12, 0.28, 4, 4, 4);
      const bootMaterial = new THREE.MeshStandardMaterial({
        color: 0x3E2723,
        roughness: 0.6,
        metalness: 0.1,
      });
      
      const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
      leftBoot.position.set(-0.15, 0.12, 0.05);
      leftBoot.castShadow = true;
      npc.add(leftBoot);

      const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
      rightBoot.position.set(0.15, 0.12, 0.05);
      rightBoot.castShadow = true;
      npc.add(rightBoot);

      // Cabeça realista
      const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const skinMaterial = new THREE.MeshStandardMaterial({
        color: 0xF5D4B3,
        roughness: 0.7,
      });
      const head = new THREE.Mesh(headGeometry, skinMaterial);
      head.position.y = 2.15;
      head.scale.set(1, 1.1, 0.9);
      head.castShadow = true;
      npc.add(head);

      // Nariz
      const noseGeometry = new THREE.ConeGeometry(0.04, 0.1, 8);
      const nose = new THREE.Mesh(noseGeometry, skinMaterial);
      nose.position.set(0, 2.15, 0.22);
      nose.rotation.x = Math.PI / 2;
      nose.castShadow = true;
      npc.add(nose);

      // Orelhas
      const earGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const leftEar = new THREE.Mesh(earGeometry, skinMaterial);
      leftEar.position.set(-0.22, 2.15, 0.05);
      leftEar.scale.set(0.8, 1, 0.4);
      leftEar.castShadow = true;
      npc.add(leftEar);
      
      const rightEar = new THREE.Mesh(earGeometry, skinMaterial);
      rightEar.position.set(0.22, 2.15, 0.05);
      rightEar.scale.set(0.8, 1, 0.4);
      rightEar.castShadow = true;
      npc.add(rightEar);

      // Boné de safari
      const hatCrownGeometry = new THREE.CylinderGeometry(0.24, 0.26, 0.22, 16);
      const hatMaterial = new THREE.MeshStandardMaterial({
        color: 0xC9A87C,
        roughness: 0.85,
      });
      const hatCrown = new THREE.Mesh(hatCrownGeometry, hatMaterial);
      hatCrown.position.set(0, 2.37, 0);
      hatCrown.castShadow = true;
      npc.add(hatCrown);

      // Aba do boné
      const hatBrimGeometry = new THREE.CylinderGeometry(0.42, 0.45, 0.03, 24);
      const hatBrim = new THREE.Mesh(hatBrimGeometry, hatMaterial);
      hatBrim.position.set(0, 2.26, 0);
      hatBrim.castShadow = true;
      npc.add(hatBrim);

      // Faixa do boné
      const hatBandGeometry = new THREE.TorusGeometry(0.25, 0.015, 6, 16);
      const hatBandMaterial = new THREE.MeshStandardMaterial({
        color: 0x4A3728,
        roughness: 0.6,
      });
      const hatBand = new THREE.Mesh(hatBandGeometry, hatBandMaterial);
      hatBand.position.set(0, 1.76, 0);
      hatBand.rotation.x = Math.PI / 2;
      npc.add(hatBand);

      // Mochila
      const backpackGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.15);
      const backpackMaterial = new THREE.MeshStandardMaterial({
        color: 0x2C5F2D,
        roughness: 0.8,
      });
      const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
      backpack.position.set(0, 1.1, -0.25);
      backpack.castShadow = true;
      npc.add(backpack);

      // Bolso da mochila
      const pocketGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.05);
      const pocket = new THREE.Mesh(pocketGeometry, backpackMaterial);
      pocket.position.set(0, 1.15, -0.17);
      npc.add(pocket);

      // Alças da mochila
      const strapGeometry = new THREE.BoxGeometry(0.04, 0.35, 0.04);
      const strapMaterial = new THREE.MeshStandardMaterial({
        color: 0x1A3A1B,
        roughness: 0.7,
      });
      const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
      leftStrap.position.set(-0.12, 1.3, -0.18);
      npc.add(leftStrap);
      
      const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
      rightStrap.position.set(0.12, 1.3, -0.18);
      npc.add(rightStrap);

      // Prancheta
      const clipboardGeometry = new THREE.BoxGeometry(0.15, 0.22, 0.01);
      const clipboardMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        roughness: 0.7,
      });
      const clipboard = new THREE.Mesh(clipboardGeometry, clipboardMaterial);
      clipboard.position.set(0.25, 0.9, 0.15);
      clipboard.rotation.y = -Math.PI / 6;
      clipboard.castShadow = true;
      npc.add(clipboard);

      // Papel na prancheta
      const paperGeometry = new THREE.BoxGeometry(0.13, 0.19, 0.001);
      const paperMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFF0,
        roughness: 0.9,
      });
      const paper = new THREE.Mesh(paperGeometry, paperMaterial);
      paper.position.set(0.25, 0.9, 0.16);
      paper.rotation.y = -Math.PI / 6;
      npc.add(paper);

      // Clipe da prancheta
      const clipGeometry = new THREE.BoxGeometry(0.08, 0.015, 0.01);
      const clipMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.6,
        roughness: 0.3,
      });
      const clip = new THREE.Mesh(clipGeometry, clipMaterial);
      clip.position.set(0.25, 1.0, 0.17);
      clip.rotation.y = -Math.PI / 6;
      npc.add(clip);

      // Nome acima da cabeça
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext('2d')!;
      context.fillStyle = '#FFFFFF';
      context.font = 'Bold 32px Arial';
      context.textAlign = 'center';
      context.fillText(name, 128, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.y = 2.5;
      sprite.scale.set(2, 0.5, 1);
      npc.add(sprite);

      npcs.push(npc);
      scene.add(npc);
      console.log(`👤 NPC ${name} adicionado em (${x}, 0, ${z})`);
    });

    // Store vultures array in outer scope so event handlers can access it
    const vultures: VultureAI[] = [];

    // Gameplay Manager will be created ONLY after tutorial completion
    // This ensures no vultures or gameplay elements appear during welcome modal
    const initializeGameplay = () => {
      console.log('🎮 Inicializando GameplayManager...');
      const gameplayManager = new GameplayManager();
      gameplayManagerRef.current = gameplayManager;
      
      // Create Audio Manager (bird ambient sounds)
      const audioManager = new AudioManager();
      audioManagerRef.current = audioManager;
      
      // Start ambient bird sounds IMMEDIATELY for dry season
      console.log('🐦 Iniciando sons de pássaros amazônicos ao carregar jogo...');
      audioManager.startBirds();
      audioManager.startAmbientSounds();
      
      // Listen for XP gains and play sound effect
      window.addEventListener('xpGained', handleXPGain);
      
      // Connect GameplayManager with Phase system
      gameplayManager.setObjectiveCallback((objectiveId, increment) => {
        updatePhaseObjective(objectiveId, increment);
      });

      // Register turtles with gameplay manager
      turtles.forEach((turtle) => {
        gameplayManager.addTurtle(turtle, turtle.userData.species);
      });

      // Create Vultures (Urubus) ONLY after tutorial - increased for more predation behavior
      const vultureCount = 8;

      for (let i = 0; i < vultureCount; i++) {
      const vultureMesh = new THREE.Group();
      const angle = (Math.PI * 2 / vultureCount) * i;
      const radius = 25;
      
      vultureMesh.position.set(
        Math.cos(angle) * radius,
        15 + Math.random() * 5,
        Math.sin(angle) * radius
      );
      vultureMesh.userData = { type: 'vulture' };

      // ==== URUBU REALISTA - TAMANHO DE TARTARUGA ====
      const vultureScale = 0.35; // Fator de escala global (1/3 do tamanho original)
      
      // Corpo principal - formato mais anatômico
      const bodyGeometry = new THREE.SphereGeometry(0.9 * vultureScale, 24, 24);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x0D0D0D, // Preto profundo
        roughness: 0.85,
        metalness: 0.05,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.scale.set(1.4, 1.6, 2);
      body.castShadow = true;
      vultureMesh.add(body);
      
      // Peito/barriga mais clara
      const chestGeometry = new THREE.SphereGeometry(0.7 * vultureScale, 20, 20);
      const chestMaterial = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        roughness: 0.9,
      });
      const chest = new THREE.Mesh(chestGeometry, chestMaterial);
      chest.scale.set(1, 1.2, 1.1);
      chest.position.set(0.4 * vultureScale, -0.3 * vultureScale, 0);
      chest.castShadow = true;
      vultureMesh.add(chest);

      // Pescoço característico
      const neckGeometry = new THREE.CylinderGeometry(0.3 * vultureScale, 0.4 * vultureScale, 1 * vultureScale, 12);
      const neckMaterial = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        roughness: 0.9,
      });
      const neck = new THREE.Mesh(neckGeometry, neckMaterial);
      neck.position.set(1.2 * vultureScale, 0.3 * vultureScale, 0);
      neck.rotation.z = Math.PI / 2.3;
      neck.castShadow = true;
      vultureMesh.add(neck);

      // Cabeça pelada (característica de urubu) - pele vermelha enrugada
      const headGeometry = new THREE.SphereGeometry(0.5 * vultureScale, 20, 20);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x5A0000, // Vermelho sangue escuro
        roughness: 0.8,
        metalness: 0.05,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(1.9 * vultureScale, 0.6 * vultureScale, 0);
      head.scale.set(1.1, 0.95, 0.9);
      head.castShadow = true;
      vultureMesh.add(head);
      
      // Rugas/textura da pele
      const wrinkleGeometry = new THREE.SphereGeometry(0.52 * vultureScale, 20, 20);
      const wrinkleMaterial = new THREE.MeshStandardMaterial({
        color: 0x3A0000,
        roughness: 0.95,
        transparent: true,
        opacity: 0.4,
      });
      const wrinkles = new THREE.Mesh(wrinkleGeometry, wrinkleMaterial);
      wrinkles.position.copy(head.position);
      wrinkles.scale.copy(head.scale);
      vultureMesh.add(wrinkles);

      // Bico curvo característico de urubu
      const beakBaseGeometry = new THREE.ConeGeometry(0.22 * vultureScale, 0.7 * vultureScale, 10);
      const beakMaterial = new THREE.MeshStandardMaterial({
        color: 0xD0D0D0, // Cinza claro
        roughness: 0.3,
        metalness: 0.2,
      });
      const beak = new THREE.Mesh(beakBaseGeometry, beakMaterial);
      beak.position.set(2.35 * vultureScale, 0.55 * vultureScale, 0);
      beak.rotation.z = -Math.PI / 2;
      beak.rotation.y = Math.PI / 10;
      beak.castShadow = true;
      vultureMesh.add(beak);
      
      // Ponta do bico mais escura e afiada
      const beakTipGeometry = new THREE.ConeGeometry(0.15 * vultureScale, 0.3 * vultureScale, 8);
      const beakTipMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.4,
        metalness: 0.3,
      });
      const beakTip = new THREE.Mesh(beakTipGeometry, beakTipMaterial);
      beakTip.position.set(2.65 * vultureScale, 0.5 * vultureScale, 0);
      beakTip.rotation.z = -Math.PI / 2;
      beakTip.rotation.y = Math.PI / 8;
      vultureMesh.add(beakTip);
      
      // Olhos pequenos e penetrantes
      const eyeGeometry = new THREE.SphereGeometry(0.1 * vultureScale, 12, 12);
      const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x111111,
      });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(2.1 * vultureScale, 0.72 * vultureScale, 0.28 * vultureScale);
      vultureMesh.add(leftEye);
      
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(2.1 * vultureScale, 0.72 * vultureScale, -0.28 * vultureScale);
      vultureMesh.add(rightEye);
      
      // Pernas longas e finas (típicas de urubu)
      const legGeometry = new THREE.CylinderGeometry(0.1 * vultureScale, 0.08 * vultureScale, 1.5 * vultureScale, 10);
      const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x4A4A4A,
        roughness: 0.8,
      });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.3 * vultureScale, -1.5 * vultureScale, 0.35 * vultureScale);
      leftLeg.rotation.x = Math.PI / 12;
      leftLeg.castShadow = true;
      vultureMesh.add(leftLeg);
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(-0.3 * vultureScale, -1.5 * vultureScale, -0.35 * vultureScale);
      rightLeg.rotation.x = Math.PI / 12;
      rightLeg.castShadow = true;
      vultureMesh.add(rightLeg);
      
      // Garras/patas
      const clawGeometry = new THREE.SphereGeometry(0.15 * vultureScale, 10, 10);
      const clawMaterial = new THREE.MeshStandardMaterial({
        color: 0x2A2A2A,
        roughness: 0.7,
      });
      
      const leftClaw = new THREE.Mesh(clawGeometry, clawMaterial);
      leftClaw.position.set(-0.35 * vultureScale, -2.2 * vultureScale, 0.4 * vultureScale);
      leftClaw.scale.set(1.3, 0.7, 1.6);
      leftClaw.castShadow = true;
      vultureMesh.add(leftClaw);
      
      const rightClaw = new THREE.Mesh(clawGeometry, clawMaterial);
      rightClaw.position.set(-0.35 * vultureScale, -2.2 * vultureScale, -0.4 * vultureScale);
      rightClaw.scale.set(1.3, 0.7, 1.6);
      rightClaw.castShadow = true;
      vultureMesh.add(rightClaw);
      
      // Cauda em leque
      const tailGeometry = new THREE.ConeGeometry(0.8 * vultureScale, 1.5 * vultureScale, 6);
      const tailMaterial = new THREE.MeshStandardMaterial({
        color: 0x0D0D0D,
        roughness: 0.9,
      });
      const tail = new THREE.Mesh(tailGeometry, tailMaterial);
      tail.position.set(-1.3 * vultureScale, 0, 0);
      tail.rotation.z = Math.PI / 2;
      tail.scale.set(1, 1, 0.4);
      tail.castShadow = true;
      vultureMesh.add(tail);

      // Asas longas e largas - característica de urubu planador
      const wingGeometry = new THREE.BoxGeometry(0.4 * vultureScale, 5.5 * vultureScale, 2.2 * vultureScale);
      const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        roughness: 0.9,
        metalness: 0.02,
      });
      
      // Pontas das asas mais escuras (penas primárias)
      const wingTipGeometry = new THREE.BoxGeometry(0.3 * vultureScale, 2 * vultureScale, 1.2 * vultureScale);
      const wingTipMaterial = new THREE.MeshStandardMaterial({
        color: 0x0D0D0D,
        roughness: 0.95,
      });
      
      const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
      leftWing.position.set(0, 0.2 * vultureScale, 3.2 * vultureScale);
      leftWing.rotation.y = Math.PI / 5;
      leftWing.rotation.z = -Math.PI / 18;
      leftWing.castShadow = true;
      vultureMesh.add(leftWing);
      
      const leftWingTip = new THREE.Mesh(wingTipGeometry, wingTipMaterial);
      leftWingTip.position.set(0, -1.5 * vultureScale, 5 * vultureScale);
      leftWingTip.rotation.y = Math.PI / 6;
      leftWingTip.rotation.z = -Math.PI / 12;
      leftWingTip.castShadow = true;
      vultureMesh.add(leftWingTip);

      const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
      rightWing.position.set(0, 0.2 * vultureScale, -3.2 * vultureScale);
      rightWing.rotation.y = -Math.PI / 5;
      rightWing.rotation.z = Math.PI / 18;
      rightWing.castShadow = true;
      vultureMesh.add(rightWing);
      
      const rightWingTip = new THREE.Mesh(wingTipGeometry, wingTipMaterial);
      rightWingTip.position.set(0, -1.5 * vultureScale, -5 * vultureScale);
      rightWingTip.rotation.y = -Math.PI / 6;
      rightWingTip.rotation.z = Math.PI / 12;
      rightWingTip.castShadow = true;
      vultureMesh.add(rightWingTip);

      // ==== MARCADOR 3D DE AMEAÇA (Sprite de Alerta) ====
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Desenhar círculo de fundo vermelho
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(64, 64, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar borda branca
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 6;
        ctx.stroke();
        
        // Desenhar símbolo de alerta (triângulo)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠', 64, 64);
      }
      
      const spriteTexture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: spriteTexture,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
        sizeAttenuation: false,
      });
      
      const warningSprite = new THREE.Sprite(spriteMaterial);
      warningSprite.scale.set(0.08, 0.08, 1);
      warningSprite.position.set(0, 2.5 * vultureScale, 0);
      warningSprite.visible = false;
      warningSprite.renderOrder = 999;
      vultureMesh.add(warningSprite);
      
      scene.add(vultureMesh);

      const vultureAI: VultureAI = {
        mesh: vultureMesh,
        state: 'circling',
        target: null,
        circleAngle: angle,
        circleRadius: radius,
        height: 15 + Math.random() * 5,
        attackTimer: 0,
        fleeTimer: 0,
        hasWarnedPlayer: false,
      };

        vultures.push(vultureAI);
        gameplayManager.addVulture(vultureAI);
        
        // Mark vulture mesh as interactable and add to interactables array
        vultureMesh.userData.interactable = true;
        vultureMesh.userData.scared = false;
        vultureMesh.userData.warningSprite = warningSprite;
        addVultureToInteractables(vultureMesh);
      }

      // ==== PEIXES PULANDO NO RIO ====
      const fishCount = 12;
      
      for (let i = 0; i < fishCount; i++) {
        const fishMesh = new THREE.Group();
        
        // Corpo do peixe
        const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.3, 1.2, 12);
        const fishColors = [0x4169E1, 0x1E90FF, 0x00CED1, 0x20B2AA]; // Azuis/turquesa
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: fishColors[Math.floor(Math.random() * fishColors.length)],
          roughness: 0.3,
          metalness: 0.6,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        body.castShadow = true;
        fishMesh.add(body);
        
        // Cauda
        const tailGeometry = new THREE.ConeGeometry(0.4, 0.8, 8);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.set(-0.9, 0, 0);
        tail.rotation.z = Math.PI / 2;
        tail.castShadow = true;
        fishMesh.add(tail);
        
        // Posição inicial no rio
        fishMesh.position.set(
          (Math.random() - 0.5) * 60,
          -0.5, // Submerso
          (Math.random() - 0.5) * 60
        );
        fishMesh.rotation.y = Math.random() * Math.PI * 2;
        fishMesh.userData = { type: 'fish' };
        
        scene.add(fishMesh);
        fishArrayRef.current.push({
          mesh: fishMesh,
          jumpTimer: Math.random() * 10,
          jumping: false,
          velocity: new THREE.Vector3(0, 0, 0)
        });
      }

      // ==== JACARÉS PREDADORES ====
      const alligatorCount = 3;
      
      for (let i = 0; i < alligatorCount; i++) {
        const alligatorMesh = new THREE.Group();
        
        // Corpo do jacaré
        const bodyGeometry = new THREE.BoxGeometry(1, 0.6, 3.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: 0x2F4F2F, // Verde escuro
          roughness: 0.9,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        alligatorMesh.add(body);
        
        // Cabeça
        const headGeometry = new THREE.BoxGeometry(0.8, 0.5, 1.5);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 0.05, 2.5);
        head.castShadow = true;
        alligatorMesh.add(head);
        
        // Focinho
        const snoutGeometry = new THREE.ConeGeometry(0.4, 0.8, 8);
        const snout = new THREE.Mesh(snoutGeometry, bodyMaterial);
        snout.position.set(0, 0.05, 3.5);
        snout.rotation.x = -Math.PI / 2;
        snout.castShadow = true;
        alligatorMesh.add(snout);
        
        // Olhos
        const eyeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
          color: 0xFFFF00,
          emissive: 0x888800,
          roughness: 0.3,
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 0.35, 3);
        alligatorMesh.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 0.35, 3);
        alligatorMesh.add(rightEye);
        
        // Cauda
        const tailGeometry = new THREE.ConeGeometry(0.5, 2.5, 8);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.set(0, 0, -2.5);
        tail.rotation.x = Math.PI / 2;
        tail.castShadow = true;
        alligatorMesh.add(tail);
        
        // Posição inicial no rio
        alligatorMesh.position.set(
          (Math.random() - 0.5) * 50,
          0.3, // Parcialmente submerso
          (Math.random() - 0.5) * 50
        );
        alligatorMesh.rotation.y = Math.random() * Math.PI * 2;
        alligatorMesh.userData = { type: 'alligator' };
        
        scene.add(alligatorMesh);
        alligatorArrayRef.current.push({
          mesh: alligatorMesh,
          swimTimer: Math.random() * 5,
          targetTurtle: null
        });
      }
    };

    // Listen for tutorial completion to start gameplay
    const handleTutorialCompleteInScene = () => {
      initializeGameplay();
    };

    window.addEventListener('tutorialComplete', handleTutorialCompleteInScene);

    // Interaction system
    const interactableObjects: THREE.Group[] = [...turtles, ...npcs];
    let nearestInteractable: THREE.Group | null = null;
    
    // Function to get collectible tools for interaction (updated dynamically)
    const getCollectibleToolMeshes = () => {
      return collectibleToolsRef.current?.getInteractableMeshes() || [];
    };
    
    // Function to add vultures to interactables
    const addVultureToInteractables = (vultureMesh: THREE.Group) => {
      interactableObjects.push(vultureMesh);
    };

    // Create realistic nests - 25 ninhos espalhados por toda a praia (norte a sul, leste a oeste)
    const nests: THREE.Group[] = [];
    const nestPositions = [
      // Região Norte (z: 20 a 40)
      [15, 0, 35], [-10, 0, 38], [22, 0, 30], [-18, 0, 32], [5, 0, 25],
      // Região Central-Norte (z: 10 a 20)
      [12, 0, 18], [-15, 0, 15], [25, 0, 12], [-22, 0, 16], [8, 0, 14],
      // Região Central (z: -5 a 10)
      [10, 0, 5], [-12, 0, 3], [18, 0, 0], [-20, 0, 8], [0, 0, -2],
      // Região Central-Sul (z: -15 a -5)
      [8, 0, -12], [-15, 0, -8], [20, 0, -10], [-10, 0, -14], [12, 0, -6],
      // Região Sul (z: -25 a -15)
      [5, 0, -20], [-18, 0, -22], [15, 0, -25], [-8, 0, -28], [22, 0, -18],
    ];

    nestPositions.forEach(([x, y, z], index) => {
      const nestGroup = new THREE.Group();
      nestGroup.position.set(x, y, z);
      nestGroup.userData = { 
        type: 'nest', 
        interactable: true, 
        marked: false, 
        id: `nest_${index}` 
      };

      // Depression in sand with better detail
      const nestGeometry = new THREE.CylinderGeometry(0.7, 0.5, 0.2, 32);
      const nestMaterial = new THREE.MeshStandardMaterial({
        color: 0xC9B18A,
        roughness: 1.0,
      });
      const nest = new THREE.Mesh(nestGeometry, nestMaterial);
      nest.position.y = -0.1;
      nest.receiveShadow = true;
      nestGroup.add(nest);

      // More realistic marker stake
      const stakeGeometry = new THREE.CylinderGeometry(0.04, 0.05, 1.2, 8);
      const stakeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x6B4423,
        roughness: 1.0,
      });
      const stake = new THREE.Mesh(stakeGeometry, stakeMaterial);
      stake.position.set(0.9, 0.6, 0);
      stake.castShadow = true;
      nestGroup.add(stake);

      // Colored ribbon with better material
      const ribbonGeometry = new THREE.PlaneGeometry(0.08, 0.4);
      const ribbonMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF4500,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
      ribbon.position.set(0.9, 1.0, 0);
      nestGroup.add(ribbon);

      // 🥚 OVOS VISÍVEIS (3-6 ovos por ninho)
      const eggCount = Math.floor(Math.random() * 4) + 3; // 3 a 6 ovos
      const eggMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFF8DC, // Branco cremoso
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        emissive: 0xFFF8DC,
        emissiveIntensity: 0.1
      });

      for (let i = 0; i < eggCount; i++) {
        const eggGeometry = new THREE.SphereGeometry(0.08, 16, 12);
        const egg = new THREE.Mesh(eggGeometry, eggMaterial);
        
        // Posicionar ovos aleatoriamente dentro do ninho
        const angle = (Math.PI * 2 * i) / eggCount;
        const radius = Math.random() * 0.3 + 0.1;
        egg.position.set(
          Math.cos(angle) * radius,
          0.05, // Levemente acima do chão
          Math.sin(angle) * radius
        );
        
        // Rotação aleatória para variação
        egg.rotation.set(
          Math.random() * 0.3,
          Math.random() * Math.PI * 2,
          Math.random() * 0.3
        );
        
        // Escala levemente variada
        const scale = 0.9 + Math.random() * 0.2;
        egg.scale.setScalar(scale);
        
        egg.castShadow = true;
        egg.receiveShadow = true;
        nestGroup.add(egg);
      }

      nests.push(nestGroup);
      scene.add(nestGroup);
    });

    // Add nests to interactable objects
    interactableObjects.push(...nests);

    // Helper: Escolher espécie aleatória de tartaruga
    const getRandomSpecies = (): 'expansa' | 'unifilis' | 'sextuberculata' => {
      const species: ('expansa' | 'unifilis' | 'sextuberculata')[] = ['expansa', 'unifilis', 'sextuberculata'];
      return species[Math.floor(Math.random() * species.length)];
    };
    
    // 🌟 INITIALIZE PROFESSIONAL GAME SYSTEMS 🌟
    // Cada ninho recebe uma espécie ALEATÓRIA
    const nestData: NestData[] = nests.map((nest, index) => {
      const randomSpecies = getRandomSpecies();
      nest.userData.species = randomSpecies; // Armazenar no userData também
      return {
        id: nest.userData.id,
        position: nest.position.clone(),
        marked: nest.userData.marked || false,
        number: index + 1,
        species: randomSpecies // Espécie aleatória!
      };
    });

    // Initialize game systems asynchronously
    setupProfessionalGameSystems(
      scene,
      nestData,
      [], // NPCs will be added later
      researchHouseRef.current || undefined,
      undefined // boat will be added later
    ).then(({ eggsManager, proximityDetector, environmentEffects }) => {
      // eggsManagerRef.current = eggsManager; // DISABLED: Only eggs in nests now
      proximityDetectorRef.current = proximityDetector;
      environmentEffectsRef.current = environmentEffects;
      console.log('✅ Sistemas profissionais carregados com sucesso!');
    });

    // 🌙 INITIALIZE DAY/NIGHT CYCLE & FLASHLIGHT 🔦
    const dayNightCycle = new DayNightCycleManager(scene);
    const flashlight = new FlashlightManager(scene);
    
    dayNightCycleRef.current = dayNightCycle;
    flashlightRef.current = flashlight;
    
    console.log('🌙 Sistema dia/noite e lanterna inicializados');
    
    // 💧 INITIALIZE HYDROLOGICAL CYCLE (Seca/Cheia/Chuva) 🌊
    const hydrologicalCycle = new HydrologicalCycleManager(scene);
    hydrologicalCycleRef.current = hydrologicalCycle;
    
    console.log('💧 Sistema de ciclo hidrológico inicializado (3 estados)');
    
    // 🌧️ INITIALIZE RAIN PARTICLES SYSTEM 🌧️
    const rainParticles = new RainParticlesManager(scene);
    rainParticlesRef.current = rainParticles;
    
    console.log('🌧️ Sistema de partículas de chuva inicializado');
    
    // 🧰 INITIALIZE COLLECTIBLE TOOLS SYSTEM 🔧
    const collectibleTools = new CollectibleToolsManager(scene);
    collectibleTools.createTools();
    collectibleToolsRef.current = collectibleTools;
    
    console.log('🧰 Sistema de ferramentas coletáveis inicializado');

    // Listen for day mode toggle event
    const handleToggleDayMode = () => {
      if (dayNightCycleRef.current) {
        const isForced = dayNightCycleRef.current.toggleForceDayMode();
        // Dispatch event for EquipmentPanel
        window.dispatchEvent(new CustomEvent('dayModeToggled', { detail: isForced }));
        console.log('☀️ Modo dia forçado:', isForced ? 'ATIVADO' : 'DESATIVADO');
      }
    };
    
    // Listen for skip to night event (N key)
    const handleSkipToNight = () => {
      if (dayNightCycleRef.current) {
        dayNightCycleRef.current.skipToNight();
        
        // Mostrar card educacional sobre atividades noturnas do biólogo
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'night-activities',
            title: '🌙 Atividades Noturnas do Biólogo',
            content: 'À noite, os biólogos monitoram fêmeas desovando (pico entre 21h-3h), contabilizam tartarugas nidificantes, afastam predadores noturnos dos ninhos, protegem filhotes emergentes e usam lanterna vermelha para não interferir no comportamento natural. A lanterna é essencial para segurança e observação sem estresse aos animais.',
            icon: '🔦',
            autoCloseDelay: 8000,
          }
        }));
      }
    };
    
    // Listen for skip to day event (B key)
    const handleSkipToDay = () => {
      if (dayNightCycleRef.current) {
        dayNightCycleRef.current.skipToDay();
        
        // Mostrar card educacional sobre atividades diurnas do biólogo
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'day-activities',
            title: '☀️ Atividades Diurnas do Biólogo',
            content: 'Durante o dia, os biólogos de campo realizam identificação e marcação de ninhos, coleta de dados biométricos das tartarugas, medição de temperatura dos ninhos, mapeamento das áreas de desova e educação ambiental com comunidades locais. A visibilidade facilita observações detalhadas e fotografia científica.',
            icon: '🔬',
            autoCloseDelay: 8000,
          }
        }));
      }
    };
    
    // Listen for flashlight toggle event from EquipmentPanel or UI button
    const handleToggleFlashlight = () => {
      if (flashlightRef.current) {
        const isOn = flashlightRef.current.toggle();
        setFlashlightOn(isOn);
        // Dispatch event for UI
        window.dispatchEvent(new CustomEvent('flashlightToggled', { detail: { isOn } }));
        console.log('🔦 Lanterna:', isOn ? 'LIGADA' : 'DESLIGADA');
      }
    };
    
    window.addEventListener('toggleDayMode', handleToggleDayMode);
    window.addEventListener('skipToNight', handleSkipToNight);
    window.addEventListener('skipToDay', handleSkipToDay);
    window.addEventListener('toggleFlashlight', handleToggleFlashlight);

    // Keyboard Controls
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);
      
      // Handle phase advancement with Enter key
      if (key === 'enter' && getCurrentPhase().completed && showTransition) {
        if (isGameComplete()) {
          // Game is complete, close the transition
          setShowTransition(false);
        }
        // Phase advancement now handled by GameUI's handlePhaseContinue
        return;
      }
      
      // Handle interaction with research house
      if (key === 'e' && nearResearchHouseRef.current && !showResearchDialogue) {
        setShowResearchDialogue(true);
        return;
      }
      
      // Handle interaction with boat
      if (key === 'e' && nearBoatRef.current && !showBoatDialogue) {
        setShowBoatDialogue(true);
        return;
      }
      
      // Handle interaction with environmental impacts
      if (key === 'e' && playerRef.current && !showImpactDialog) {
        const nearbyImpact = getImpactAtPosition(impactMeshesRef.current, playerRef.current.position, 3);
        if (nearbyImpact) {
          const impact = ENVIRONMENTAL_IMPACTS.find((i) => i.id === nearbyImpact.id);
          if (impact) {
            setSelectedImpact(impact);
            setShowImpactDialog(true);
            return;
          }
        }
      }
      
      // Toggle Day/Night with T key
      if (key === 't' && dayNightCycleRef.current) {
        const currentTime = dayNightCycleRef.current.getCurrentAltamiraTime();
        const isCurrentlyNight = currentTime.hour >= 19 || currentTime.hour < 6;
        
        if (isCurrentlyNight) {
          dayNightCycleRef.current.skipToDay();
          console.log('☀️ Alternado para DIA (12h)');
          
          // Mostrar card educacional sobre atividades diurnas do biólogo
          window.dispatchEvent(new CustomEvent('showEducationalCard', { 
            detail: {
              id: 'day-activities',
              title: '☀️ Atividades Diurnas do Biólogo',
              content: 'Durante o dia, os biólogos de campo realizam identificação e marcação de ninhos, coleta de dados biométricos das tartarugas, medição de temperatura dos ninhos, mapeamento das áreas de desova e educação ambiental com comunidades locais. A visibilidade facilita observações detalhadas e fotografia científica.',
              icon: '🔬',
              autoCloseDelay: 8000,
            }
          }));
        } else {
          dayNightCycleRef.current.skipToNight();
          console.log('🌙 Alternado para NOITE (20h)');
          
          // Mostrar card educacional sobre atividades noturnas do biólogo
          window.dispatchEvent(new CustomEvent('showEducationalCard', { 
            detail: {
              id: 'night-activities',
              title: '🌙 Atividades Noturnas do Biólogo',
              content: 'À noite, os biólogos monitoram fêmeas desovando (pico entre 21h-3h), contabilizam tartarugas nidificantes, afastam predadores noturnos dos ninhos, protegem filhotes emergentes e usam lanterna vermelha para não interferir no comportamento natural. A lanterna é essencial para segurança e observação sem estresse aos animais.',
              icon: '🔦',
              autoCloseDelay: 8000,
            }
          }));
        }
        return;
      }
      
      // Toggle Hydrological Cycle (Seca/Chuva) with C key
      if (key === 'c' && hydrologicalCycleRef.current) {
        const newPhase = hydrologicalCycleRef.current.toggle();
        const phaseName = newPhase === 'chuva' ? 'CHUVA' : 'SECA';
        console.log(`💧 Alternando para ${phaseName}`);
        
        // Conecta sistema de clima ao ciclo hidrológico
        weatherSystem.setHydrologicalPhase(newPhase);
        
        // Dispatch event for UI notification
        window.dispatchEvent(new CustomEvent('hydrologicalPhaseChanged', { 
          detail: { phase: newPhase } 
        }));
        return;
      }
      
      // Tool selection with number keys (1-5)
      const toolKeys: Record<string, ToolType> = {
        '1': 'thermometer',
        '2': 'ruler',
        '3': 'scale',
        '4': 'notebook',
        '5': 'gps',
      };
      
      if (key in toolKeys) {
        const tool = toolKeys[key];
        if (collectedTools.includes(tool)) {
          setSelectedTool(selectedTool === tool ? null : tool);
          const toolNames = {
            thermometer: 'Termômetro',
            ruler: 'Régua',
            scale: 'Balança',
            notebook: 'Caderneta',
            gps: 'GPS',
          };
          console.log(`🧰 Ferramenta ${selectedTool === tool ? 'desequipada' : 'equipada'}: ${toolNames[tool]}`);
        }
        return;
      }
      
      // Flashlight toggle removed - only controlled via EquipmentPanel
      
      // Open Field Guide with G key (Encyclopedia)
      if (key === 'g') {
        setShowFieldGuide(prev => !prev);
        console.log(showFieldGuide ? '📚 Fechando Guia de Campo' : '📚 Abrindo Guia de Campo');
        return;
      }
      
      // Open Mini-Games Menu with M key
      if (key === 'm') {
        setShowMiniGamesMenu(prev => !prev);
        console.log(showMiniGamesMenu ? '🎮 Fechando Menu de Mini-Games' : '🎮 Abrindo Menu de Mini-Games');
        return;
      }
      
      // Open Audio Control with S key (Sound)
      if (key === 's') {
        setShowAudioControl(prev => !prev);
        console.log(showAudioControl ? '🔊 Fechando Controle de Áudio' : '🔊 Abrindo Controle de Áudio');
        return;
      }
      
      // DEBUG: Complete current phase with Ctrl+P (add max XP)
      if (key === 'p' && (e.ctrlKey || e.metaKey)) {
        const currentPhase = getCurrentPhase();
        console.log('🎯 DEBUG: Completando fase atual...', currentPhase.name);
        // Add enough XP to complete the phase
        const remainingXP = currentPhase.requiredXP - currentPhase.currentXP;
        if (remainingXP > 0) {
          window.dispatchEvent(new CustomEvent('xpGained', { detail: remainingXP }));
        }
        return;
      }
      
      // SPACE key removed - vulture scaring only via interaction now
      
      // Handle interaction with E key
      if (key === 'e' && nearestInteractable && playerRef.current && gameplayManagerRef.current) {
        const obj = nearestInteractable;
        const userData = obj.userData;
        const currentPhase = getCurrentPhase();
        
        if (userData.type === 'vulture' && !userData.scared) {
          // Scare vulture on interaction
          userData.scared = true;
          
          // Show vulture scare info
          setShowVultureScareInfo(true);
          
          // Award XP and ICX
          window.dispatchEvent(new CustomEvent('xpGained', { detail: 10 }));
          updateICX('VULTURE_SCARED'); // This also triggers achievement check
          
          // Scare this specific vulture (emit event for VultureAI)
          window.dispatchEvent(new Event('scareVultures'));
          
          // Dispatch turtle saved event (each vulture scared = turtle/nest protected)
          window.dispatchEvent(new Event('turtleSaved'));
          
          // Show educational card about predation management
          window.dispatchEvent(new CustomEvent('showEducationalCard', { 
            detail: {
              id: 'predation-management',
              content: 'Urubus e cães são predadores naturais de ninhos de tartaruga. O manejo ativo, incluindo afastar predadores e proteger ninhos com telas, aumenta a taxa de eclosão de 30% para mais de 80%!',
              title: '🦅 Redução da Predação',
              icon: '🛡️',
              autoCloseDelay: 10000,
            }
          }));
          
          // Update phase objectives based on current phase
          if (currentPhase.id === 2) {
            updatePhaseObjective('scare_vultures', 1);
          } else if (currentPhase.id === 3) {
            updatePhaseObjective('night_vultures', 1);
          } else if (currentPhase.id === 5) {
            updatePhaseObjective('final_vultures', 1);
          }
          
          console.log('🦅 Urubu espantado! +10 XP, +5 ICX');
        } else if (userData.type === 'turtle') {
          // Check if all 5 tools have been collected using ref (always has latest value)
          const currentTools = collectedToolsRef.current;
          console.log(`🐢 Tentando interagir com tartaruga. Ferramentas coletadas:`, currentTools, `(${currentTools.length}/5)`);
          
          // Unlock species in Field Guide when interacting with turtle
          const turtleSpecies = userData.species as 'expansa' | 'unifilis' | 'sextuberculata';
          setUnlockedSpecies(prev => {
            if (!prev.includes(turtleSpecies)) {
              console.log(`📚 Espécie desbloqueada no Guia: ${turtleSpecies}`);
              return [...prev, turtleSpecies];
            }
            return prev;
          });
          const allToolsCollected = currentTools.length === 5;
          
          if (!allToolsCollected) {
            addNotification({
              id: `no_tools_${Date.now()}`,
              type: 'info',
              species: userData.species,
              message: `🔒 Você precisa coletar TODAS as 5 ferramentas antes de interagir com tartarugas! (${currentTools.length}/5 coletadas)`,
              time: Date.now(),
              duration: 5000
            });
            console.log(`🔒 Ferramentas insuficientes para tartaruga: ${currentTools.length}/5`, currentTools);
            return;
          }
          
          // Check if turtle has already been measured
          if (userData.measured) {
            addNotification({
              id: `turtle_already_${Date.now()}`,
              type: 'info',
              species: userData.species,
              message: `Esta tartaruga já foi medida! Procure outra tartaruga 🐢`,
              time: Date.now()
            });
            console.log('🐢 Tartaruga já medida anteriormente');
          } else {
            // Open turtle tools dialog
            const turtleSpecies = userData.species || 'expansa';
            setSelectedTurtleData({
              id: userData.turtleId ? `turtle_${userData.turtleId}` : `turtle_${Date.now()}`,
              species: turtleSpecies as 'expansa' | 'unifilis' | 'sextuberculata'
            });
            setShowTurtleToolsDialog(true);
            
            // Mark turtle as measured
            userData.measured = true;
            
            // Dispatch turtle measured event
            window.dispatchEvent(new Event('turtleMeasured'));
            
            console.log('🐢 Abrindo ferramentas para tartaruga:', turtleSpecies);
          }
        } else if (userData.type === 'npc') {
          const npcName = userData.name || 'Pesquisador';
          
          // Award XP for interacting with NPCs (first time only)
          if (!userData.talkedTo) {
            userData.talkedTo = true;
            
            // Award XP for talking to researchers
            const xpAmount = 0.5;
            addPhaseXP(xpAmount);
            
            // Show notification
            addNotification({
              id: 'npc-talk-' + Date.now(),
              type: 'success',
              message: `💬 Conversou com ${npcName}! +${xpAmount} XP`,
              duration: 4000,
              species: 'expansa',
              time: Date.now()
            });
            
            // Play success sound and dispatch XP event
            soundLibrary.play('success');
            window.dispatchEvent(new CustomEvent('xpGained', { detail: xpAmount }));
            
            console.log(`💬 Interagiu com ${npcName}, ganhou ${xpAmount} XP`);
          }
          
          // Show educational dialogue based on NPC
          let npcData = null;
          if (npcName === 'Dra. Adriana') {
            npcData = NPCS.ADRIANA;
          } else if (npcName === 'Dr. Lucas') {
            npcData = NPCS.LUCAS;
          } else if (npcName === 'Zé Raimundo') {
            npcData = NPCS.ZE_RAIMUNDO;
          } else if (npcName === 'Aline') {
            npcData = NPCS.ALINE;
          } else if (npcName === 'Tainá') {
            npcData = NPCS.TAINA;
          }
          
          if (npcData) {
            setCurrentNPCDialogue({
              name: npcData.name,
              role: npcData.role,
              dialogue: npcData.dialogues.intro
            });
            setShowNPCDialogue(true);
          }
          
          // Update phase objective for meeting NPCs
          updatePhaseObjective('meet_npcs', 1);
        } else if (userData.type === 'nest') {
          // Check if all 5 tools have been collected using ref (always has latest value)
          const currentTools = collectedToolsRef.current;
          console.log(`🥚 Tentando interagir com ninho. Ferramentas coletadas:`, currentTools, `(${currentTools.length}/5)`);
          const allToolsCollected = currentTools.length === 5;
          
          if (!allToolsCollected) {
            addNotification({
              id: `no_tools_${Date.now()}`,
              type: 'info',
              species: 'expansa',
              message: `🔒 Você precisa coletar TODAS as 5 ferramentas antes de interagir com ninhos! (${currentTools.length}/5 coletadas)`,
              time: Date.now(),
              duration: 5000
            });
            console.log(`🔒 Ferramentas insuficientes para ninho: ${currentTools.length}/5`, currentTools);
            return;
          }
          
          // Nest interaction available with all tools
          const nestSpecies = userData.species || 'expansa';
          
          // Open nest tools dialog for player to choose what to do
          setSelectedNestData({
            id: userData.id,
            species: nestSpecies as 'expansa' | 'unifilis' | 'sextuberculata'
          });
          setShowNestToolsDialog(true);
          
          // If first time marking this nest, mark it and award XP
          if (!userData.marked) {
            userData.marked = true;
            
            // Unlock species in Field Guide
            setUnlockedSpecies(prev => {
              if (!prev.includes(nestSpecies as 'expansa' | 'unifilis' | 'sextuberculata')) {
                console.log(`📚 Espécie desbloqueada no Guia (ninho): ${nestSpecies}`);
                return [...prev, nestSpecies as 'expansa' | 'unifilis' | 'sextuberculata'];
              }
              return prev;
            });
            
            // Update phase objectives for marking nests
            updatePhaseObjective('mark_nests_stakes', 1);
            updatePhaseObjective('gps_records', 1);
            
            // Award XP for marking nest (+15 XP)
            window.dispatchEvent(new CustomEvent('xpGained', { detail: 15 }));
            updateICX('NEST_MARKED'); // This also triggers achievement check
            
            // Update achievements
            const achievement = achievementsManagerRef.current.updateProgress('nest_protector', 1);
            if (achievement) {
              window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
                detail: { name: achievement.name, icon: achievement.icon }
              }));
              window.dispatchEvent(new CustomEvent('xpGained', { detail: achievement.reward.xp }));
            }
            
            // Dispatch nest marked event
            window.dispatchEvent(new Event('nestMarked'));
            
            // Show educational card about beach selection
            window.dispatchEvent(new CustomEvent('showEducationalCard', { 
              detail: {
                id: 'beach-selection',
                title: '🏖️ Escolha de Praias Arenosas',
                content: 'As fêmeas escolhem praias arenosas porque a areia permite a escavação profunda e mantém umidade adequada. A textura da areia facilita a eclosão dos filhotes e sua jornada até o rio.',
                icon: '🏝️',
                autoCloseDelay: 10000,
              }
            }));
            
            // Visual feedback: add notification
            addNotification({
              id: `nest_${Date.now()}`,
              type: 'success',
              species: nestSpecies,
              message: `Ninho marcado com sucesso! +15 XP 📍`,
              time: Date.now()
            });
            
            console.log('🥚 Ninho marcado:', userData.id);
          } else {
            console.log('🥚 Ninho já marcado, abrindo ferramentas:', userData.id);
          }
        } else if (userData.type === 'collectible_tool') {
          // Collect tool
          const toolType = userData.toolType as ToolType;
          
          const toolNames = {
            thermometer: 'Termômetro Digital',
            ruler: 'Régua de Medição',
            scale: 'Balança Portátil',
            notebook: 'Caderneta de Campo',
            gps: 'GPS de Mão',
          };
          
          if (collectibleToolsRef.current && collectibleToolsRef.current.collectTool(toolType)) {
            // Update state with collected tools
            setCollectedTools(prev => {
              const newTools = [...prev, toolType];
              console.log(`🧰 Ferramentas após coleta:`, newTools, `(${newTools.length}/5)`);
              return newTools;
            });
            
            // Award XP for collecting tools (+10 XP)
            window.dispatchEvent(new CustomEvent('xpGained', { detail: 10 }));
            updateICX('TOOL_COLLECTED');
            
            // Dispatch activity completed event for phase progression
            window.dispatchEvent(new CustomEvent('activityCompleted', { 
              detail: { activityId: 'collectTool', phase: 1 } 
            }));
            
            // Emit collection effect event
            window.dispatchEvent(new CustomEvent('toolCollected', { 
              detail: { toolName: toolNames[toolType], icon: '🔧' }
            }));
            
            // Update achievements
            achievementsManagerRef.current.updateProgress('first_measurement', 1);
            const toolCount = collectedTools.length + 1; // +1 because state hasn't updated yet
            if (toolCount === 5) {
              const achievement = achievementsManagerRef.current.unlockAchievement('complete_toolset');
              if (achievement) {
                window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
                  detail: { name: achievement.name, icon: achievement.icon }
                }));
                window.dispatchEvent(new CustomEvent('xpGained', { detail: achievement.reward.xp }));
              }
            }
            
            // Show notification
            addNotification({
              id: `tool_${Date.now()}`,
              type: 'success',
              species: 'expansa',
              message: `${toolNames[toolType]} coletado! +10 XP 🧰`,
              time: Date.now()
            });
            
            console.log(`🧰 Ferramenta coletada: ${toolNames[toolType]}`);
          } else {
            console.log(`⚠️ Tentativa de coletar ferramenta que já foi coletada: ${toolType}`);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Virtual Controls Event Listeners
    const handleVirtualJoystickMove = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      virtualJoystick.current = { x: detail.x, y: detail.y };
    };

    const handleVirtualRun = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      virtualRun.current = detail.isRunning;
    };

    const handleVirtualInteract = () => {
      // Simula pressionar 'E' para interação
      const interactEvent = new KeyboardEvent('keydown', { key: 'e' });
      handleKeyDown(interactEvent);
      setTimeout(() => {
        const upEvent = new KeyboardEvent('keyup', { key: 'e' });
        handleKeyUp(upEvent);
      }, 100);
    };

    window.addEventListener('virtualJoystickMove', handleVirtualJoystickMove);
    window.addEventListener('virtualRun', handleVirtualRun);
    window.addEventListener('virtualInteract', handleVirtualInteract);

    // Handle Window Resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Create Boat with Passengers at the river shore
    const boat = createAmazonCanoe();
    
    // Add all procedural passengers to boat
    GAME_CONFIG.BOAT_ARRIVAL.passengers.forEach((passengerConfig) => {
      const passenger = createBoatPassenger(passengerConfig.color, passengerConfig.sitting);
      passenger.position.set(
        passengerConfig.position.x,
        passengerConfig.position.y,
        passengerConfig.position.z
      );
      boat.add(passenger);
    });
    
    // Position boat at the shore
    boat.position.set(
      GAME_CONFIG.BOAT_ARRIVAL.position.x,
      GAME_CONFIG.BOAT_ARRIVAL.position.y,
      GAME_CONFIG.BOAT_ARRIVAL.position.z
    );
    boat.rotation.y = GAME_CONFIG.BOAT_ARRIVAL.rotation;
    boat.userData = { type: 'boat', interactable: true };
    
    scene.add(boat);

    // 🌍 Create Environmental Impacts (lixo, fogueira, óleo, rede, desmatamento, barco)
    const impactMeshes = createEnvironmentalImpacts(scene);
    impactMeshesRef.current = impactMeshes;
    console.log(`✅ ${impactMeshes.length} impactos ambientais adicionados à cena`);

    // Animation Loop
    const velocity = new THREE.Vector3();
    const clock = clockRef.current;
    let lastStatsUpdate = 0;

    const animate = () => {
      rafIdRef.current = requestAnimationFrame(animate);

      // Read live gameState from ref
      const currentState = gameStateRef.current;
      const isPaused = currentState.isPaused;
      const isStarted = currentState.gameStarted;

      // Player Movement (only when not paused and game started)
      if (isStarted && !isPaused && playerRef.current) {
        const delta = clock.getDelta();
        
        // Keyboard input
        const forward = keysPressed.current.has('w') || keysPressed.current.has('arrowup');
        const backward = keysPressed.current.has('s') || keysPressed.current.has('arrowdown');
        const left = keysPressed.current.has('a') || keysPressed.current.has('arrowleft');
        const right = keysPressed.current.has('d') || keysPressed.current.has('arrowright');
        const shift = keysPressed.current.has('shift');

        // Virtual joystick input
        const joystickX = virtualJoystick.current.x;
        const joystickY = virtualJoystick.current.y;
        const virtualRunActive = virtualRun.current;

        const speed = (shift || virtualRunActive) ? GAME_CONFIG.PLAYER_RUN_SPEED : GAME_CONFIG.PLAYER_SPEED;
        const rotationSpeed = 3.0; // Velocidade de rotação

        // Rotação do jogador (A/D ou joystick horizontal)
        if (left || joystickX < -0.1) {
          playerRef.current.rotation.y += rotationSpeed * delta;
        }
        if (right || joystickX > 0.1) {
          playerRef.current.rotation.y -= rotationSpeed * delta;
        }

        // Movimento para frente/trás (W/S ou joystick vertical)
        let moveSpeed = 0;
        if (forward || joystickY < -0.1) {
          moveSpeed = speed;
        } else if (backward || joystickY > 0.1) {
          moveSpeed = -speed * 0.6; // Andar para trás é mais lento
        }

        // Calcular movimento baseado na rotação atual do jogador
        if (Math.abs(moveSpeed) > 0.1) {
          const moveX = Math.sin(playerRef.current.rotation.y) * moveSpeed * delta;
          const moveZ = Math.cos(playerRef.current.rotation.y) * moveSpeed * delta;
          
          playerRef.current.position.x += moveX;
          playerRef.current.position.z += moveZ;
        }

        // Boundaries
        playerRef.current.position.x = Math.max(-60, Math.min(60, playerRef.current.position.x));
        playerRef.current.position.z = Math.max(-40, Math.min(40, playerRef.current.position.z));

        // Smooth camera follow with rotation-based offset
        const cameraDistance = 8; // Distância atrás do jogador
        const cameraHeight = 5; // Altura da câmera
        const playerRotation = playerRef.current.rotation.y;
        
        // Calcular posição da câmera atrás do jogador baseado na rotação
        const targetCameraX = playerRef.current.position.x - Math.sin(playerRotation) * cameraDistance;
        const targetCameraZ = playerRef.current.position.z - Math.cos(playerRotation) * cameraDistance;
        
        // Suavizar movimento da câmera (aumentado para mais suavidade)
        const cameraSmoothing = 0.08; // Menor = mais suave
        camera.position.x += (targetCameraX - camera.position.x) * cameraSmoothing;
        camera.position.y += (playerRef.current.position.y + cameraHeight - camera.position.y) * cameraSmoothing;
        camera.position.z += (targetCameraZ - camera.position.z) * cameraSmoothing;
        
        // Fazer câmera olhar para um ponto à frente do jogador
        const lookAheadDistance = 5;
        const lookAtX = playerRef.current.position.x + Math.sin(playerRotation) * lookAheadDistance;
        const lookAtZ = playerRef.current.position.z + Math.cos(playerRotation) * lookAheadDistance;
        camera.lookAt(lookAtX, playerRef.current.position.y + 1, lookAtZ);

        // 🌟 UPDATE PROFESSIONAL GAME SYSTEMS 🌟
        if (proximityDetectorRef.current && environmentEffectsRef.current) {
          updateGameSystems(
            delta,
            null, // eggsManagerRef.current - DISABLED: Only eggs in nests now
            proximityDetectorRef.current,
            playerRef.current.position,
            environmentEffectsRef.current,
            75 // Default ICX 75 (Conservation Index Xingu)
          );

          // Dispatch playerMoved event for GameUI
          window.dispatchEvent(new CustomEvent('playerMoved', {
            detail: {
              x: playerRef.current.position.x,
              y: playerRef.current.position.y,
              z: playerRef.current.position.z
            }
          }));

          // Dispatch entitiesUpdated event for FullMap
          const entitiesForMap: any[] = [];
          
          // Add nests
          nests.forEach((nest) => {
            entitiesForMap.push({
              id: nest.userData.id || 'nest_' + Math.random(),
              type: 'nest',
              position: {
                x: nest.position.x,
                y: nest.position.y,
                z: nest.position.z
              }
            });
          });
          
          // Add NPCs
          npcs.forEach((npc) => {
            entitiesForMap.push({
              id: npc.userData.name || 'npc_' + Math.random(),
              type: 'npc',
              name: npc.userData.name,
              position: {
                x: npc.position.x,
                y: npc.position.y,
                z: npc.position.z
              }
            });
          });
          
          // Add research house
          if (researchHouseRef.current) {
            entitiesForMap.push({
              id: 'research_house',
              type: 'research_house',
              name: 'Casa de Pesquisa',
              position: {
                x: researchHouseRef.current.position.x,
                y: researchHouseRef.current.position.y,
                z: researchHouseRef.current.position.z
              }
            });
          }
          
          // Add boat if it exists
          if (boat) {
            entitiesForMap.push({
              id: 'boat',
              type: 'boat',
              name: 'Canoa',
              position: {
                x: boat.position.x,
                y: boat.position.y,
                z: boat.position.z
              }
            });
            
            // Add boat passengers as community members
            boat.children.forEach((child, index) => {
              if (child.userData?.type !== 'canoe_part') {
                // Calculate world position of passenger
                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);
                
                entitiesForMap.push({
                  id: `boat_passenger_${index}`,
                  type: 'community_member',
                  name: `Ribeirinho ${index + 1}`,
                  position: {
                    x: worldPos.x,
                    y: worldPos.y,
                    z: worldPos.z
                  }
                });
              }
            });
          }
          
          window.dispatchEvent(new CustomEvent('entitiesUpdated', {
            detail: entitiesForMap
          }));
        }
        
        // 🌙 UPDATE DAY/NIGHT CYCLE 🌙
        if (dayNightCycleRef.current) {
          const timeInfo = dayNightCycleRef.current.update();
          const currentTime = dayNightCycleRef.current.getCurrentAltamiraTime();
          setIsNightTime(timeInfo.isNight);
          setNeedsFlashlight(timeInfo.needsFlashlight);
          setCurrentHour(currentTime.hour);
        }
        
        // 💧 UPDATE HYDROLOGICAL CYCLE 💧
        if (hydrologicalCycleRef.current) {
          const cycleData = hydrologicalCycleRef.current.update(delta);
          setCurrentHydrologicalPhase(cycleData.phase);
          
          // Ativar/desativar chuva baseado na fase
          if (rainParticlesRef.current) {
            const shouldRain = cycleData.phase === 'chuva';
            if (shouldRain !== rainParticlesRef.current.getIsActive()) {
              rainParticlesRef.current.setActive(shouldRain);
            }
          }
        }
        
        // 🌧️ UPDATE RAIN PARTICLES 🌧️
        if (rainParticlesRef.current) {
          rainParticlesRef.current.update(delta);
        }
        
        // 🌦️ UPDATE DYNAMIC WEATHER SYSTEM 🌦️
        weatherSystem.update(delta);
        
        // Update fog based on weather visibility
        if (scene.fog) {
          const targetFogDensity = weatherSystem.getFogDensity();
          const currentFog = scene.fog as THREE.FogExp2;
          currentFog.density = THREE.MathUtils.lerp(
            currentFog.density || 0.001,
            targetFogDensity,
            delta * 0.5
          );
        }
        
        // 🧰 UPDATE COLLECTIBLE TOOLS 🔧
        if (collectibleToolsRef.current) {
          collectibleToolsRef.current.update(delta);
        }
        
        // 🔦 UPDATE FLASHLIGHT 🔦
        if (flashlightRef.current) {
          // Atualizar posição sempre para seguir o jogador
          flashlightRef.current.update(
            playerRef.current.position,
            playerRef.current.rotation.y
          );
        }

        // Check for nearby interactable objects (including collectible tools)
        nearestInteractable = null;
        let minDistance = 3; // 3 meters interaction radius

        const allInteractables = [...interactableObjects, ...getCollectibleToolMeshes()];
        
        allInteractables.forEach((obj) => {
          const distance = playerRef.current!.position.distanceTo(obj.position);
          if (distance < minDistance && obj.userData.interactable) {
            minDistance = distance;
            nearestInteractable = obj;
          }
        });

        setShowInteractPrompt(nearestInteractable !== null);

        // Check proximity to research house
        if (researchHouseRef.current) {
          const distanceToHouse = playerRef.current.position.distanceTo(researchHouseRef.current.position);
          const isNear = distanceToHouse < 6;
          nearResearchHouseRef.current = isNear; // Update ref for event handlers
          setNearResearchHouse(isNear); // Update state for UI
        }
        
        // Check proximity to boat (raio de 1 metro conforme solicitado)
        if (boat) {
          const distanceToBoat = playerRef.current.position.distanceTo(boat.position);
          const isNearBoat = distanceToBoat < 0.5;
          nearBoatRef.current = isNearBoat; // Update ref for event handlers
          setNearBoat(isNearBoat); // Update state for UI
        }

        // Animate walking turtles
        turtles.forEach((turtle) => {
          if (turtle.userData.isWalking) {
            turtle.userData.walkTimer += delta;
            
            // Change direction every 5-10 seconds
            if (turtle.userData.walkTimer > 5 + Math.random() * 5) {
              turtle.userData.walkTimer = 0;
              turtle.userData.walkDirection = Math.random() * Math.PI * 2;
            }
            
            // Move turtle slowly
            const moveX = Math.sin(turtle.userData.walkDirection) * turtle.userData.walkSpeed * delta;
            const moveZ = Math.cos(turtle.userData.walkDirection) * turtle.userData.walkSpeed * delta;
            
            turtle.position.x += moveX;
            turtle.position.z += moveZ;
            
            // Keep turtles on the beach (within bounds)
            turtle.position.x = Math.max(-50, Math.min(50, turtle.position.x));
            turtle.position.z = Math.max(-30, Math.min(30, turtle.position.z));
            
            // Face walking direction
            turtle.rotation.y = turtle.userData.walkDirection;
            
            // Subtle bobbing animation for realism
            turtle.position.y = 0.2 + Math.sin(turtle.userData.walkTimer * 2) * 0.05;
          }
        });

        // Animate boat bobbing (gentle water movement)
        if (GAME_CONFIG.BOAT_ARRIVAL.enabled) {
          const time = clock.getElapsedTime();
          const bobbing = Math.sin(time * GAME_CONFIG.BOAT_ARRIVAL.bobbingSpeed) * GAME_CONFIG.BOAT_ARRIVAL.bobbingAmplitude;
          boat.position.y = GAME_CONFIG.BOAT_ARRIVAL.position.y + bobbing;
        }

        // Update vultures (gameplay logic)
        if (gameplayManagerRef.current) {
          gameplayManagerRef.current.updateVultures(delta, playerRef.current.position);

          // Atualizar marcadores 3D de ameaça sobre urubus atacando
          vultures.forEach(vultureAI => {
            const sprite = vultureAI.mesh.userData.warningSprite as THREE.Sprite | undefined;
            if (sprite) {
              const isAttacking = vultureAI.state === 'attacking' || vultureAI.state === 'diving';
              sprite.visible = isAttacking;
              
              // Animação de pulso suave
              if (isAttacking) {
                const pulse = Math.sin(Date.now() * 0.005) * 0.01 + 0.08;
                sprite.scale.set(pulse, pulse, 1);
              }
            }
          });

          // Update game stats every 100ms to keep UI responsive
          const now = Date.now();
          if (now - lastStatsUpdate > 100) {
            lastStatsUpdate = now;
            const stats = gameplayManagerRef.current.getStats();
            setGameStats(stats);
            setActiveThreats(stats.activeThreats || 0);
            
            // getNotifications() já retorna máximo 2 notificações (hard cap)
            setNotifications(gameplayManagerRef.current.getNotifications());
          }
        }

        // Check for random events every 60 seconds
        const gameTime = clock.getElapsedTime();
        if (gameTime - lastEventCheckRef.current > 60 && !activeRandomEvent) {
          lastEventCheckRef.current = gameTime;
          const currentPhase = getCurrentPhase();
          const timeOfDay = isNightTime ? 'night' : 'day';
          const newEvent = randomEventsManager.checkForRandomEvent(
            currentPhase.id,
            timeOfDay,
            gameTime * 1000
          );
          
          if (newEvent) {
            console.log('🎲 Evento aleatório ativado:', newEvent.title);
            setActiveRandomEvent(newEvent);
            setEventTimeRemaining(newEvent.duration);
            soundLibrary.play('success');
          }
        }
      } else {
        // When paused or not started, drain clock delta to prevent time buildup
        clock.getDelta();
        // Zero velocity when paused to prevent movement on resume
        velocity.set(0, 0, 0);
        nearestInteractable = null;
        setShowInteractPrompt(false);
      }

      // ==== ANIMAR PEIXES PULANDO ====
      if (isStarted && !isPaused) {
        const delta = clock.getDelta();
        
        fishArrayRef.current.forEach((fish) => {
          fish.jumpTimer -= delta;
          
          if (fish.jumping) {
            // Física do salto
            fish.velocity.y -= 9.8 * delta; // Gravidade
            fish.mesh.position.add(fish.velocity.clone().multiplyScalar(delta));
            fish.mesh.rotation.x = Math.atan2(fish.velocity.y, fish.velocity.z);
            
            // Voltar para a água
            if (fish.mesh.position.y < -0.5) {
              fish.mesh.position.y = -0.5;
              fish.jumping = false;
              fish.jumpTimer = 3 + Math.random() * 7; // Próximo salto em 3-10 segundos
              fish.velocity.set(0, 0, 0);
              fish.mesh.rotation.x = 0;
            }
          } else if (fish.jumpTimer <= 0 && !fish.jumping) {
            // Iniciar salto
            fish.jumping = true;
            const jumpAngle = Math.random() * Math.PI * 2;
            fish.velocity.set(
              Math.cos(jumpAngle) * 3,
              6 + Math.random() * 3, // Velocidade vertical
              Math.sin(jumpAngle) * 3
            );
            fish.mesh.rotation.y = jumpAngle;
          }
        });
        
        // ==== ANIMAR JACARÉS NADANDO E PREDANDO ====
        alligatorArrayRef.current.forEach((alligator) => {
          alligator.swimTimer -= delta;
          
          // Procurar tartaruga para predar
          if (!alligator.targetTurtle && Math.random() < 0.001) {
            // Encontrar tartaruga mais próxima na água
            let closestTurtle: THREE.Group | null = null;
            let closestDist = Infinity;
            
            turtles.forEach((turtle) => {
              const dist = alligator.mesh.position.distanceTo(turtle.position);
              if (dist < 30 && dist < closestDist) {
                closestTurtle = turtle;
                closestDist = dist;
              }
            });
            
            if (closestTurtle) {
              alligator.targetTurtle = closestTurtle;
            }
          }
          
          // Perseguir tartaruga
          if (alligator.targetTurtle) {
            const direction = new THREE.Vector3()
              .subVectors(alligator.targetTurtle.position, alligator.mesh.position)
              .normalize();
            
            alligator.mesh.position.add(direction.multiplyScalar(delta * 2));
            alligator.mesh.lookAt(alligator.targetTurtle.position);
            
            // Atacar se próximo
            const dist = alligator.mesh.position.distanceTo(alligator.targetTurtle.position);
            if (dist < 2) {
              // Notificação de predação
              if (Math.random() < 0.01) {
                addNotification({
                  id: 'alligator-attack-' + Date.now(),
                  type: 'info',
                  message: '🐊 Um jacaré está atacando uma tartaruga! Afaste-o!',
                  duration: 5000,
                  species: 'expansa',
                  time: Date.now()
                });
              }
              
              // Espantar se jogador próximo
              if (playerRef.current && alligator.mesh.position.distanceTo(playerRef.current.position) < 5) {
                alligator.targetTurtle = null;
                alligator.swimTimer = 5; // Aguardar 5 segundos
              }
            }
            
            if (dist > 40) {
              alligator.targetTurtle = null; // Desistir se muito longe
            }
          } else if (alligator.swimTimer <= 0) {
            // Nadar aleatoriamente
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDist = 2 + Math.random() * 3;
            alligator.mesh.position.x += Math.cos(randomAngle) * randomDist * delta;
            alligator.mesh.position.z += Math.sin(randomAngle) * randomDist * delta;
            alligator.mesh.rotation.y = randomAngle;
            
            // Balançar cauda
            const tailMesh = alligator.mesh.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.ConeGeometry);
            if (tailMesh) {
              tailMesh.rotation.y = Math.sin(Date.now() * 0.005) * 0.3;
            }
            
            if (Math.random() < 0.01) {
              alligator.swimTimer = 2 + Math.random() * 3;
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Timer de 2 minutos para notificação sobre o barco
    const boatNotificationTimer = setTimeout(() => {
      if (!boatNotificationShown) {
        addNotification({
          id: 'boat-arrival-' + Date.now(),
          type: 'info',
          message: '🚤 Pessoas acabaram de chegar de barco na margem do rio! Vá até lá e converse com eles.',
          duration: 8000,
          species: 'expansa',
          time: Date.now()
        });
        setBoatNotificationShown(true);
      }
    }, 120000); // 2 minutos = 120000ms

    // Cleanup
    return () => {
      clearTimeout(boatNotificationTimer);
      // Cancel animation loop
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Stop all audio
      if (audioManagerRef.current) {
        audioManagerRef.current.stopAll();
      }
      
      // Cleanup professional game systems
      if (dayNightCycleRef.current) {
        dayNightCycleRef.current.dispose();
        dayNightCycleRef.current = null;
      }
      if (hydrologicalCycleRef.current) {
        hydrologicalCycleRef.current.dispose();
        hydrologicalCycleRef.current = null;
      }
      if (collectibleToolsRef.current) {
        collectibleToolsRef.current.dispose();
        collectibleToolsRef.current = null;
      }
      if (flashlightRef.current) {
        flashlightRef.current.dispose();
        flashlightRef.current = null;
      }

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('virtualJoystickMove', handleVirtualJoystickMove);
      window.removeEventListener('virtualRun', handleVirtualRun);
      window.removeEventListener('virtualInteract', handleVirtualInteract);
      window.removeEventListener('toggleDayMode', handleToggleDayMode);
      window.removeEventListener('skipToNight', handleSkipToNight);
      window.removeEventListener('skipToDay', handleSkipToDay);
      window.removeEventListener('toggleFlashlight', handleToggleFlashlight);
      window.removeEventListener('tutorialComplete', handleTutorialCompleteInScene);
      window.removeEventListener('xpGained', handleXPGain);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []); // Only mount once

  return (
    <>
      <div ref={containerRef} className="w-full h-screen" />

      {/* Ecological Notifications - Shows success/failure messages for turtle conservation */}
      {gameState.gameStarted && tutorialFinished && (
        <EcologicalNotification 
          notifications={notifications}
          onDismiss={handleDismissNotification}
        />
      )}

      {/* Threat HUD - Shows active vulture threats in compact display */}
      {gameState.gameStarted && tutorialFinished && (
        <ThreatHUD activeThreats={activeThreats} />
      )}

      {/* Phase Transition - Shows when phase is complete */}
      {gameState.gameStarted && getCurrentPhase().completed && showTransition && (
        <PhaseTransition 
          onContinue={() => {
            if (canAdvancePhase()) {
              advancePhase();
              setShowTransition(true);
            }
          }}
          onClose={() => setShowTransition(false)}
        />
      )}

      {/* Research House Interaction Prompt */}
      {gameState.gameStarted && nearResearchHouse && !showResearchDialogue && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-bounce">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl border-4 border-white/50 shadow-2xl">
            <p className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              Pressione <kbd className="px-3 py-1 bg-white/20 rounded-lg font-mono text-xl">E</kbd> para conversar
            </p>
          </div>
        </div>
      )}

      {/* Boat Interaction Prompt */}
      {gameState.gameStarted && nearBoat && !showBoatDialogue && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-bounce">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl border-4 border-white/50 shadow-2xl">
            <p className="text-2xl font-bold flex items-center gap-3">
              <span className="text-4xl">🚤</span>
              Pressione <kbd className="bg-white/20 px-3 py-1 rounded">E</kbd> para conversar
            </p>
          </div>
        </div>
      )}

      {/* Flashlight warnings removed - control via EquipmentPanel only */}

      {/* Turtle Action Balloon - Shows actions for turtle interaction */}
      {gameState.gameStarted && showTurtleActionBalloon && selectedTurtleId && (
        <TurtleActionBalloon
          isOpen={showTurtleActionBalloon}
          onClose={() => {
            setShowTurtleActionBalloon(false);
            setSelectedTurtleId(null);
          }}
          onActionComplete={(action) => {
            console.log(`🐢 Ação realizada: ${action} na tartaruga ${selectedTurtleId}`);
            
            // Mark turtle as measured to prevent re-measurement
            if (sceneRef.current && selectedTurtleId) {
              const turtleId = parseInt(selectedTurtleId.split('_')[1]);
              sceneRef.current.traverse((obj) => {
                if (obj.userData.type === 'turtle' && obj.userData.turtleId === turtleId) {
                  obj.userData.measured = true;
                  console.log(`✅ Tartaruga ${turtleId} marcada como medida`);
                }
              });
            }
            
            // Update phase objectives for turtle measurements (all phases)
            updatePhaseObjective('mark_turtles', 1);
            console.log('📊 Objetivo mark_turtles atualizado');
            
            // Award XP based on action
            const xpRewards = { measure: 10, weigh: 10, tag: 15 };
            const xp = xpRewards[action as keyof typeof xpRewards] || 10;
            window.dispatchEvent(new CustomEvent('xpGained', { detail: xp }));
            
            // Show notification
            const actionNames = {
              measure: 'Medição realizada',
              weigh: 'Pesagem realizada',
              tag: 'Marcação realizada'
            };
            addNotification({
              id: `turtle_${Date.now()}`,
              type: 'success',
              species: 'expansa',
              message: `${actionNames[action as keyof typeof actionNames]} +${xp} XP 🐢`,
              time: Date.now()
            });
            
            // Update Phase 4 objectives for biometric data
            updatePhaseObjective('biometric_data', 1);
            if (action === 'measure' || action === 'weigh') {
              updatePhaseObjective('observe_females', 1);
            }
          }}
          turtleId={selectedTurtleId}
        />
      )}

      {/* Vulture Scare Info - Shows educational message when scaring vultures */}
      {gameState.gameStarted && tutorialFinished && (
        <VultureScareInfo
          isOpen={showVultureScareInfo}
          onClose={() => setShowVultureScareInfo(false)}
        />
      )}

      {/* Nest Action Balloon - Shows measurement options after marking nest */}
      {gameState.gameStarted && showNestActionBalloon && selectedNestId && (
        <NestActionBalloon
          nestNumber={parseInt(selectedNestId.split('_')[1]) || 0}
          onMeasureTemperature={() => {
            console.log('📊 Medindo temperatura do ninho', selectedNestId);
            
            // Award XP for measurement (+10 XP)
            window.dispatchEvent(new CustomEvent('xpGained', { detail: 10 }));
            
            // Update Phase 4 objective
            updatePhaseObjective('temperature_readings', 1);
            
            addNotification({
              id: `temp_${Date.now()}`,
              type: 'success',
              species: 'expansa',
              message: `Temperatura: ${(29 + Math.random() * 7).toFixed(1)}°C +10 XP 🌡️`,
              time: Date.now()
            });
          }}
          onMeasureWidth={() => {
            console.log('📊 Medindo largura do ninho', selectedNestId);
            
            // Award XP for measurement (+10 XP)
            window.dispatchEvent(new CustomEvent('xpGained', { detail: 10 }));
            
            addNotification({
              id: `width_${Date.now()}`,
              type: 'success',
              species: 'expansa',
              message: `Largura: ${(60 + Math.random() * 30).toFixed(0)}cm +10 XP 📏`,
              time: Date.now()
            });
          }}
          onMeasureDepth={() => {
            console.log('📊 Medindo profundidade do ninho', selectedNestId);
            
            // Award XP for measurement (+10 XP)
            window.dispatchEvent(new CustomEvent('xpGained', { detail: 10 }));
            
            addNotification({
              id: `depth_${Date.now()}`,
              type: 'success',
              species: 'expansa',
              message: `Profundidade: ${(30 + Math.random() * 20).toFixed(0)}cm +10 XP 📐`,
              time: Date.now()
            });
          }}
          onClose={() => setShowNestActionBalloon(false)}
        />
      )}

      {/* Research Dialogue - Shows conversation between researchers */}
      <ResearchDialogue 
        isOpen={showResearchDialogue}
        onClose={() => setShowResearchDialogue(false)}
      />
      
      {/* Boat Dialogue - Shows conversation about conservation */}
      <BoatDialogue 
        isOpen={showBoatDialogue}
        onClose={() => setShowBoatDialogue(false)}
      />
      
      {/* Environmental Impact Dialog */}
      {selectedImpact && (
        <ImpactActionDialog
          impact={selectedImpact}
          onAction={(actionType) => {
            console.log(`🌍 Impacto ${selectedImpact.id}: ${actionType}`);
            
            // Adicionar pontos e XP baseado na ação
            if (actionType === 'positive' && selectedImpact.actions.positive) {
              const points = selectedImpact.actions.positive.points;
              addPhaseXP(points); // Adiciona pontos como XP
              console.log(`✅ +${points} XP por ação ambiental positiva`);
              
              // Dispatch activity completed event for phase progression
              window.dispatchEvent(new CustomEvent('activityCompleted', { 
                detail: { activityId: 'resolveImpact', phase: 4 } 
              }));
            } else if (actionType === 'negative' && selectedImpact.actions.negative) {
              const points = Math.abs(selectedImpact.actions.negative.points);
              // Penalidade: não ganha XP em ação negativa
              console.log(`❌ Ação negativa: sem XP ganho`);
            }
            
            setShowImpactDialog(false);
            setSelectedImpact(null);
          }}
          onClose={() => {
            setShowImpactDialog(false);
            setSelectedImpact(null);
          }}
        />
      )}
      
      {/* Nest Tools Dialog - Allows player to use thermometer, ruler, notebook on nests */}
      {selectedNestData && (
        <NestToolsDialog
          isOpen={showNestToolsDialog}
          nestId={selectedNestData.id}
          species={selectedNestData.species}
          collectedTools={collectedTools}
          onUseTool={(tool, result) => {
            console.log(`🥚 Usando ${tool} no ninho ${selectedNestData.id}:`, result);
            
            // Award XP based on tool used
            if (tool === 'thermometer') {
              window.dispatchEvent(new CustomEvent('xpGained', { detail: 10 }));
              updateICX('TEMPERATURE_MEASURED');
              console.log('🌡️ Temperatura medida! +10 XP');
            } else if (tool === 'ruler') {
              window.dispatchEvent(new CustomEvent('xpGained', { detail: 8 }));
              console.log('📏 Profundidade medida! +8 XP');
            } else if (tool === 'notebook') {
              window.dispatchEvent(new CustomEvent('xpGained', { detail: 12 }));
              console.log('📓 Anotações científicas registradas! +12 XP');
            }
            
            // Show notification
            addNotification({
              id: `tool_${Date.now()}`,
              type: 'success',
              species: selectedNestData.species,
              message: `Dados científicos coletados! 🔬`,
              time: Date.now()
            });
          }}
          onClose={() => {
            setShowNestToolsDialog(false);
            setSelectedNestData(null);
          }}
        />
      )}
      
      {/* Turtle Tools Dialog - Allows player to use scale, ruler, notebook on turtles */}
      {selectedTurtleData && (
        <TurtleToolsDialog
          isOpen={showTurtleToolsDialog}
          turtleId={selectedTurtleData.id}
          species={selectedTurtleData.species}
          collectedTools={collectedTools}
          onUseTool={(tool, result) => {
            console.log(`🐢 Usando ${tool} na tartaruga ${selectedTurtleData.id}:`, result);
            
            // Award XP based on tool used
            if (tool === 'scale') {
              window.dispatchEvent(new CustomEvent('xpGained', { detail: 10 }));
              console.log('⚖️ Tartaruga pesada! +10 XP');
            } else if (tool === 'ruler') {
              window.dispatchEvent(new CustomEvent('xpGained', { detail: 8 }));
              console.log('📏 Carapaça medida! +8 XP');
            } else if (tool === 'notebook') {
              window.dispatchEvent(new CustomEvent('xpGained', { detail: 12 }));
              console.log('📓 Observações da tartaruga registradas! +12 XP');
            }
            
            // Show notification
            addNotification({
              id: `turtle_tool_${Date.now()}`,
              type: 'success',
              species: selectedTurtleData.species,
              message: `Dados biométricos registrados! 🐢`,
              time: Date.now()
            });
          }}
          onClose={() => {
            setShowTurtleToolsDialog(false);
            setSelectedTurtleData(null);
          }}
        />
      )}
      
      {/* Educational Card - Shows educational information */}
      {educationalCard && (
        <EducationalCard
          card={educationalCard}
          onClose={() => setEducationalCard(null)}
        />
      )}
      
      {/* Tool Inventory - Shows collected scientific tools */}
      {gameState.gameStarted && tutorialFinished && (
        <ToolInventory 
          collectedTools={collectedTools}
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
        />
      )}
      
      {/* Hydrological Cycle Control - Only shown after tutorial */}
      {gameState.gameStarted && tutorialFinished && (
        <HydrologicalCycleControl 
          currentPhase={currentHydrologicalPhase}
          onPhaseChange={(phase) => {
            if (hydrologicalCycleRef.current) {
              hydrologicalCycleRef.current.setPhase(phase);
              
              // Conecta sistema de clima ao ciclo hidrológico
              weatherSystem.setHydrologicalPhase(phase);
              
              // Handle rain particles
              if (rainParticlesRef.current) {
                rainParticlesRef.current.setActive(phase === 'chuva');
              }
              
              // Handle bird sounds - activate during dry season (seca)
              if (audioManagerRef.current) {
                if (phase === 'seca') {
                  audioManagerRef.current.startBirds();
                } else {
                  audioManagerRef.current.stopBirds();
                }
              }
              
              console.log(`💧 Fase alterada para ${phase.toUpperCase()}`);
            }
          }}
        />
      )}
      
      {/* Day/Night Control - Only shown after tutorial */}
      {gameState.gameStarted && tutorialFinished && dayNightCycleRef.current && (
        <DayNightControl 
          isNight={currentHour >= 19 || currentHour < 6}
          currentHour={currentHour}
          onToggle={() => {
            if (dayNightCycleRef.current) {
              const currentTime = dayNightCycleRef.current.getCurrentAltamiraTime();
              const isCurrentlyNight = currentTime.hour >= 19 || currentTime.hour < 6;
              
              if (isCurrentlyNight) {
                dayNightCycleRef.current.skipToDay();
                console.log('☀️ Alternado para DIA (12h)');
                
                // Desligar lanterna automaticamente ao alternar para o dia
                if (flashlightOn) {
                  setFlashlightOn(false);
                  if (flashlightRef.current) {
                    flashlightRef.current.turnOff();
                  }
                  console.log('🔦 Lanterna desligada automaticamente (DIA)');
                }
                
                // Mostrar card educacional sobre atividades diurnas do biólogo
                window.dispatchEvent(new CustomEvent('showEducationalCard', { 
                  detail: {
                    id: 'day-activities',
                    title: '☀️ Atividades Diurnas do Biólogo',
                    content: 'Durante o dia, os biólogos de campo realizam identificação e marcação de ninhos, coleta de dados biométricos das tartarugas, medição de temperatura dos ninhos, mapeamento das áreas de desova e educação ambiental com comunidades locais. A visibilidade facilita observações detalhadas e fotografia científica.',
                    icon: '🔬',
                    autoCloseDelay: 8000,
                  }
                }));
              } else {
                dayNightCycleRef.current.skipToNight();
                console.log('🌙 Alternado para NOITE (20h)');
                
                // Mostrar card educacional sobre atividades noturnas do biólogo
                window.dispatchEvent(new CustomEvent('showEducationalCard', { 
                  detail: {
                    id: 'night-activities',
                    title: '🌙 Atividades Noturnas do Biólogo',
                    content: 'À noite, os biólogos monitoram fêmeas desovando (pico entre 21h-3h), contabilizam tartarugas nidificantes, afastam predadores noturnos dos ninhos, protegem filhotes emergentes e usam lanterna vermelha para não interferir no comportamento natural. A lanterna é essencial para segurança e observação sem estresse aos animais.',
                    icon: '🔦',
                    autoCloseDelay: 8000,
                  }
                }));
              }
            }
          }}
        />
      )}
      
      {/* Flashlight Control - Only shown after tutorial */}
      {gameState.gameStarted && tutorialFinished && (
        <FlashlightControl 
          isOn={flashlightOn}
          onToggle={() => {
            const newState = !flashlightOn;
            setFlashlightOn(newState);
            
            if (flashlightRef.current) {
              if (newState) {
                flashlightRef.current.turnOn();
              } else {
                flashlightRef.current.turnOff();
              }
            }
            
            console.log(newState ? '🔦 Lanterna ligada' : '🔦 Lanterna desligada');
          }}
        />
      )}
      
      {/* Map Control - Only shown after tutorial */}
      {gameState.gameStarted && tutorialFinished && (
        <MapControl onOpenMap={() => setShowFullMap(true)} />
      )}
      
      {/* Tools Info Panel - Only shown after tutorial */}
      {gameState.gameStarted && tutorialFinished && (
        <ToolsInfoPanel collectedTools={collectedTools} />
      )}
      
      {/* Keyboard Shortcuts Panel - Only shown after tutorial */}
      {gameState.gameStarted && tutorialFinished && (
        <KeyboardShortcutsPanel />
      )}
      
      {/* Full Map - Only shown after tutorial */}
      {gameState.gameStarted && tutorialFinished && (
        <FullMap 
          isOpen={showFullMap}
          onClose={() => setShowFullMap(false)}
          playerPosition={{ 
            x: playerRef.current?.position.x || 0, 
            y: playerRef.current?.position.y || 0,
            z: playerRef.current?.position.z || 0 
          }}
          entities={mapEntities}
        />
      )}
      
      {/* NEW ENHANCEMENTS */}
      
      {/* XP Particles - Visual feedback for XP gains */}
      <XPParticles />
      
      {/* Interaction Glow - Shows nearby interactable objects */}
      <InteractionGlow />
      
      {/* Collection Effect - Animated notifications for collections */}
      <CollectionEffect />
      
      {/* Field Guide - Encyclopedia of species */}
      {gameState.gameStarted && tutorialFinished && (
        <FieldGuide
          isOpen={showFieldGuide}
          onClose={() => setShowFieldGuide(false)}
          unlockedSpecies={unlockedSpecies}
        />
      )}
      
      {/* Random Event Notification - Shows active random events */}
      {activeRandomEvent && (
        <RandomEventNotification
          event={activeRandomEvent}
          timeRemaining={eventTimeRemaining}
          onClose={() => setActiveRandomEvent(null)}
        />
      )}
      
      {/* Mini-Games Menu - Press M to open */}
      {showMiniGamesMenu && (
        <MiniGamesMenu
          onSelectGame={(gameType) => {
            setActiveMiniGame(gameType);
            setShowMiniGamesMenu(false);
          }}
          onClose={() => setShowMiniGamesMenu(false)}
        />
      )}
      
      {/* Active Mini-Game */}
      {activeMiniGame && (
        <EducationalMiniGames
          gameType={activeMiniGame}
          onComplete={(xpEarned) => {
            window.dispatchEvent(new CustomEvent('xpGained', { detail: xpEarned }));
            soundLibrary.play('achievement_unlock');
            console.log(`🎮 Mini-game completado! +${xpEarned} XP`);
            setActiveMiniGame(null);
          }}
          onClose={() => setActiveMiniGame(null)}
        />
      )}
      
      {/* Audio Control Panel - Press S to open */}
      {showAudioControl && (
        <AudioControlPanel onClose={() => setShowAudioControl(false)} />
      )}
      
      {/* Weather Notification - Shows weather changes */}
      <WeatherNotification />
      
      {/* NPC Educational Dialogue */}
      {showNPCDialogue && currentNPCDialogue && (
        <DialogueBox
          npcName={currentNPCDialogue.name}
          npcRole={currentNPCDialogue.role}
          dialogue={currentNPCDialogue.dialogue}
          onClose={() => {
            setShowNPCDialogue(false);
            setCurrentNPCDialogue(null);
          }}
        />
      )}
      
      {/* Mobile Touch Controls - Only on mobile devices */}
      {isMobile && gameState.gameStarted && tutorialFinished && (
        <>
          <VirtualJoystick onMove={() => {}} />
          <VirtualActionButtons
            onInteract={() => {
              // Simulate E key press for interaction
              window.dispatchEvent(new Event('virtualInteract'));
            }}
            onRun={(isRunning) => {
              window.dispatchEvent(new CustomEvent('virtualRun', { detail: { isRunning } }));
            }}
            showInteractButton={showInteractPrompt}
            flashlightOn={false}
            onFlashlightToggle={() => {
              // Flashlight toggle would go here
            }}
          />
        </>
      )}
    </>
  );
}
