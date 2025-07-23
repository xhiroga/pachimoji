/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { Text3D, Center, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - three provides the declaration but path resolution may fail without .js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

interface Text3DProps {
  text: string
  color?: string
  size?: number
  font?: string
  outlineWidth?: number
  outlineColor?: string
}

function TextContent({
  text, 
  color = "#ffffff", 
  size = 1, 
  font = "/fonts/helvetiker_regular.typeface.json",
  outlineWidth = 0.05,
  outlineColor = "#000000"
}: Text3DProps) {

  return (
    <Center>
      <Text3D
        font={font}
        size={size}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.02}
      >
        {text}
        <meshStandardMaterial color={color} />
      </Text3D>
    </Center>
  )
}

export default function Text3DComponent({ 
  text = "3D Text", 
  color = "#ffffff", 
  size = 1, 
  font = "/fonts/helvetiker_regular.typeface.json",
  outlineWidth = 0.05,
  outlineColor = "#000000"
}: Text3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* 背景色を白に設定 */}
        <color attach="background" args={["#ffffff"]} />
        {/* 全体を明るくするためにライト構成を強化 */}
        <ambientLight intensity={1} />
        {/* キーライト */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
        />
        {/* 補助ライト */}
        <directionalLight
          position={[-5, -5, 5]}
          intensity={0.6}
        />
        {/* 柔らかい空からの光 */}
        <hemisphereLight
          intensity={0.5}
          color={0xffffff}
          groundColor={0x444444}
        />
        <Suspense fallback={null}>
          <TextContent 
            text={text} 
            color={color} 
            size={size} 
            font={font}
            outlineWidth={outlineWidth}
            outlineColor={outlineColor}
          />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}