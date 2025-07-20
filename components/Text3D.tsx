'use client'

import { Canvas } from '@react-three/fiber'
import { Text3D, Center, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

interface Text3DProps {
  text: string
  color?: string
  size?: number
  font?: string
}

function TextContent({ text, color = "#ffffff", size = 1, font }: Text3DProps) {
  // For now, use only the working fonts to ensure 3D text renders
  const workingFont = font?.endsWith('.json') ? font : '/fonts/helvetiker_regular.typeface.json'

  return (
    <Center>
      <Text3D
        font={workingFont}
        size={size}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial color={color} />
      </Text3D>
    </Center>
  )
}

export default function Text3DComponent({ text = "3D Text", color = "#ffffff", size = 1, font = "/fonts/helvetiker_regular.typeface.json" }: Text3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <Suspense fallback={null}>
          <TextContent text={text} color={color} size={size} font={font} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}