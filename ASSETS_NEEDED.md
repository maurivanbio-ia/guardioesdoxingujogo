# 🐢 Assets Necessários para Tartarugas Realistas

## Modelos 3D

### `client/public/models/podocnemis.glb`
- Modelo 3D rigged de tartaruga amazônica
- Deve incluir:
  - Mesh: Carapace (casco superior)
  - Mesh: Plastron (casco inferior)
  - Mesh: Skin (pele - cabeça, pescoço, patas)
  - Bones: Head, L_Front, R_Front, L_Rear, R_Rear
- Animações:
  - `idle_breathe` - Respiração suave
  - `nesting_dig` - Escavando ninho
  - `walk` - Caminhando

## Texturas

### Para P. expansa (Tartaruga-da-Amazônia)
```
client/public/textures/expansa/
├── carapace_baseColor.jpg   (textura do casco - marrom escuro com padrões)
├── carapace_normal.jpg      (mapa de normais para relevo)
├── carapace_roughness.jpg   (rugosidade - mais áspera)
├── plastron_baseColor.jpg   (casco inferior - bege/creme)
├── plastron_normal.jpg      (normais do plastron)
├── skin_baseColor.jpg       (pele - cinza/verde oliva)
└── skin_normal.jpg          (normais da pele)
```

### Para P. unifilis (Tracajá)
```
client/public/textures/unifilis/
├── carapace_baseColor.jpg
├── carapace_normal.jpg
├── carapace_roughness.jpg
├── plastron_baseColor.jpg
├── plastron_normal.jpg
├── skin_baseColor.jpg
├── skin_normal.jpg
└── mask_face.jpg           (IMPORTANTE: máscara para manchas amarelas na cabeça)
```

## Características Visuais por Espécie

### P. expansa (Tartaruga-da-Amazônia)
- Casco: Marrom escuro quase preto, liso
- Plastron: Bege claro (#e1c78f)
- Pele: Verde-oliva escuro
- Tamanho: Maior (scale 1.0)

### P. unifilis (Tracajá)
- Casco: Marrom médio com padrão sutil
- Plastron: Marrom amarelado (#b99860)
- Pele: Cinza-esverdeado
- **Manchas amarelas características na cabeça** (via mask_face.jpg)
- Tamanho: Médio (scale 0.8)

### P. sextuberculata (Iaçá)
- Casco: Marrom com 6 tubérculos visíveis
- Plastron: Marrom claro
- Pele: Marrom-acinzentado
- Tamanho: Pequeno (scale 0.6)

## Fontes de Referência

Para criar as texturas realistas:
1. **Fotografias científicas** de quelônios amazônicos
2. **Texturas procedurais** no Blender/Substance Painter:
   - Noise para rugosidade do casco
   - Voronoi para padrões orgânicos
   - Color ramp para variações naturais
3. **Mapas de normal** gerados a partir de heightmaps
4. **Mask da face** (unifilis): Máscara em escala de cinza onde:
   - Branco = Mancha amarela
   - Preto = Cor normal da pele

## Alternativa Temporária

Enquanto os assets não estiverem disponíveis, o componente usa:
- Cores sólidas procedurais
- Geometria simples de esferas/boxes
- Variação HSL para individualizar cada tartaruga

## Como Integrar

1. Crie/obtenha os assets acima
2. Coloque nos diretórios especificados
3. O componente `Turtle.tsx` já está configurado para carregar automaticamente
4. Teste com:
```tsx
<TurtleAdult species="expansa" individualId="T001" position={[0, 0, 0]} />
<TurtleAdult species="unifilis" individualId="T002" position={[2, 0, 0]} />
```

---

**Status Atual:** ✅ Componente implementado | ⏳ Assets pendentes
