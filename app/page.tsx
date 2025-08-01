'use client'

import { useState, useCallback, memo } from 'react'
import Image from 'next/image'
import { Canvas } from '@react-three/fiber'
import { Text3D, Center, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { sendGAEvent } from '@/utils/analytics'

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
  const [letterSpacing, setLetterSpacing] = useState(1.25)
  const [isJsonOpen, setIsJsonOpen] = useState(false)

  const fonts = [
    { name: 'ゴシック（Noto Sans）- 約16,000字', path: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Noto Sans JP Black_Regular.json' },
    { name: '明朝体（装甲明朝）- 約7,900字', path: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/SoukouMincho_Regular.json' },
    { name: '筆文字（玉ねぎ楷書「激」）- 約3,800字', path: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Tamanegi Kaisho Geki FreeVer 7_Regular.json' },
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
      image: '/images/sample-gothic.png',
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
        size: 1.4,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5,
        selectedTexture: 'none',
        letterSpacing: 1.25
      }
    },
    {
      name: '高級感＆明朝',
      text: '新台入替',
      image: '/images/sample-mincho.png',
      settings: {
        color: '#fff700',
        bevelColor: '#6b00b3',
        selectedFont: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/SoukouMincho_Regular.json',
        metalness: 0.8,
        roughness: 0.1,
        emissive: '#ffffff',
        emissiveIntensity: 0.1,
        ambientIntensity: 2,
        mainLightIntensity: 30,
        sideLightIntensity: 25,
        size: 1.7,
        height: 2.1,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.19,
        bevelSize: 0.1,
        bevelOffset: 0.001,
        bevelSegments: 8,
        selectedTexture: 'none',
        letterSpacing: 1.25
      }
    },
    {
      name: '激熱！筆文字',
      text: '激アツ!',
      image: '/images/sample-kaisho.png',
      settings: {
        color: '#FF0000',
        bevelColor: '#fbff24',
        selectedFont: 'https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Tamanegi Kaisho Geki FreeVer 7_Regular.json',
        metalness: 0.8,
        roughness: 0.4,
        emissive: '#ff0000',
        emissiveIntensity: 0.34,
        ambientIntensity: 1.5,
        mainLightIntensity: 25,
        sideLightIntensity: 15,
        size: 2.0,
        height: 0.7,
        curveSegments: 9,
        bevelEnabled: true,
        bevelThickness: 0.214,
        bevelSize: 0.22,
        bevelOffset: -0.022,
        bevelSegments: 7,
        selectedTexture: 'none',
        letterSpacing: 1.15
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
    
    // Google Analytics イベント送信
    sendGAEvent('download_png', {
      event_category: 'engagement',
      event_label: '3d_text_png'
    })
  }, [])

  // プリセットを適用する関数
  const applyPreset = useCallback((preset: typeof presets[0]) => {
    // テキストは変更しない
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


  // 構造化データ (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "パチ文字メーカー",
    "alternateName": "3D Text Maker",
    "description": "パチンコでよく見る豪華な文字を簡単に作成できる無料のオンライン3Dツール。チラシ、ポスター、SNS投稿用の派手な文字デザインが誰でも簡単に作れます。",
    "url": "https://3dtext.sawara.dev",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "creator": {
      "@type": "Organization",
      "name": "パチ文字メーカー"
    },
    "featureList": [
      "3D文字作成",
      "日本語フォント対応",
      "リアルタイム編集",
      "カラーカスタマイズ",
      "マテリアル効果",
      "ライティング制御",
      "PNG書き出し"
    ],
    "screenshot": "https://3dtext.sawara.dev/og-image.png",
    "softwareVersion": "1.0",
    "datePublished": "2025-01-31",
    "dateModified": "2025-01-31",
    "inLanguage": ["ja", "en"],
    "audience": {
      "@type": "Audience",
      "audienceType": "デザイナー、チラシ制作者、SNS運用担当者、パチンコホール広報担当者"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto p-8">
        <div className="mb-8">
          <Image
            src="/images/logo.png"
            alt="パチ文字メーカー"
            width={120}
            height={48}
            className="h-12 w-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[400px] bg-white rounded-lg overflow-hidden border border-gray-200">
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
          
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
            <div>
              <label htmlFor="text-input" className="block mb-2 text-sm font-medium">
                テキスト / Text
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
              画像ダウンロード（透過PNG）
            </button>
            
            <div>
              <label htmlFor="font-select" className="block mb-2 text-sm font-medium">
                フォント / Font
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
              <label className="block mb-2 text-sm font-medium">
                文字間隔 / Letter Spacing: {letterSpacing.toFixed(2)}
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
              <label htmlFor="color-input" className="block mb-2 text-sm font-medium">
                表面色 / Face Color
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
                ベベル色 / Bevel Color
              </label>
              <input
                id="bevel-color-input"
                type="color"
                value={bevelColor}
                onChange={(e) => setBevelColor(e.target.value)}
                className="w-full h-10 bg-white border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            
            {/* 3D Parameters */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">3D設定 / 3D Parameters</h3>
              
              <div>
                <label className="block mb-1 text-sm">
                  サイズ / Size: {size.toFixed(2)}
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
                  高さ（奥行き） / Height (Depth): {height.toFixed(2)}
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
                  カーブ分割数 / Curve Segments: {curveSegments}
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
                  ベベル厚さ / Bevel Thickness: {bevelThickness.toFixed(3)}
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
                  ベベルサイズ / Bevel Size: {bevelSize.toFixed(2)}
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
                  ベベルオフセット / Bevel Offset: {bevelOffset.toFixed(3)}
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
                  ベベル分割数 / Bevel Segments: {bevelSegments}
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
            </div>
            
            {/* Material Effects */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">マテリアル効果 / Material Effects</h3>
              
              <div>
                <label className="block mb-1 text-sm">
                  メタリック / Metalness: {metalness.toFixed(2)}
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
                  粗さ / Roughness: {roughness.toFixed(2)}
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
                  発光色 / Emissive Color
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
                  発光強度 / Emissive Intensity: {emissiveIntensity.toFixed(2)}
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
                  テクスチャ / Texture
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
              <h3 className="font-medium">ライティング制御 / Lighting Controls</h3>
              
              <div>
                <label className="block mb-1 text-sm">
                  環境光 / Ambient Light: {ambientIntensity.toFixed(2)}
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
                  メインライト / Main Light: {mainLightIntensity.toFixed(2)}
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
                  サイドライト / Side Light: {sideLightIntensity.toFixed(2)}
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
            
            {/* JSON Settings */}
            <div className="space-y-4 border-t pt-4">
              <button
                onClick={() => setIsJsonOpen(!isJsonOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-medium">設定（JSON） / Settings (JSON)</h3>
                <span className="text-lg">{isJsonOpen ? '−' : '+'}</span>
              </button>
              
              {isJsonOpen && (
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
                  } catch {
                    // Invalid JSON - ignore
                  }
                }}
                className="w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-xs overflow-auto resize-none focus:outline-none focus:border-blue-500"
                spellCheck={false}
              />
              )}
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
                    <Image
                      src={preset.image}
                      alt={preset.name}
                      width={200}
                      height={128}
                      className="w-full h-full object-contain"
                    />
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
        
        {/* フッター */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-4">
            <span>使用フォント:</span>
            <a 
              href="https://fonts.google.com/noto/specimen/Noto+Sans+JP" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-600 underline"
            >
              Noto Sans JP
            </a>
            <span>・</span>
            <a 
              href="https://booth.pm/ja/items/2929647" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-600 underline"
            >
              玉ねぎ楷書「激」
            </a>
            <span>・</span>
            <a 
              href="https://flopdesign.booth.pm/items/1028555" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-600 underline"
            >
              装甲明朝
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Made by</span>
            <video
              ref={(video) => {
                if (video) {
                  video.onclick = () => {
                    // 最初から再生
                    video.currentTime = 0
                    video.play()
                    // Google Analytics イベント送信
                    sendGAEvent('sawara_dog_video_play', {
                      event_category: 'engagement',
                      event_label: 'footer_video'
                    })
                  }
                  // 動画が終わったら停止
                  video.onended = () => {
                    video.pause()
                  }
                }
              }}
              className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              muted
              playsInline
            >
              <source src="/images/logo.mp4" type="video/mp4" />
            </video>
          </div>
        </footer>
        </div>
      </div>
    </>
  )
}