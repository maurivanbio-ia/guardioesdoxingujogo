/**
 * Environmental Impacts Spawner
 * Cria objetos 3D dos impactos antrópicos espalhados na praia
 */

import * as THREE from 'three';
import { ENVIRONMENTAL_IMPACTS } from './educationalPointsSystem';

export interface ImpactMesh {
  id: string;
  mesh: THREE.Group;
  position: THREE.Vector3;
  type: string;
}

export function createEnvironmentalImpacts(scene: THREE.Scene): ImpactMesh[] {
  const impactMeshes: ImpactMesh[] = [];

  // Posições espalhadas por TODA a praia (norte, centro e sul)
  const impactPositions = [
    { id: 'lixo_praia', type: 'lixo_praia', x: -35, z: 30 }, // Norte da praia, lado esquerdo
    { id: 'fogueira_abandonada', type: 'fogueira_abandonada', x: 20, z: -10 }, // Centro-sul, lado direito
    { id: 'oleo_derramado', type: 'oleo_derramado', x: 38, z: -42 }, // Sul extremo, lado direito
    { id: 'rede_ilegal', type: 'rede_ilegal', x: -42, z: -25 }, // Centro-sul, lado esquerdo
    { id: 'area_desmatada', type: 'area_desmatada', x: 10, z: 45 }, // Norte extremo, centro
    { id: 'embarcacao_barulhenta', type: 'embarcacao_barulhenta', x: 32, z: 18 }, // Norte, lado direito
  ];

  impactPositions.forEach((pos) => {
    const impact = ENVIRONMENTAL_IMPACTS.find((i) => i.id === pos.id);
    if (!impact) return;

    const group = new THREE.Group();
    group.userData = { impactId: pos.id, type: pos.type };

    switch (pos.type) {
      case 'lixo_praia':
        createTrashPile(group);
        break;
      case 'fogueira_abandonada':
        createCampfire(group);
        break;
      case 'oleo_derramado':
        createOilSpill(group);
        break;
      case 'rede_ilegal':
        createFishingNet(group);
        break;
      case 'area_desmatada':
        createDeforestationArea(group);
        break;
      case 'embarcacao_barulhenta':
        createBoatMarker(group);
        break;
    }

    group.position.set(pos.x, 0.2, pos.z);
    scene.add(group);

    impactMeshes.push({
      id: pos.id,
      mesh: group,
      position: new THREE.Vector3(pos.x, 0.2, pos.z),
      type: pos.type,
    });
  });

  console.log(`🌍 ${impactMeshes.length} impactos ambientais criados na cena`);
  return impactMeshes;
}

// 🗑️ Lixo na praia (garrafas plásticas e resíduos)
function createTrashPile(group: THREE.Group) {
  const colors = [0x1976D2, 0xFF5722, 0x4CAF50, 0xFFEB3B];
  
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.08, 0.4, 8);
    const material = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      roughness: 0.6,
      metalness: 0.3,
    });
    const bottle = new THREE.Mesh(geometry, material);
    bottle.position.set(
      Math.random() * 0.8 - 0.4,
      0.2,
      Math.random() * 0.8 - 0.4
    );
    bottle.rotation.z = Math.random() * Math.PI * 0.3;
    bottle.castShadow = true;
    group.add(bottle);
  }

  // Sacola plástica
  const bagGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.4);
  const bagMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    opacity: 0.7,
    transparent: true,
  });
  const bag = new THREE.Mesh(bagGeometry, bagMaterial);
  bag.position.y = 0.05;
  bag.castShadow = true;
  group.add(bag);
}

// 🔥 Fogueira abandonada
function createCampfire(group: THREE.Group) {
  // Círculo de pedras
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const rockGeometry = new THREE.DodecahedronGeometry(0.15, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.9,
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(Math.cos(angle) * 0.5, 0.1, Math.sin(angle) * 0.5);
    rock.castShadow = true;
    group.add(rock);
  }

  // Madeira queimada (preto)
  for (let i = 0; i < 3; i++) {
    const logGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
    const logMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1A1A,
      roughness: 0.95,
    });
    const log = new THREE.Mesh(logGeometry, logMaterial);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = (i / 3) * Math.PI * 2;
    log.position.y = 0.1;
    log.castShadow = true;
    group.add(log);
  }

  // Cinzas (plano cinza)
  const ashGeometry = new THREE.CircleGeometry(0.6, 16);
  const ashMaterial = new THREE.MeshStandardMaterial({
    color: 0x3A3A3A,
    roughness: 1,
  });
  const ash = new THREE.Mesh(ashGeometry, ashMaterial);
  ash.rotation.x = -Math.PI / 2;
  ash.position.y = 0.01;
  group.add(ash);
}

