'use client'

import { useRef, useEffect } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { Text } from 'troika-three-text'
import * as THREE from 'three'

extend({ Text })

interface TextMeshProps {
  text: string
  color?: string
  font?: string
  size?: number
}

export default function TextMesh({ text, color = '#ffffff', font, size = 1 }: TextMeshProps) {
  const meshRef = useRef<any>()
  const { scene } = useThree()

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.sync()
    }
  }, [text, font, size, color])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <text
      ref={meshRef}
      text={text}
      font={font || 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#000000"
    >
      <meshPhongMaterial attach="material" />
    </text>
  )
}