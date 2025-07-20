'use client'

import { Canvas } from '@react-three/fiber'
import { Text3D, Center, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

interface Text3DProps {
  text: string
  color?: string
  size?: number
}

export default function Text3DComponent({ text = "3D Text", color = "#ffffff", size = 1 }: Text3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Center>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={size}
              height={0.5}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              {text}
              <meshNormalMaterial />
            </Text3D>
          </Center>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}