// 🛢️ Vazamento de óleo
function createOilSpill(group: THREE.Group) {
  // Mancha de óleo (elipse irregular)
  const oilGeometry = new THREE.CircleGeometry(1.2, 32);
  const oilMaterial = new THREE.MeshStandardMaterial({
    color: 0x0A0A0A,
    roughness: 0.3,
    metalness: 0.6,
    opacity: 0.8,
    transparent: true,
  });
  const oil = new THREE.Mesh(oilGeometry, oilMaterial);
  oil.rotation.x = -Math.PI / 2;
  oil.position.y = 0.01;
  oil.scale.set(1, 1.5, 1); // Forma irregular
  group.add(oil);

  // Tambor vazando (opcional)
  const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16);
  const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.8,
    metalness: 0.2,
  });
  const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
  barrel.position.set(0.8, 0.35, 0);
  barrel.rotation.z = Math.PI / 8;
  barrel.castShadow = true;
  group.add(barrel);
}

// 🎣 Rede de pesca ilegal
function createFishingNet(group: THREE.Group) {
  // Rede (plano semi-transparente com textura de grade)
  const netGeometry = new THREE.PlaneGeometry(2, 1.5);
  const netMaterial = new THREE.MeshStandardMaterial({
    color: 0x2E7D32,
    opacity: 0.6,
    transparent: true,
    roughness: 0.9,
    side: THREE.DoubleSide,
  });
  const net = new THREE.Mesh(netGeometry, netMaterial);
  net.rotation.x = -Math.PI / 2 + 0.2;
  net.position.y = 0.1;
  group.add(net);

  // Boias (esferas coloridas)
  for (let i = 0; i < 4; i++) {
    const buoyGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const buoyMaterial = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xFF6F00 : 0xFFFFFF,
      roughness: 0.5,
    });
    const buoy = new THREE.Mesh(buoyGeometry, buoyMaterial);
    buoy.position.set(i * 0.6 - 0.9, 0.15, Math.sin(i) * 0.3);
    buoy.castShadow = true;
    group.add(buoy);
  }
}

// 🌳 Área desmatada
function createDeforestationArea(group: THREE.Group) {
  // Tocos de árvore cortada
  for (let i = 0; i < 3; i++) {
    const stumpGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 12);
    const stumpMaterial = new THREE.MeshStandardMaterial({
      color: 0x5D4037,
      roughness: 0.9,
    });
    const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
    stump.position.set(i * 0.7 - 0.7, 0.2, Math.sin(i * 2) * 0.5);
    stump.castShadow = true;
    group.add(stump);

    // Topo do toco (anéis de crescimento)
    const topGeometry = new THREE.CircleGeometry(0.25, 16);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0x8D6E63,
      roughness: 0.95,
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.rotation.x = -Math.PI / 2;
    top.position.set(i * 0.7 - 0.7, 0.41, Math.sin(i * 2) * 0.5);
    group.add(top);
  }

  // Solo exposto (sem vegetação)
  const soilGeometry = new THREE.CircleGeometry(1.5, 16);
  const soilMaterial = new THREE.MeshStandardMaterial({
    color: 0x6D4C41,
    roughness: 1,
  });
  const soil = new THREE.Mesh(soilGeometry, soilMaterial);
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.01;
  group.add(soil);
}

// 🚤 Marcador de tráfego de embarcações
function createBoatMarker(group: THREE.Group) {
  // Sinal de aviso (placa)
  const signGeometry = new THREE.BoxGeometry(0.8, 1, 0.05);
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF9800,
    roughness: 0.5,
  });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.y = 0.8;
  sign.castShadow = true;
  group.add(sign);

  // Poste
  const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x424242,
    roughness: 0.8,
  });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 0.6;
  pole.castShadow = true;
  group.add(pole);

  // Símbolo de barco (simplificado)
  const boatSymbolGeometry = new THREE.ConeGeometry(0.2, 0.4, 3);
  const boatSymbolMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
  });
  const boatSymbol = new THREE.Mesh(boatSymbolGeometry, boatSymbolMaterial);
  boatSymbol.rotation.x = Math.PI / 2;
  boatSymbol.position.set(0, 0.8, 0.06);
  group.add(boatSymbol);
}

export function getImpactAtPosition(
  impactMeshes: ImpactMesh[],
  position: THREE.Vector3,
  maxDistance: number = 2.5
): ImpactMesh | null {
  for (const impact of impactMeshes) {
    const distance = position.distanceTo(impact.position);
    if (distance <= maxDistance) {
      return impact;
    }
  }
  return null;
}
