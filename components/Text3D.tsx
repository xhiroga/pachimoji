'use client'

import { Canvas } from '@react-three/fiber'
import { Text, Center, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

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
  font,
  outlineWidth = 0.05,
  outlineColor = "#000000"
}: Text3DProps) {
  return (
    <Center>
      <Text
        font={font}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={outlineWidth}
        outlineColor={outlineColor}
        maxWidth={20}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
      >
        {text}
        <meshStandardMaterial />
      </Text>
    </Center>
  )
}

export default function Text3DComponent({ 
  text = "3D Text", 
  color = "#ffffff", 
  size = 1, 
  font,
  outlineWidth = 0.05,
  outlineColor = "#000000"
}: Text3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
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