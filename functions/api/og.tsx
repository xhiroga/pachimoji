import React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';

export const onRequest = async ({ request }: { request: Request }) => {
  // URLパラメータを取得
  const url = new URL(request.url);
  const params = url.searchParams;
  
  // 設定を取得（デフォルト値を設定）
  const text = params.get('text') || '全国最大級';
  const color = params.get('color') || '#FFD700';
  const bevelColor = params.get('bevelColor') || '#8B4513';
  const metalness = params.get('metalness') || '1.0';
  const roughness = params.get('roughness') || '0.6';
  const emissive = params.get('emissive') || '#ffffff';
  const emissiveIntensity = params.get('emissiveIntensity') || '0';
  const selectedTexture = params.get('selectedTexture') || 'none';
  const ambientIntensity = params.get('ambientIntensity') || '1.0';
  const mainLightIntensity = params.get('mainLightIntensity') || '20.0';
  const sideLightIntensity = params.get('sideLightIntensity') || '20.0';
  const size = params.get('size') || '1';
  const height = params.get('height') || '1';
  const letterSpacing = params.get('letterSpacing') || '1.0';
  const isVertical = params.get('isVertical') === 'true';
  
  // 背景のグラデーション（メインカラーベース）
  const bgGradient = `linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, -20)} 50%, ${adjustBrightness(color, -40)} 100%)`;
  
  // テキストの配置とサイズを計算
  const displayText = text.slice(0, 8); // 最大8文字まで表示
  const fontSize = Math.max(60, Math.min(140, 1000 / displayText.length));
  
  return new ImageResponse(
    (
      <div
        style={{
          background: bgGradient,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* 背景のキラキラエフェクト */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255, 255, 255, ${parseFloat(emissiveIntensity) * 0.3}) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, ${parseFloat(emissiveIntensity) * 0.2}) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(255, 255, 255, ${parseFloat(emissiveIntensity) * 0.25}) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* メインテキスト */}
        <div
          style={{
            fontSize: fontSize,
            fontWeight: 900,
            color: 'white',
            textShadow: `
              0 0 20px ${color}80,
              0 0 40px ${bevelColor}60,
              0 4px 8px rgba(0, 0, 0, 0.4),
              0 8px 16px rgba(0, 0, 0, 0.3)
            `,
            letterSpacing: `${parseFloat(letterSpacing) * 0.05}em`,
            marginBottom: 20,
            writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
            textOrientation: isVertical ? 'upright' : 'mixed',
          }}
        >
          {displayText}
        </div>
        
        {/* メタリック効果の表示 */}
        {parseFloat(metalness) > 0.5 && (
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: 20,
              display: 'flex',
              gap: 10,
            }}
          >
            {parseFloat(metalness) > 0.8 && '✨'}
            {selectedTexture !== 'none' && '🎨'}
            {parseFloat(emissiveIntensity) > 0 && '💡'}
          </div>
        )}
        
        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
            letterSpacing: '0.05em',
          }}
        >
          pachimoji.sawara.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};

// 色の明度を調整する関数
function adjustBrightness(hex: string, percent: number): string {
  // hexをRGBに変換
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1);
}