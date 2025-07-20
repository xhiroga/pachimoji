'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Text3D = dynamic(() => import('@/components/Text3D'), { ssr: false })

export default function Home() {
  const [text, setText] = useState('3D Text')
  const [color, setColor] = useState('#ffffff')

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Text Editor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-gray-800 rounded-lg overflow-hidden">
            <Text3D text={text} color={color} />
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="text-input" className="block mb-2 text-sm font-medium">
                Text
              </label>
              <input
                id="text-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your text"
              />
            </div>
            
            <div>
              <label htmlFor="color-input" className="block mb-2 text-sm font-medium">
                Color
              </label>
              <input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}