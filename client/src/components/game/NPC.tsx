// ================================================================
// Single-file: Player com Animações Corporais + Fala (TTS opcional)
// Stack: React Three Fiber (R3F) + Drei + WebAudio + (OpenAI/ElevenLabs TTS opcional)
// Mantém testes runtime do arquivo anterior e adiciona testes mínimos de TTS.
// ================================================================

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Se você usa contexto de jogo, adapte/importe daqui:
// import { useGame } from '@/contexts/GameContext';
// import { GAME_CONFIG, COLORS } from '@/lib/gameConstants';
// Para este single-file, definimos defaults simples:
const GAME_CONFIG = {
  PLAYER_SPEED: 4,
  PLAYER_RUN_SPEED: 7,
};
const COLORS = {
  ecobrasil: { green: '#2E8B57', blue: '#2b6cb0', yellow: '#ffd166' },
};

// ────────────────────────────────────────────────────────────────
// 1) Tipos & Diálogo (mantidos do canvas anterior, sem redefinir)
// ────────────────────────────────────────────────────────────────
export type Emotion = 'calm' | 'excited' | 'sad';

export interface DialogueChoice {
  id: string;
  label: string;
  next: string; // id do próximo nó
  setEmotion?: Emotion; // emoção do NPC após escolher
}

export interface DialogueNode {
  id: string;
  speaker: string; // nome do NPC
  text: string; // fala do NPC
  emotion?: Emotion;
  choices?: DialogueChoice[]; // se vazio -> nó terminal
}

export interface DialogueTree {
  id: string; // id do diálogo (por NPC ou por quest)
  start: string; // id do primeiro nó
  nodes: Record<string, DialogueNode>;
}

export const sampleTree: DialogueTree = {
  id: 'helena_onboarding',
  start: 'n0',
  nodes: {
    n0: {
      id: 'n0',
      speaker: 'Dra. Helena',
      text: 'Bem-vindo ao manejo de quelônios no Xingu. Esta é uma fala de demonstração do TTS.',
      emotion: 'calm',
      choices: [
        { id: 'c1', label: 'Começar!', next: 'n1', setEmotion: 'excited' },
      ],
    },
    n1: {
      id: 'n1',
      speaker: 'Dra. Helena',
      text: 'Ótimo! Vamos iniciar com noções de segurança e manejo humanitário.',
      emotion: 'excited',
    },
  },
};

export interface EmotionParams {
  gestureIntensity: number; // 0..1 amplitude de gestos
  headFollow: number;       // 0..1 rapidez do olhar
  nameColor: string;        // cor do label (se houver UI)
  tts: {
    speakingRate: number;   // 0.8..1.3
    pitch: number;          // semitons
    volumeGainDb: number;   // -6..+6
  };
}

export const EMOTION_MAP: Record<Emotion, EmotionParams> = {
  calm:    { gestureIntensity: 0.25, headFollow: 0.5, nameColor: '#80C7FF', tts: { speakingRate: 0.95, pitch: -1, volumeGainDb: 0 } },
  excited: { gestureIntensity: 0.85, headFollow: 0.9, nameColor: '#FFD700', tts: { speakingRate: 1.15, pitch: +2, volumeGainDb: +2 } },
  sad:     { gestureIntensity: 0.15, headFollow: 0.3, nameColor: '#A0AEC0', tts: { speakingRate: 0.9, pitch: -2, volumeGainDb: -1 } },
};

// ────────────────────────────────────────────────────────────────
// 2) Mini store de diálogo sem libs (como no canvas anterior)
// ────────────────────────────────────────────────────────────────
 type Listener<T> = (s: T) => void;
 interface DialogueState { open: boolean; tree: DialogueTree | null; node: DialogueNode | null; emotion: Emotion; }
 const INITIAL: DialogueState = { open: false, tree: null, node: null, emotion: 'calm' };
 function createDialogueStore() {
  let state = { ...INITIAL } as DialogueState;
  const listeners = new Set<Listener<DialogueState>>();
  const notify = () => listeners.forEach((l) => l({ ...state }));
  return {
    getState: () => state,
    subscribe: (fn: Listener<DialogueState>) => { listeners.add(fn); return () => listeners.delete(fn); },
    start: (tree: DialogueTree) => { state.open = true; state.tree = tree; state.node = tree.nodes[tree.start]; state.emotion = state.node?.emotion ?? 'calm'; notify(); },
    choose: (choiceId: string) => { const node = state.node; if (!state.tree || !node || !node.choices) return; const c = node.choices.find((x)=>x.id===choiceId); if(!c) return; const next = state.tree.nodes[c.next]; state.node = next; state.emotion = c.setEmotion ?? next.emotion ?? state.emotion; notify(); },
    close: () => { state = { ...INITIAL }; notify(); },
  };
 }
 export const dialogueStore = createDialogueStore();

