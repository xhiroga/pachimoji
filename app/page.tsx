'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Text3D = dynamic(() => import('@/components/Text3D'), { ssr: false })

export default function Home() {
  const [text, setText] = useState('hi')
  const [color, setColor] = useState('#ffffff')
  const [selectedFont, setSelectedFont] = useState('/fonts/helvetiker_regular.typeface.json')
  const [outlineWidth, setOutlineWidth] = useState(0.05)
  const [outlineColor, setOutlineColor] = useState('#000000')

  const fonts = [
    { name: 'Helvetiker (標準)', path: '/fonts/helvetiker_regular.typeface.json' },
    // { name: 'Noto Sans JP ExtraBold (ローカル JSON)', path: '/fonts/Noto_Sans_JP_ExtraBold_Regular.json' },
    { name: 'Noto Sans JP (日本語)', path: '/fonts/Noto Sans JP Black_Regular.json' },
    { name: 'Roboto', path: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2' },
    { name: 'Open Sans', path: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2' },
    { name: 'Montserrat', path: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2' },
    { name: 'Poppins', path: 'https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Text Editor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-gray-800 rounded-lg overflow-hidden">
            <Text3D 
              text={text} 
              color={color} 
              font={selectedFont}
              outlineWidth={outlineWidth}
              outlineColor={outlineColor}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="text-input" className="block mb-2 text-sm font-medium">
                Text / テキスト
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
              <label htmlFor="font-select" className="block mb-2 text-sm font-medium">
                Font / フォント
              </label>
              <select
                id="font-select"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
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
                Color / 色
              </label>
              <input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
            
            <div>
              <label htmlFor="outline-width" className="block mb-2 text-sm font-medium">
                Outline Width / 縁取り幅
              </label>
              <input
                id="outline-width"
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                value={outlineWidth}
                onChange={(e) => setOutlineWidth(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{outlineWidth.toFixed(2)}</span>
            </div>
            
            <div>
              <label htmlFor="outline-color" className="block mb-2 text-sm font-medium">
                Outline Color / 縁取り色
              </label>
              <input
                id="outline-color"
                type="color"
                value={outlineColor}
                onChange={(e) => setOutlineColor(e.target.value)}
                className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}