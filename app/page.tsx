'use client'

import { useState, useCallback, memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Text3D, Center, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function Home() {
  const [text, setText] = useState('全国最大級')
  const [color, setColor] = useState('#ffffff')
  const [bevelColor, setBevelColor] = useState('#ffaa00')
  const [selectedFont, setSelectedFont] = useState('/fonts/Noto Sans JP Black_Regular.json')
  
  // Material Effects
  const [metalness, setMetalness] = useState(0.5)
  const [roughness, setRoughness] = useState(0.1)
  const [emissive, setEmissive] = useState('#000000')
  const [emissiveIntensity, setEmissiveIntensity] = useState(0)
  const [useGradient, setUseGradient] = useState(false)
  const [gradientColor1, setGradientColor1] = useState('#ff0000')
  const [gradientColor2, setGradientColor2] = useState('#00ff00')
  
  // Text3D Parameters
  const [size, setSize] = useState(1)
  const [height, setHeight] = useState(0.2)
  const [curveSegments, setCurveSegments] = useState(12)
  const [bevelEnabled, setBevelEnabled] = useState(true)
  const [bevelThickness, setBevelThickness] = useState(0.02)
  const [bevelSize, setBevelSize] = useState(0.02)
  const [bevelOffset, setBevelOffset] = useState(0)
  const [bevelSegments, setBevelSegments] = useState(3)

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
    useGradient,
    gradientColor1,
    gradientColor2,
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
    useGradient: boolean
    gradientColor1: string
    gradientColor2: string
  }) => {
    const sanitized = text.replace(/\n/g, ' ')
    
    // グラデーション色の計算（簡易版）
    const finalColor = useGradient ? gradientColor1 : color
    const finalBevelColor = useGradient ? gradientColor2 : bevelColor
    
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
                color: new THREE.Color(finalColor),
                metalness: metalness,
                roughness: roughness,
                emissive: new THREE.Color(emissive),
                emissiveIntensity: emissiveIntensity,
              })
              const sideMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(finalBevelColor),
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
              <ambientLight intensity={1} />
              <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
              <directionalLight position={[-5, -5, 5]} intensity={0.6} />
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
                useGradient={useGradient}
                gradientColor1={gradientColor1}
                gradientColor2={gradientColor2}
              />
              <OrbitControls enablePan enableZoom enableRotate />
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
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useGradient}
                    onChange={(e) => setUseGradient(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Use Gradient / グラデーション使用</span>
                </label>
              </div>

              {useGradient && (
                <>
                  <div>
                    <label htmlFor="gradient-color1" className="block mb-2 text-sm">
                      Gradient Color 1 / グラデーション色1
                    </label>
                    <input
                      id="gradient-color1"
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="w-full h-8 bg-white border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="gradient-color2" className="block mb-2 text-sm">
                      Gradient Color 2 / グラデーション色2
                    </label>
                    <input
                      id="gradient-color2"
                      type="color"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="w-full h-8 bg-white border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}
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
                  max="1"
                  step="0.01"
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
                      max="0.1"
                      step="0.001"
                      value={bevelThickness}
                      onChange={(e) => setBevelThickness(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">
                      Bevel Size / ベベルサイズ: {bevelSize.toFixed(3)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.1"
                      step="0.001"
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
                      min="0"
                      max="0.05"
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