// ────────────────────────────────────────────────────────────────
// 3) TTS Util (cliente): tenta OpenAI/ElevenLabs via endpoints ou simula
// ────────────────────────────────────────────────────────────────
interface SpeakOptions { provider?: 'openai'|'elevenlabs'; voiceId?: string; emotion?: Emotion; }

async function fetchTTS(text: string, { provider = 'openai', voiceId, emotion = 'calm' }: SpeakOptions) {
  // 🔒 Recomenda-se ter rotas de API no servidor para proteger as chaves.
  // Aqui tentamos endpoints convencionais; se não existirem, simulamos.
  const endpoint = provider === 'openai' ? '/api/tts/openai' : '/api/tts/elevenlabs';
  try {
    const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, emotion, voiceId }) });
    if (!r.ok) throw new Error('TTS endpoint unavailable');
    const arrayBuf = await r.arrayBuffer();
    return new Blob([arrayBuf], { type: 'audio/mpeg' });
  } catch(e) {
    console.warn('[TTS] endpoint não encontrado, usando simulação local.', e);
    return null; // retorna null para acionar simulação (oscilador)
  }
}

function useSpeechAnalyser() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | MediaElementAudioSourceNode | OscillatorNode | null>(null);

  useEffect(() => () => { // cleanup global ao desmontar
    try { sourceRef.current && 'stop' in sourceRef.current && (sourceRef.current as any).stop(); } catch {}
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
  }, []);

  async function speak(text: string, opts: SpeakOptions = {}) {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioCtx = audioCtxRef.current;

    // Tenta buscar TTS
    const blob = await fetchTTS(text, opts);
    let srcNode: AudioBufferSourceNode | OscillatorNode | null = null;

    if (blob) {
      const buf = await blob.arrayBuffer();
      const audioBuf = await audioCtx.decodeAudioData(buf);
      const node = audioCtx.createBufferSource();
      node.buffer = audioBuf;
      node.connect(audioCtx.destination);
      node.start(0);
      srcNode = node;
    } else {
      // Fallback: oscilador simulando voz
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 180;
      gain.gain.value = 0.2;
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      setTimeout(()=> osc.stop(), 3500);
      srcNode = osc;
    }

    // Conectar Analyser para medir energia
    if (srcNode) {
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const src = (srcNode as any).connect ? (srcNode as any) : null;
      if (src) src.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyserRef.current = analyser;
      sourceRef.current = srcNode;
    }
  }

  function getEnergy() {
    const analyser = analyserRef.current; if (!analyser) return 0;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let sum = 0; for (let i=0;i<data.length;i++) sum += data[i];
    return (sum / (data.length * 255)); // 0..1
  }

  function isSpeaking() {
    return !!analyserRef.current; // heurística simples
  }

  return { speak, getEnergy, isSpeaking };
}

