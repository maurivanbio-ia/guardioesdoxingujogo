// Turtle3D (Podocnemis) — versão avançada com realismo físico, cache e pós-processamento
// Requisitos de runtime: @react-three/fiber, @react-three/drei, three, three-stdlib (types GLTF), @react-three/postprocessing (opcional)
// Requisitos de assets: /models/tartaruga-expansa.glb, /models/podocnemis.glb, /textures/*, /hdr/tropical_riverbank.hdr (opcional)

import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
// Pós-processamento opcional
// import { EffectComposer, Bloom, SSAO, ToneMapping } from '@react-three/postprocessing'

export type Species = 'expansa' | 'unifilis'

export interface Turtle3DProps {
  species: Species
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  individualId?: string | number
  variant?: 'adult' | 'hatchling'
  isNesting?: boolean
  proceduralAnim?: boolean
  castShadow?: boolean
  receiveShadow?: boolean
  onReady?: () => void
}

type TextureDict = Record<string, THREE.Texture>

const textureCache = new Map<string, TextureDict>()
const materialCache = new Map<string, THREE.MeshStandardMaterial>()

function safeOffsetHSL(color: THREE.Color | undefined, h = 0, s = 0, l = 0): void {
  if (!color) return
  color.offsetHSL(h, s, l)
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function useTurtleTextures(species: Species): TextureDict {
  const key = species
  const cached = textureCache.get(key)
  if (cached) return cached

  const prefix = `/textures/${species}`
  const maps = useTexture({
    carapace_baseColor: `${prefix}/carapace_baseColor.jpg`,
    carapace_normal: `${prefix}/carapace_normal.jpg`,
    carapace_roughness: `${prefix}/carapace_roughness.jpg`,
    carapace_occlusion: `${prefix}/carapace_occlusion.jpg`,
    carapace_height: `${prefix}/carapace_height.jpg`,
    plastron_baseColor: `${prefix}/plastron_baseColor.jpg`,
    plastron_normal: `${prefix}/plastron_normal.jpg`,
    plastron_occlusion: `${prefix}/plastron_occlusion.jpg`,
    skin_baseColor: `${prefix}/skin_baseColor.jpg`,
    skin_normal: `${prefix}/skin_normal.jpg`,
    skin_occlusion: `${prefix}/skin_occlusion.jpg`,
    ...(species === 'unifilis' ? { mask_face: `${prefix}/mask_face.jpg` } : {})
  }) as TextureDict

  Object.values(maps).forEach((t) => {
    if (!t) return
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.anisotropy = 8
    t.needsUpdate = true
  })

  textureCache.set(key, maps)
  return maps
}

export function Turtle3D({
  species,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  variant = 'adult',
  isNesting = false,
  proceduralAnim = true,
  castShadow = true,
  receiveShadow = true,
  individualId,
  onReady
}: Turtle3DProps) {
  const modelPath = species === 'expansa' ? '/models/tartaruga-expansa.glb' : '/models/podocnemis.glb'
  const { scene, animations } = useGLTF(modelPath) as GLTF & { animations: THREE.AnimationClip[] }

  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Object3D | null>(null)
  const flipperLRef = useRef<THREE.Object3D | null>(null)
  const flipperRRef = useRef<THREE.Object3D | null>(null)
  const rearLRef = useRef<THREE.Object3D | null>(null)
  const rearRRef = useRef<THREE.Object3D | null>(null)

  const useCustomTextures = species !== 'expansa'
  const tx = useCustomTextures ? useTurtleTextures(species) : null

  const seed =
    typeof individualId === 'number'
      ? individualId
      : typeof individualId === 'string' && individualId.length > 0
      ? individualId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      : 1

  const hslVariation = useMemo(() => {
    const r1 = seededRandom(seed + 111)
    const r2 = seededRandom(seed + 222)
    const r3 = seededRandom(seed + 333)
    return { h: (r1 - 0.5) * 0.1, s: (r2 - 0.5) * 0.1, l: (r3 - 0.5) * 0.06 }
  }, [seed])

  const mixer = useMemo(() => {
    return animations?.length ? new THREE.AnimationMixer(scene) : null
  }, [animations, scene])

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!(mesh as any).isMesh) return
      mesh.castShadow = castShadow
      mesh.receiveShadow = receiveShadow

      const baseMat = mesh.material as THREE.MeshStandardMaterial
      if (!baseMat) return

      if (!useCustomTextures) {
        safeOffsetHSL(baseMat.color, hslVariation.h * 0.3, hslVariation.s * 0.3, hslVariation.l * 0.2)
        return
      }

      const name = baseMat.name || mesh.name || ''
      const matKey = `${species}:${name}`

      let mat = materialCache.get(matKey)
      if (!mat) {
        mat = baseMat.clone()
        mat.needsUpdate = true
        materialCache.set(matKey, mat)
      }
      mesh.material = mat

      if (name === 'mat_Carapace') {
        if (tx?.carapace_baseColor) mat.map = tx.carapace_baseColor
        if (tx?.carapace_normal) mat.normalMap = tx.carapace_normal
        if (tx?.carapace_roughness) mat.roughnessMap = tx.carapace_roughness
        if (tx?.carapace_occlusion) mat.aoMap = tx.carapace_occlusion
        if (tx?.carapace_height) {
          mat.displacementMap = tx.carapace_height
          mat.displacementScale = 0.01
        }
        mat.metalness = 0.1
        safeOffsetHSL(mat.color, hslVariation.h, hslVariation.s, hslVariation.l)
      } else if (name === 'mat_Plastron') {
        if (tx?.plastron_baseColor) mat.map = tx.plastron_baseColor
        if (tx?.plastron_normal) mat.normalMap = tx.plastron_normal
        if (tx?.plastron_occlusion) mat.aoMap = tx.plastron_occlusion
        mat.color.set('#b99860')
        mat.roughness = 0.8
      } else if (name === 'mat_Skin') {
        if (tx?.skin_baseColor) mat.map = tx.skin_baseColor
        if (tx?.skin_normal) mat.normalMap = tx.skin_normal
        if (tx?.skin_occlusion) mat.aoMap = tx.skin_occlusion
        safeOffsetHSL(mat.color, hslVariation.h * 0.5, 0, hslVariation.l)
        if (species === 'unifilis' && tx && (tx as any).mask_face) {
          const mask = (tx as any).mask_face as THREE.Texture
          mat.onBeforeCompile = (shader: THREE.Shader) => {
            shader.uniforms.maskMap = { value: mask }
            shader.fragmentShader = shader.fragmentShader
              .replace(
                '#include <common>',
                `
                #include <common>
                uniform sampler2D maskMap;
                `
              )
              .replace(
                '#include <map_fragment>',
                `
                #include <map_fragment>
                vec4 maskColor = texture2D(maskMap, vUv);
                vec3 tint = vec3(1.0, 0.9, 0.3);
                float lightFactor = clamp(dot(normalize(vNormal), normalize(vec3(0.3, 1.0, 0.3))), 0.0, 1.0);
                diffuseColor.rgb = mix(diffuseColor.rgb, tint, maskColor.r * 0.4 * lightFactor);
                `
              )
          }
          mat.needsUpdate = true
        }
      }
    })
    onReady?.()
  }, [scene, species, tx, hslVariation, onReady, useCustomTextures, castShadow, receiveShadow])

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name === 'Head') headRef.current = obj
      if (obj.name === 'L_Front') flipperLRef.current = obj
      if (obj.name === 'R_Front') flipperRRef.current = obj
      if (obj.name === 'L_Rear') rearLRef.current = obj
      if (obj.name === 'R_Rear') rearRRef.current = obj
    })
  }, [scene])

  useEffect(() => {
    if (!mixer || animations.length === 0) return
    const idle = THREE.AnimationClip.findByName(animations, 'idle_breathe') || animations[0]
    const dig = THREE.AnimationClip.findByName(animations, 'nesting_dig') || animations[0]
    const idleAction = mixer.clipAction(idle)
    const digAction = mixer.clipAction(dig)

    if (isNesting) {
      idleAction.enabled = true
      digAction.enabled = true
      idleAction.crossFadeTo(digAction, 1.2, false)
      digAction.reset().play()
    } else {
      digAction.enabled = true
      idleAction.enabled = true
      digAction.crossFadeTo(idleAction, 1.2, false)
      idleAction.reset().play()
    }
    return () => {
      idleAction.stop()
      digAction.stop()
    }
  }, [mixer, animations, isNesting])

  useFrame((_, dt) => {
    mixer?.update(dt)
    if (!proceduralAnim || mixer) return

    const t = performance.now() / 1000
    const baseScale = variant === 'hatchling' ? 0.12 : 1
    const breathe = 0.006 * (1 + Math.sin(t * 1.5))
    const jitter = (seededRandom(seed + Math.floor(t * 10)) - 0.5) * 0.003

    if (groupRef.current) {
      groupRef.current.scale.setScalar(baseScale * (1 + breathe * 0.5))
      groupRef.current.position.y += breathe + jitter
    }
    if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.8) * 0.1

    const amp = isNesting ? 0.4 : 0.15
    const spd = isNesting ? 3.8 : 1.5
    const noise = (n: number) => Math.sin(t * 0.5 + n) * 0.05

    if (flipperLRef.current) flipperLRef.current.rotation.z = Math.sin(t * spd) * amp + noise(0.2)
    if (flipperRRef.current) flipperRRef.current.rotation.z = -Math.sin(t * spd + 0.5) * amp + noise(0.7)
    if (rearLRef.current) rearLRef.current.rotation.z = Math.sin(t * spd * 0.6 + 0.3) * amp * 0.6
    if (rearRRef.current) rearRRef.current.rotation.z = -Math.sin(t * spd * 0.6 + 0.9) * amp * 0.6
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

export function TurtleLightingPreset({ withEnvironment = true }: { withEnvironment?: boolean }) {
  return (
    <>
      {withEnvironment && <Environment files="/hdr/tropical_riverbank.hdr" background={false} />}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 7, 3]}
        intensity={1.6}
        color={'#fffbe6'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />
      <spotLight position={[-5, 3, 2]} angle={0.6} penumbra={0.4} intensity={0.9} color={'#cce8ff'} />
      <hemisphereLight intensity={0.3} groundColor={'#3a2f23'} />
      <directionalLight position={[0, 3, -4]} intensity={0.5} color={'#f0d7b0'} />
    </>
  )
}

