'use client'

import { useState, useCallback, memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Text3D, Center, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Home() {
  const [text, setText] = useState('全国最大級')
  const [color, setColor] = useState('#FFD700') // ゴールド色
  const [bevelColor, setBevelColor] = useState('#8B4513') // 茶色
  const [selectedFont, setSelectedFont] = useState('https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Noto Sans JP Black_Regular.json')
  
  // Material Effects
  const [metalness, setMetalness] = useState(1.0)
  const [roughness, setRoughness] = useState(0.6)
  const [emissive, setEmissive] = useState('#ffffff')
  const [emissiveIntensity, setEmissiveIntensity] = useState(0)
  const [selectedTexture, setSelectedTexture] = useState('none')
  
  // Lighting Controls
  const [ambientIntensity, setAmbientIntensity] = useState(1.0)
  const [mainLightIntensity, setMainLightIntensity] = useState(20.0)
  const [sideLightIntensity, setSideLightIntensity] = useState(20.0)
  
  // Text3D Parameters
  const [size, setSize] = useState(1)
  const [height, setHeight] = useState(1) // デフォルト1に変更
  const [curveSegments, setCurveSegments] = useState(12)
  const [bevelEnabled, setBevelEnabled] = useState(true)
  const [bevelThickness, setBevelThickness] = useState(0.1)
  const [bevelSize, setBevelSize] = useState(0.1) // デフォルト0.1に変更
  const [bevelOffset, setBevelOffset] = useState(0)
  const [bevelSegments, setBevelSegments] = useState(5)
  const [letterSpacing, setLetterSpacing] = useState(0.9)

  const fonts = [
    { name: 'ゴシック（Noto Sans）', path: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Noto Sans JP Black_Regular.json' },
    { name: '筆文字（玉ねぎ楷書「激」）', path: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Tamanegi Kaisho Geki FreeVer 7_Regular.json' },
    { name: '装甲明朝', path: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/SoukouMincho_Regular.json' },
  ]

  const textures = [
    { name: 'None / なし', value: 'none', path: null },
    { name: 'Metal Plate / メタルプレート', value: 'metal', path: '/textures/metal_plate_diff_1k.jpg' },
    { name: 'Metal Gloss / 金属光沢', value: 'gloss', path: '/textures/pierre-bamin-_EzTds6Fo44-unsplash.jpg' },
  ]

  // プリセットスタイル
  const presets = [
    {
      name: 'ゴールド＆ゴシック',
      text: '全国最大級',
      settings: {
        color: '#FFD700',
        bevelColor: '#8B4513',
        selectedFont: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Noto Sans JP Black_Regular.json',
        metalness: 1,
        roughness: 0.6,
        emissive: '#ffffff',
        emissiveIntensity: 0,
        ambientIntensity: 1,
        mainLightIntensity: 20,
        sideLightIntensity: 20,
        size: 1,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5,
        selectedTexture: 'none',
        letterSpacing: 0.9
      }
    },
    {
      name: '激熱！筆文字',
      text: '激アツ',
      settings: {
        color: '#FF0000',
        bevelColor: '#FFD700',
        selectedFont: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Tamanegi Kaisho Geki FreeVer 7_Regular.json',
        metalness: 0.8,
        roughness: 0.4,
        emissive: '#ff0000',
        emissiveIntensity: 0.3,
        ambientIntensity: 1.5,
        mainLightIntensity: 25,
        sideLightIntensity: 15,
        size: 1.2,
        height: 1.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.15,
        bevelOffset: 0,
        bevelSegments: 5,
        selectedTexture: 'none',
        letterSpacing: 0.9
      }
    },
    {
      name: '高級感＆明朝',
      text: '大当確定',
      settings: {
        color: '#00D4FF',
        bevelColor: '#0080FF',
        selectedFont: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/SoukouMincho_Regular.json',
        metalness: 1,
        roughness: 0.2,
        emissive: '#ffffff',
        emissiveIntensity: 0.1,
        ambientIntensity: 0.8,
        mainLightIntensity: 30,
        sideLightIntensity: 25,
        size: 0.9,
        height: 0.8,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.08,
        bevelOffset: 0,
        bevelSegments: 8,
        selectedTexture: 'metal',
        letterSpacing: 0.8
      }
    }
  ]

  // Canvas を PNG としてダウンロード
  const handleDownload = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement('a')
    link.download = '3dtext.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  // プリセットを適用する関数
  const applyPreset = useCallback((preset: typeof presets[0]) => {
    setText(preset.text)
    setColor(preset.settings.color)
    setBevelColor(preset.settings.bevelColor)
    setSelectedFont(preset.settings.selectedFont)
    setMetalness(preset.settings.metalness)
    setRoughness(preset.settings.roughness)
    setEmissive(preset.settings.emissive)
    setEmissiveIntensity(preset.settings.emissiveIntensity)
    setAmbientIntensity(preset.settings.ambientIntensity)
    setMainLightIntensity(preset.settings.mainLightIntensity)
    setSideLightIntensity(preset.settings.sideLightIntensity)
    setSize(preset.settings.size)
    setHeight(preset.settings.height)
    setCurveSegments(preset.settings.curveSegments)
    setBevelEnabled(preset.settings.bevelEnabled)
    setBevelThickness(preset.settings.bevelThickness)
    setBevelSize(preset.settings.bevelSize)
    setBevelOffset(preset.settings.bevelOffset)
    setBevelSegments(preset.settings.bevelSegments)
    setSelectedTexture(preset.settings.selectedTexture)
    setLetterSpacing(preset.settings.letterSpacing)
  }, [])

  // Text3Dコンテンツのみ（Canvasの外）
  const Text3DContent = memo(({
    text,
    color,
    bevelColor,
    fontPath,
    size,
    height,
    curveSegments,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelOffset,
    bevelSegments,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
    selectedTexture,
    letterSpacing,
  }: {
    text: string
    color: string
    bevelColor: string
    fontPath: string
    size: number
    height: number
    curveSegments: number
    bevelEnabled: boolean
    bevelThickness: number
    bevelSize: number
    bevelOffset: number
    bevelSegments: number
    metalness: number
    roughness: number
    emissive: string
    emissiveIntensity: number
    selectedTexture: string
    letterSpacing: number
  }) => {
    const sanitized = text.replace(/\n/g, ' ')
    const characters = [...sanitized] // 文字列を1文字ずつの配列に分解
    
    // テクスチャの読み込み（全テクスチャを事前に読み込み）
    const selectedTextureInfo = textures.find(t => t.value === selectedTexture)
    const texturePaths = [
      '/textures/metal_plate_diff_1k.jpg',
      '/textures/pierre-bamin-_EzTds6Fo44-unsplash.jpg'
    ]
    
    // 常に全テクスチャを読み込み（条件なし）
    const textureArray = useTexture(texturePaths)
    const loadedTextures: { [key: string]: THREE.Texture } = {}
    
    texturePaths.forEach((path, index) => {
      const tex = Array.isArray(textureArray) ? textureArray[index] : textureArray
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(2, 2)
        loadedTextures[path] = tex
      }
    })
    
    // 選択されたテクスチャを取得
    const texture = selectedTextureInfo?.path ? loadedTextures[selectedTextureInfo.path] : null
    
    // 文字間隔の計算
    const spacing = size * letterSpacing
    
    return (
      <Center>
        <group>
          {characters.map((char, index) => (
            <Text3D
              key={index}
              font={fontPath}
              size={size}
              height={height}
              curveSegments={curveSegments}
              bevelEnabled={bevelEnabled}
              bevelThickness={bevelThickness}
              bevelSize={bevelSize}
              bevelOffset={bevelOffset}
              bevelSegments={bevelSegments}
              position={[(index - (characters.length - 1) / 2) * spacing, 0, 0]}
            >
              {char}
              {/* Try JSX approach for multi-material */}
              <meshStandardMaterial
                attach={(parent) => {
                  // Create materials array and assign to parent
                  const frontMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color),
                    metalness: metalness,
                    roughness: roughness,
                    emissive: new THREE.Color(emissive),
                    emissiveIntensity: emissiveIntensity,
                    map: texture, // テクスチャを適用
                  })
                  const sideMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(bevelColor),
                    metalness: metalness * 1.2,
                    roughness: roughness * 0.8,
                    emissive: new THREE.Color(emissive),
                    emissiveIntensity: emissiveIntensity * 0.5,
                  })
                  parent.material = [frontMaterial, sideMaterial]
                  return () => {
                    // Cleanup
                    frontMaterial.dispose()
                    sideMaterial.dispose()
                  }
                }}
              />
            </Text3D>
          ))}
        </group>
      </Center>
    )
  })

  Text3DContent.displayName = 'Text3DContent'


  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">パチ文字メーカー</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-white rounded-lg overflow-hidden border border-gray-200">
            <Canvas
              orthographic
              camera={{ position: [0, 0, 5], zoom: 100 }}
              gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
              style={{ width: '100%', height: '100%' }}
            >
              {/* シンプルな3灯ライティング */}
              <ambientLight intensity={ambientIntensity} color="#ffffff" />
              
              {/* メインライト（正面上から） */}
              <directionalLight position={[0, 10, 5]} intensity={mainLightIntensity} color="#ffffff" castShadow />
              
              {/* サイドライト（右から） */}
              <directionalLight position={[5, 3, 0]} intensity={sideLightIntensity} color="#ffff99" />
              
              <Text3DContent
                text={text}
                color={color}
                bevelColor={bevelColor}
                fontPath={selectedFont}
                size={size}
                height={height}
                curveSegments={curveSegments}
                bevelEnabled={bevelEnabled}
                bevelThickness={bevelThickness}
                bevelSize={bevelSize}
                bevelOffset={bevelOffset}
                bevelSegments={bevelSegments}
                metalness={metalness}
                roughness={roughness}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
                selectedTexture={selectedTexture}
                letterSpacing={letterSpacing}
              />
              <OrbitControls enablePan={false} enableZoom enableRotate />
            </Canvas>
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            <div>
              <label htmlFor="text-input" className="block mb-2 text-sm font-medium">
                Text / テキスト
              </label>
              <input
                id="text-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
            >
              PNG ダウンロード
            </button>
            
            <div>
              <label htmlFor="font-select" className="block mb-2 text-sm font-medium">
                Font / フォント
              </label>
              <select
                id="font-select"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
              >
                {fonts.map((font) => (
                  <option key={font.path} value={font.path}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="color-input" className="block mb-2 text-sm font-medium">
                Face Color / 表面色
              </label>
              <input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 bg-white border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            
            <div>
              <label htmlFor="bevel-color-input" className="block mb-2 text-sm font-medium">
                Bevel Color / ベベル色
              </label>
              <input
                id="bevel-color-input"
                type="color"
                value={bevelColor}
                onChange={(e) => setBevelColor(e.target.value)}
                className="w-full h-10 bg-white border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            
            {/* Material Effects */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Material Effects / マテリアル効果</h3>
              
              <div>
                <label className="block mb-1 text-sm">
                  Metalness / メタリック: {metalness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={metalness}
                  onChange={(e) => setMetalness(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Roughness / 粗さ: {roughness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="emissive-color" className="block mb-2 text-sm">
                  Emissive Color / 発光色
                </label>
                <input
                  id="emissive-color"
                  type="color"
                  value={emissive}
                  onChange={(e) => setEmissive(e.target.value)}
                  className="w-full h-8 bg-white border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Emissive Intensity / 発光強度: {emissiveIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={emissiveIntensity}
                  onChange={(e) => setEmissiveIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="texture-select" className="block mb-2 text-sm font-medium">
                  Texture / テクスチャ
                </label>
                <select
                  id="texture-select"
                  value={selectedTexture}
                  onChange={(e) => setSelectedTexture(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                >
                  {textures.map((texture) => (
                    <option key={texture.value} value={texture.value}>
                      {texture.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
            
            {/* Lighting Controls */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Lighting Controls / ライティング制御</h3>
              
              <div>
                <label className="block mb-1 text-sm">
                  Ambient Light / 環境光: {ambientIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={ambientIntensity}
                  onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Main Light / メインライト: {mainLightIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.1"
                  value={mainLightIntensity}
                  onChange={(e) => setMainLightIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Side Light / サイドライト: {sideLightIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={sideLightIntensity}
                  onChange={(e) => setSideLightIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Text3D Parameters */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">3D Parameters</h3>
              
              <div>
                <label className="block mb-1 text-sm">
                  Size / サイズ: {size.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={size}
                  onChange={(e) => setSize(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Height (Depth) / 高さ（奥行き）: {height.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Curve Segments / カーブ分割数: {curveSegments}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={curveSegments}
                  onChange={(e) => setCurveSegments(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Letter Spacing / 文字間隔: {letterSpacing.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="2.0"
                  step="0.05"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={bevelEnabled}
                    onChange={(e) => setBevelEnabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Bevel Enabled / ベベル有効</span>
                </label>
              </div>

              {bevelEnabled && (
                <>
                  <div>
                    <label className="block mb-1 text-sm">
                      Bevel Thickness / ベベル厚さ: {bevelThickness.toFixed(3)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.001"
                      value={bevelThickness}
                      onChange={(e) => setBevelThickness(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">
                      Bevel Size / ベベルサイズ: {bevelSize.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={bevelSize}
                      onChange={(e) => setBevelSize(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">
                      Bevel Offset / ベベルオフセット: {bevelOffset.toFixed(3)}
                    </label>
                    <input
                      type="range"
                      min="-0.1"
                      max="0.1"
                      step="0.001"
                      value={bevelOffset}
                      onChange={(e) => setBevelOffset(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">
                      Bevel Segments / ベベル分割数: {bevelSegments}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={bevelSegments}
                      onChange={(e) => setBevelSegments(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* JSON Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Settings (JSON) / 設定（JSON）</h3>
              
              <textarea
                value={JSON.stringify({
                  text,
                  color,
                  bevelColor,
                  selectedFont,
                  metalness,
                  roughness,
                  emissive,
                  emissiveIntensity,
                  ambientIntensity,
                  mainLightIntensity,
                  sideLightIntensity,
                  size,
                  height,
                  curveSegments,
                  bevelEnabled,
                  bevelThickness,
                  bevelSize,
                  bevelOffset,
                  bevelSegments,
                  selectedTexture,
                  letterSpacing
                }, null, 2)}
                onChange={(e) => {
                  try {
                    const settings = JSON.parse(e.target.value)
                    
                    // Apply settings with validation
                    if (settings.text !== undefined) setText(settings.text)
                    if (settings.color !== undefined) setColor(settings.color)
                    if (settings.bevelColor !== undefined) setBevelColor(settings.bevelColor)
                    if (settings.selectedFont !== undefined) setSelectedFont(settings.selectedFont)
                    if (settings.metalness !== undefined) setMetalness(settings.metalness)
                    if (settings.roughness !== undefined) setRoughness(settings.roughness)
                    if (settings.emissive !== undefined) setEmissive(settings.emissive)
                    if (settings.emissiveIntensity !== undefined) setEmissiveIntensity(settings.emissiveIntensity)
                    if (settings.ambientIntensity !== undefined) setAmbientIntensity(settings.ambientIntensity)
                    if (settings.mainLightIntensity !== undefined) setMainLightIntensity(settings.mainLightIntensity)
                    if (settings.sideLightIntensity !== undefined) setSideLightIntensity(settings.sideLightIntensity)
                    if (settings.size !== undefined) setSize(settings.size)
                    if (settings.height !== undefined) setHeight(settings.height)
                    if (settings.curveSegments !== undefined) setCurveSegments(settings.curveSegments)
                    if (settings.bevelEnabled !== undefined) setBevelEnabled(settings.bevelEnabled)
                    if (settings.bevelThickness !== undefined) setBevelThickness(settings.bevelThickness)
                    if (settings.bevelSize !== undefined) setBevelSize(settings.bevelSize)
                    if (settings.bevelOffset !== undefined) setBevelOffset(settings.bevelOffset)
                    if (settings.bevelSegments !== undefined) setBevelSegments(settings.bevelSegments)
                    if (settings.selectedTexture !== undefined) setSelectedTexture(settings.selectedTexture)
                    if (settings.letterSpacing !== undefined) setLetterSpacing(settings.letterSpacing)
                  } catch (error) {
                    // Invalid JSON - ignore
                  }
                }}
                className="w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-xs overflow-auto resize-none focus:outline-none focus:border-blue-500"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
        
        {/* プリセットスタイル */}
        <div className="mt-12 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">スタイルプリセット</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {presets.map((preset, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-2">{preset.name}</h3>
                <div className="mb-4">
                  <div className="h-32 bg-white rounded border border-gray-300 flex items-center justify-center relative overflow-hidden">
                    <Canvas
                      orthographic
                      camera={{ position: [0, 0, 4], zoom: 80 }}
                      gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <ambientLight intensity={preset.settings.ambientIntensity} color="#ffffff" />
                      <directionalLight position={[0, 10, 5]} intensity={preset.settings.mainLightIntensity} color="#ffffff" />
                      <directionalLight position={[5, 3, 0]} intensity={preset.settings.sideLightIntensity} color="#ffff99" />
                      
                      <Text3DContent
                        text={preset.text}
                        color={preset.settings.color}
                        bevelColor={preset.settings.bevelColor}
                        fontPath={preset.settings.selectedFont}
                        size={preset.settings.size * 0.8}
                        height={preset.settings.height}
                        curveSegments={preset.settings.curveSegments}
                        bevelEnabled={preset.settings.bevelEnabled}
                        bevelThickness={preset.settings.bevelThickness}
                        bevelSize={preset.settings.bevelSize}
                        bevelOffset={preset.settings.bevelOffset}
                        bevelSegments={preset.settings.bevelSegments}
                        metalness={preset.settings.metalness}
                        roughness={preset.settings.roughness}
                        emissive={preset.settings.emissive}
                        emissiveIntensity={preset.settings.emissiveIntensity}
                        selectedTexture={preset.settings.selectedTexture}
                        letterSpacing={preset.settings.letterSpacing}
                      />
                      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
                    </Canvas>
                  </div>
                </div>
                <button
                  onClick={() => applyPreset(preset)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  このスタイルを使う
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}