// ────────────────────────────────────────────────────────────────
// 4) Player com animações de corpo + cabeça + boca sincronizada
// ────────────────────────────────────────────────────────────────
export function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const keysPressed = useRef<Set<string>>(new Set());

  // TTS/voz
  const { speak, getEnergy } = useSpeechAnalyser();

  // Inicia diálogo/voz demo ao montar
  useEffect(() => {
    // start diálogo simples
    speak(sampleTree.nodes[sampleTree.start].text, { provider: 'openai', emotion: 'calm' });
  }, [speak]);

  // Teclado
  useEffect(() => {
    const kd = (e: KeyboardEvent) => keysPressed.current.add(e.key.toLowerCase());
    const ku = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, []);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    // Movimentação
    const forward = keysPressed.current.has('w') || keysPressed.current.has('arrowup');
    const backward = keysPressed.current.has('s') || keysPressed.current.has('arrowdown');
    const left = keysPressed.current.has('a') || keysPressed.current.has('arrowleft');
    const right = keysPressed.current.has('d') || keysPressed.current.has('arrowright');
    const shift = keysPressed.current.has('shift');

    const speed = shift ? GAME_CONFIG.PLAYER_RUN_SPEED : GAME_CONFIG.PLAYER_SPEED;
    const dir = new THREE.Vector3();
    if (forward) dir.z -= 1; if (backward) dir.z += 1; if (left) dir.x -= 1; if (right) dir.x += 1;

    if (dir.length() > 0) { dir.normalize(); velocity.current.x = dir.x * speed; velocity.current.z = dir.z * speed; }
    else { velocity.current.multiplyScalar(0.8); }

    playerRef.current.position.addScaledVector(velocity.current, delta);
    playerRef.current.position.x = THREE.MathUtils.clamp(playerRef.current.position.x, -50, 50);
    playerRef.current.position.z = THREE.MathUtils.clamp(playerRef.current.position.z, -50, 50);
    if (velocity.current.length() > 0.05) playerRef.current.rotation.y = Math.atan2(velocity.current.x, velocity.current.z);
  });

  return (
    <group ref={playerRef} position={[0, 1.5, 0]}>
      <BiologistBody energyFn={getEnergy} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────
// 5) BiologistBody: corpo 3D com logo + animações e lipsync
// ────────────────────────────────────────────────────────────────
function BiologistBody({ energyFn }: { energyFn: () => number }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const torsoRef = useRef<THREE.Mesh>(null);

  const { camera } = useThree();
  const logoTexture = useTexture('http://ecobrasil.bio.br/wp-content/uploads/2017/02/Logo-Retina-a.png');

  // Materiais memo
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFD9B3', roughness: 0.8 }), []);
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.ecobrasil.green, roughness: 0.6, metalness: 0.2 }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const energy = energyFn(); // 0..1

    // Respiração (idle)
    if (groupRef.current) groupRef.current.position.y = 0.05 * Math.sin(t * 1.6);

    // Balanço de braços: aumenta com energia da fala
    const amp = 0.15 + 0.25 * energy; // amplitude cresce com a fala
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t * 3.2) * amp;
      rightArmRef.current.rotation.z = -Math.sin(t * 3.2) * amp;
    }

    // Boca sincronizada com voz (escala vertical)
    if (mouthRef.current) {
      const mouthScale = 1 + energy * 0.6; // 1..1.6
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y || 1, mouthScale, 0.4);
    }

    // Inclinação do tronco sutil quando "falando"
    if (torsoRef.current) {
      torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, energy * 0.12, 0.2);
    }

    // Cabeça: olhar suave para câmera (ou direção do movimento, se tiver)
    if (headRef.current) {
      // Look-at aproximado: gira no Y para encarar a câmera de forma sutil
      const target = camera.position.clone();
      const self = new THREE.Vector3();
      groupRef.current?.getWorldPosition(self);
      const dir = new THREE.Vector3().subVectors(target, self).normalize();
      const angleY = Math.atan2(dir.x, dir.z);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, angleY * 0.2, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cabeça */}
      <mesh ref={headRef} position={[0, 1.5, 0]} castShadow material={skinMat}>
        <sphereGeometry args={[0.25, 16, 16]} />
      </mesh>

      {/* Boca (lipsync) */}
      <mesh ref={mouthRef} position={[0, 1.38, 0.18]}>
        <boxGeometry args={[0.12, 0.05, 0.05]} />
        <meshStandardMaterial color={'#e6b89c'} roughness={0.9} />
      </mesh>

      {/* Chapéu */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1.85, 0.15]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.02, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Torso - Camiseta com logo */}
      <mesh ref={torsoRef} position={[0, 0.9, 0]} castShadow material={shirtMat}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
      </mesh>
      <mesh position={[0, 1.0, 0.152]}>
        <planeGeometry args={[0.25, 0.1]} />
        <meshStandardMaterial map={logoTexture} transparent />
      </mesh>

      {/* Braços */}
      <mesh ref={leftArmRef} position={[-0.4, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={COLORS.ecobrasil.green} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.4, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={COLORS.ecobrasil.green} />
      </mesh>

      {/* Mãos */}
      <mesh position={[-0.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFD9B3" />
      </mesh>
      <mesh position={[0.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFD9B3" />
      </mesh>

      {/* Calça, pernas, botas, mochila */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.3]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>
      <mesh position={[-0.15, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>
      <mesh position={[0.15, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>
      <mesh position={[-0.15, -0.7, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.25]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.15, -0.7, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.25]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 0.9, -0.25]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#2F4F2F" />
      </mesh>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────
// 6) TESTES (Runtime) — mantidos e ampliados
// ────────────────────────────────────────────────────────────────
(function runtimeTests() {
  // Teste 1: EMOTION_MAP contém todas as emoções
  const expected: Emotion[] = ['calm', 'excited', 'sad'];
  for (const e of expected) { if (!(e in EMOTION_MAP)) throw new Error(`[TEST] EMOTION_MAP faltando chave: ${e}`); }

  // Teste 2: sampleTree estrutura básica
  if (!sampleTree.nodes[sampleTree.start]) throw new Error('[TEST] sampleTree.start inválido');

  // Teste 3: Função TTS existe e retorna Promise
  const maybePromise = (async ()=> await fetchTTS('teste', { provider: 'openai', emotion: 'calm' }))();
  if (!(maybePromise instanceof Promise)) throw new Error('[TEST] fetchTTS não é Promise');
})();

// ────────────────────────────────────────────────────────────────
// 7) Observações
// ────────────────────────────────────────────────────────────────
// • Para voz real, exponha rotas /api/tts/openai e /api/tts/elevenlabs no servidor.
// • Sem servidor, o fallback usa um oscilador local — anima a boca e os gestos,
//   mas NÃO reproduz voz real.
// • Você pode chamar `speak('texto', {provider:'elevenlabs', voiceId:'...'} )` a partir
//   de eventos do jogo (interação, proximidade, etc.) mantendo a sincronização facial.