// Pós-processamento opcional para acabamento cinematográfico
export function TurtlePostFX() {
  return null
  // Remova o return acima e descomente o bloco abaixo se for usar @react-three/postprocessing
  /*
  return (
    <EffectComposer>
      <Bloom intensity={0.22} luminanceThreshold={0.4} luminanceSmoothing={0.85} />
      <SSAO radius={0.06} intensity={18} />
      <ToneMapping adaptive exposure={1.18} />
    </EffectComposer>
  )
  */
}

export function TurtleAdult(props: Omit<Turtle3DProps, 'variant'>) {
  return <Turtle3D variant="adult" {...props} />
}

export function TurtleHatchling(props: Omit<Turtle3DProps, 'variant' | 'scale'>) {
  return <Turtle3D variant="hatchling" scale={0.12} {...props} />
}

// Exemplo de uso
/*
<Canvas shadows camera={{ position: [4, 3, 6], fov: 45 }}>
  <color attach="background" args={["#bfe3ff"]} />
  <TurtleLightingPreset withEnvironment />
  <TurtlePostFX />
  <TurtleAdult species="expansa" individualId="E01" position={[0,0,0]} castShadow receiveShadow />
  <TurtleHatchling species="unifilis" individualId="U03" position={[2,0,1]} castShadow receiveShadow />
  <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
    <planeGeometry args={[40, 40]} />
    <meshStandardMaterial color="#d9c7a0" />
  </mesh>
</Canvas>
*/
