'use client'

import { useState, useCallback, memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Text3D, Center, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function Home() {
  const [text, setText] = useState('全国最大級')
  const [color, setColor] = useState('#FFD700') // ゴールド色
  const [bevelColor, setBevelColor] = useState('#8B4513') // 茶色
  const [selectedFont, setSelectedFont] = useState('/fonts/Noto Sans JP Black_Regular.json')
  
  // Material Effects
  const [metalness, setMetalness] = useState(1.0)
  const [roughness, setRoughness] = useState(0.6)
  const [emissive, setEmissive] = useState('#ffffff')
  const [emissiveIntensity, setEmissiveIntensity] = useState(0)
  
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

  const fonts = [
    { name: 'Noto Sans JP (日本語)', path: '/fonts/Noto Sans JP Black_Regular.json' },
    { name: 'Helvetiker (標準)', path: '/fonts/helvetiker_regular.typeface.json' },
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
  }) => {
    const sanitized = text.replace(/\n/g, ' ')
    
    return (
      <Center>
        <Text3D
          font={fontPath}
          size={size}
          height={height}
          curveSegments={curveSegments}
          bevelEnabled={bevelEnabled}
          bevelThickness={bevelThickness}
          bevelSize={bevelSize}
          bevelOffset={bevelOffset}
          bevelSegments={bevelSegments}
        >
          {sanitized}
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
      </Center>
    )
  })

  Text3DContent.displayName = 'Text3DContent'


  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Text Editor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-white rounded-lg overflow-hidden border border-gray-200">
            <Canvas
              camera={{ position: [0, 0, 5] }}
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
          </div>
        </div>
      </div>
    </div>
  )
}