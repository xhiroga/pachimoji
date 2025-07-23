'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const Text3D = dynamic(() => import('@/components/Text3D'), { ssr: false })

export default function Home() {
  const [text, setText] = useState('全国最大級')
  const [color, setColor] = useState('#ffffff')
  const [selectedFont, setSelectedFont] = useState('/fonts/Noto Sans JP Black_Regular.json')
  const [outlineWidth, setOutlineWidth] = useState(0.05)
  const [outlineColor, setOutlineColor] = useState('#000000')

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Text Editor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-white rounded-lg overflow-hidden border border-gray-200">
            <Text3D 
              text={text} 
              color={color} 
              font={selectedFont}
              outlineWidth={outlineWidth}
              outlineColor={outlineColor}
            />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="text-input" className="block mb-2 text-sm font-medium">
                Text / テキスト
              </label>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                PNG ダウンロード
              </button>
            </div>
            
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
                Color / 色
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
                className="w-full h-10 bg-white border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}