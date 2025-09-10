"use client";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import { Canvas, useLoader } from "@react-three/fiber";
import { Text3D, Center, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { sendGAEvent } from "@/utils/analytics";

export default function Home() {
  const [text, setText] = useState("全国最大級");
  const [color, setColor] = useState("#FFD700"); // ゴールド色
  // 側面の基準色（ベベル外周など）
  const [bevelColor, setBevelColor] = useState("#8B4513");
  // ベベル各セグメントの色（bevelSegments に同期）
  const [bevelSegmentColors, setBevelSegmentColors] = useState<string[]>(
    Array.from({ length: 5 }, () => "#8B4513")
  );
  const [selectedFont, setSelectedFont] = useState(
    "https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Noto Sans JP Black_Regular.json"
  );

  // Material Effects
  const [metalness, setMetalness] = useState(1.0);
  const [roughness, setRoughness] = useState(0.6);
  

  // Lighting Controls
  // Lighting (Simple + Stable recipe)
  const [ambientIntensity, setAmbientIntensity] = useState(3.0);
  const [mainLightIntensity, setMainLightIntensity] = useState(3.0); // Key (front-left-up)
  const [sideLightIntensity, setSideLightIntensity] = useState(3.0); // Fill (front-right-down)

  // Text3D Parameters
  const [size, setSize] = useState(1);
  const [bevelEnabled, setBevelEnabled] = useState(true);
  const [bevelThickness, setBevelThickness] = useState(0.1);
  const [bevelSize, setBevelSize] = useState(0.1); // デフォルト0.1に変更
  const [bevelSegments, setBevelSegments] = useState(5);
  const [letterSpacing, setLetterSpacing] = useState(1.0);
  const [isVertical, setIsVertical] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  

  const fonts = [
    {
      name: "ゴシック（Noto Sans）- 約16,000字",
      path: "https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Noto Sans JP Black_Regular.json",
    },
    {
      name: "明朝体（装甲明朝）- 約7,900字",
      path: "https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/SoukouMincho_Regular.json",
    },
    {
      name: "筆文字（玉ねぎ楷書「激」）- 約3,800字",
      path: "https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Tamanegi Kaisho Geki FreeVer 7_Regular.json",
    },
  ];

  

  // プリセットスタイル
  const presets = [
    {
      name: "ゴールド＆ゴシック",
      text: "全国最大級",
      image: "/images/sample-gothic.png",
      settings: {
        color: "#FFD700",
        bevelColor: "#8B4513",
        selectedFont:
          "https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Noto Sans JP Black_Regular.json",
        metalness: 1,
        roughness: 0.6,
        
        ambientIntensity: 2.8,
        mainLightIntensity: 3.6,
        sideLightIntensity: 2.6,
        size: 1.0,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5,
        
        letterSpacing: 1.0,
      },
    },
    {
      name: "高級感＆明朝",
      text: "新台入替",
      image: "/images/sample-mincho.png",
      settings: {
        color: "#fff700",
        bevelColor: "#6b00b3",
        selectedFont:
          "https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/SoukouMincho_Regular.json",
        metalness: 0.8,
        roughness: 0.1,
        
        ambientIntensity: 2.4,
        mainLightIntensity: 3.0,
        sideLightIntensity: 2.2,
        size: 1.0,
        bevelEnabled: true,
        bevelThickness: 0.19,
        bevelSize: 0.06,
        bevelSegments: 8,
        
        letterSpacing: 1.0,
      },
    },
    {
      name: "激熱！筆文字",
      text: "激アツ!",
      image: "/images/sample-kaisho.png",
      settings: {
        color: "#FF0000",
        bevelColor: "#fbff24",
        selectedFont:
          "https://pub-01cc0be364304d1f99c8da9cc811ffc0.r2.dev/fonts/Tamanegi Kaisho Geki FreeVer 7_Regular.json",
        metalness: 0.8,
        roughness: 0.4,
        
        ambientIntensity: 2.0,
        mainLightIntensity: 4.0,
        sideLightIntensity: 2.5,
        size: 1.0,
        bevelEnabled: true,
        bevelThickness: 0.214,
        bevelSize: 0.1,
        bevelSegments: 7,
        
        letterSpacing: 1.0,
      },
    },
  ];

  // Canvas を PNG としてダウンロード
  const handleDownload = useCallback(() => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "pachimoji.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // Google Analytics イベント送信
    sendGAEvent("download_png", {
      event_category: "engagement",
      event_label: "pachimoji_png",
    });
  }, []);

  // プリセットを適用する関数
  const applyPreset = useCallback((preset: (typeof presets)[0]) => {
    // テキストは変更しない
    setColor(preset.settings.color);
    setBevelColor(preset.settings.bevelColor);
    // ベベルセグメント色（プリセット未指定ならベース色で埋める）
    const segCount = preset.settings.bevelSegments;
    const segColors = (preset.settings as any).bevelSegmentColors as string[] | undefined;
    setBevelSegmentColors(
      Array.from({ length: segCount }, (_, i) => (segColors?.[i] ?? preset.settings.bevelColor))
    );
    setSelectedFont(preset.settings.selectedFont);
    setMetalness(preset.settings.metalness);
    setRoughness(preset.settings.roughness);
    setAmbientIntensity(preset.settings.ambientIntensity);
    setMainLightIntensity(preset.settings.mainLightIntensity);
    setSideLightIntensity(preset.settings.sideLightIntensity);
    setSize(preset.settings.size);
    setBevelEnabled(preset.settings.bevelEnabled);
    setBevelThickness(preset.settings.bevelThickness);
    setBevelSize(preset.settings.bevelSize);
    setBevelSegments(preset.settings.bevelSegments);
    
    setLetterSpacing(preset.settings.letterSpacing);
  }, []);

  // Text3Dコンテンツのみ（Canvasの外）
  const Text3DContent = memo(
    ({
      text,
      color,
      bevelColor,
      bevelSegmentColors,
      fontPath,
      size,
      
      bevelEnabled,
      bevelThickness,
      bevelSize,
      bevelSegments,
      metalness,
      roughness,
      
      letterSpacing,
      isVertical,
    }: {
      text: string;
      color: string;
      bevelColor: string;
      bevelSegmentColors: string[];
      fontPath: string;
      size: number;
      
      bevelEnabled: boolean;
      bevelThickness: number;
      bevelSize: number;
      bevelSegments: number;
      metalness: number;
      roughness: number;
      
      letterSpacing: number;
      isVertical: boolean;
    }) => {
      const sanitized = text.replace(/\n/g, " ");
      const characters = [...sanitized]; // 文字列を1文字ずつの配列に分解

      // フォントデータを読み込み（グリフ情報を取得するため）
      const font = useLoader(FontLoader, fontPath);

      

      // 縦書き・横書きの文字位置計算
      const charPositions: number[] = [];
      let currentPos = 0;

      // フォントのユニットサイズ（通常は1000-2048程度）を推定
      // Three.jsのフォントは通常、haの値が1000単位程度で記録されている
      const fontScale = size / 1000;

      characters.forEach((_, index) => {
        if (index > 0) {
          const prevChar = characters[index - 1];
          const prevGlyph = font.data.glyphs?.[prevChar];

          if (isVertical) {
            currentPos += size * letterSpacing * 1.4;
          } else if (prevGlyph && typeof prevGlyph.ha === "number") {
            // 横書きは前の文字の水平アドバンスを適切にスケール
            const advance = prevGlyph.ha * fontScale;
            // letterSpacingは追加間隔として適用（1.0 = 基本間隔、1.25 = 基本 + 25%）
            const additionalSpacing = (letterSpacing - 1.0) * size * 0.5;
            currentPos += advance + additionalSpacing;
          } else {
            // グリフが見つからない場合はデフォルト値を使用
            currentPos += size * letterSpacing;
          }
        }
        charPositions.push(currentPos);
      });

      // 全体を中央揃えにするためのオフセット
      const totalLength = charPositions[charPositions.length - 1] || 0;
      const centerOffset = totalLength / 2;

      // 縦書きモード（ベータ版）
      // 注意：半角英数字の回転は基準点の問題で一旦保留

      return (
        <group>
          {characters.map((char, index) => {
            const posX = isVertical ? 0 : charPositions[index] - centerOffset;
            const posY = isVertical
              ? -(charPositions[index] - centerOffset)
              : 0;

            return (
              <group key={`char-${index}`} position={[posX, posY, 0]}>
                <Center>
                  <Text3D
                    font={fontPath}
                    size={size}
                    height={1.0}
                    curveSegments={12}
                    bevelEnabled={bevelEnabled}
                    bevelThickness={bevelThickness}
                    bevelSize={bevelSize}
                    bevelSegments={bevelSegments}
                    position={[0, 0, 0]}
                  >
                    {char}
                    <meshStandardMaterial
                      attach={(parent) => {
                        // フェイスもPBRで表現（キー正面＋フィルで色の再現性を確保）
                        const frontMaterial = new THREE.MeshStandardMaterial({
                          color: new THREE.Color(color),
                          metalness: metalness,
                          roughness: roughness,
                        });
                        const sideMaterial = new THREE.MeshStandardMaterial({
                          color: new THREE.Color(bevelColor),
                          metalness: metalness * 1.2,
                          roughness: roughness * 0.8,
                        });

                        // シェーダ拡張: ベベル領域をセグメント毎に色分け
                        if (bevelEnabled) sideMaterial.onBeforeCompile = (shader) => {
                          // uniforms
                          shader.uniforms.uDepth = { value: 1.0 };
                          shader.uniforms.uBevelThickness = { value: bevelThickness };
                          shader.uniforms.uBevelSegments = { value: bevelSegments };
                          const colors = bevelSegmentColors.map((hex) => new THREE.Color(hex));
                          // 最大10色まで
                          const MAX = 10;
                          const padded = Array.from({ length: MAX }, (_, i) => colors[i] ?? new THREE.Color(bevelColor));
                          shader.uniforms.uColors = { value: padded };

                          // vertex: local position/normal を伝搬
                          shader.vertexShader = shader.vertexShader
                            .replace(
                              '#include <common>',
                              `#include <common>\n varying vec3 vPos;\n varying vec3 vNrm;`
                            )
                            .replace(
                              '#include <begin_vertex>',
                              `#include <begin_vertex>\n vPos = position;\n vNrm = normalize(normal);`
                            );

                          // fragment: ベベル近傍を検出しセグメント別に色指定（法線のZ成分でベベル角度を推定）
                          shader.fragmentShader = shader.fragmentShader
                            .replace(
                              '#include <common>',
                              `#include <common>\n varying vec3 vPos;\n varying vec3 vNrm;\n uniform float uDepth;\n uniform float uBevelThickness;\n uniform int uBevelSegments;\n uniform vec3 uColors[10];`
                            )
                            .replace(
                              'vec4 diffuseColor = vec4( diffuse, opacity );',
                              `vec4 diffuseColor = vec4( diffuse, opacity );\n\n // 法線のZ成分からベベル角度を近似（±Z=面、0=側面、途中=ベベル）\n float nz = abs(vNrm.z);\n if (uBevelSegments > 0 && nz > 0.05 && nz < 0.95) {\n   float t = 1.0 - nz; // 0:面に近い, 1:側面に近い\n   float segF = floor(t * float(uBevelSegments));\n   int seg = int(clamp(segF, 0.0, float(uBevelSegments - 1)));\n   vec3 segColor = uColors[seg];\n   diffuseColor.rgb = segColor;\n }`
                            );

                          (sideMaterial as any).userData.shader = shader;
                        };

                        parent.material = [frontMaterial, sideMaterial];
                        return () => {
                          frontMaterial.dispose();
                          sideMaterial.dispose();
                        };
                      }}
                    />
                  </Text3D>
                </Center>
              </group>
            );
          })}
        </group>
      );
    }
  );

  Text3DContent.displayName = "Text3DContent";

  // 構造化データ (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "パチ文字メーカー",
    alternateName: "3D Text Maker",
    description:
      "パチンコでよく見る豪華な文字を簡単に作成できる無料のオンライン3Dツール。チラシ、ポスター、SNS投稿用の派手な文字デザインが誰でも簡単に作れます。",
    url: "https://pachimoji.sawara.dev",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    creator: {
      "@type": "Organization",
      name: "パチ文字メーカー",
    },
    featureList: [
      "3D文字作成",
      "日本語フォント対応",
      "リアルタイム編集",
      "カラーカスタマイズ",
      "マテリアル効果",
      "ライティング制御",
      "PNG書き出し",
    ],
    screenshot: "https://pachimoji.sawara.dev/og-image.png",
    softwareVersion: "1.0",
    datePublished: "2025-01-31",
    dateModified: "2025-01-31",
    inLanguage: ["ja", "en"],
    audience: {
      "@type": "Audience",
      audienceType:
        "デザイナー、チラシ制作者、SNS運用担当者、パチンコホール広報担当者",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <Image
              src="/images/logo.png"
              alt="パチ文字メーカー"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              title="ダウンロード"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v1.125A2.625 2.625 0 005.625 20.25h12.75A2.625 2.625 0 0021 17.625V16.5M7.5 9l4.5 4.5L16.5 9M12 3v10.5"
                />
              </svg>
              ダウンロード
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[400px] bg-white rounded-lg overflow-hidden border border-gray-200">
              <Canvas
                orthographic
                camera={{ position: [0, 0, 5], zoom: 100 }}
                gl={{
                  preserveDrawingBuffer: true,
                  alpha: true,
                  antialias: true,
                }}
                style={{ width: "100%", height: "100%" }}
              >
                {/* シンプルな3灯ライティング */}
                <ambientLight intensity={ambientIntensity} color="#ffffff" />

                {/* Key light: further front-left-up */}
                <directionalLight
                  position={[-6, 4, 8]}
                  intensity={mainLightIntensity}
                  color="#ffffff"
                  castShadow
                />

                {/* Fill light: further front-right-down */}
                <directionalLight
                  position={[6, -3, 6]}
                  intensity={sideLightIntensity}
                  color="#ffffff"
                />

                

                <Text3DContent
                  text={text}
                  color={color}
                  bevelColor={bevelColor}
                  bevelSegmentColors={bevelSegmentColors}
                  fontPath={selectedFont}
                  size={size}
                  bevelEnabled={bevelEnabled}
                  bevelThickness={bevelThickness}
                  bevelSize={bevelSize}
                  bevelSegments={bevelSegments}
                  metalness={metalness}
                  roughness={roughness}
                  letterSpacing={letterSpacing}
                  isVertical={isVertical}
                />
                <OrbitControls enablePan={false} enableZoom enableRotate />
              </Canvas>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
              <div>
                <label
                  htmlFor="text-input"
                  className="block mb-2 text-sm font-medium"
                >
                  テキスト / Text
                </label>
                <input
                  id="text-input"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* ダウンロードボタンはヘッダー右上へ移動 */}

              <div>
                <label
                  htmlFor="font-select"
                  className="block mb-2 text-sm font-medium"
                >
                  フォント / Font
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
                <label className="block mb-2 text-sm font-medium">
                  文字間隔 / Letter Spacing: {letterSpacing.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="2.0"
                  step="0.05"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  文字方向 / Text Direction
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsVertical(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !isVertical
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    横書き
                  </button>
                  <button
                    onClick={() => setIsVertical(true)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isVertical
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    縦書き（β）
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="color-input"
                  className="block mb-2 text-sm font-medium"
                >
                  表面色 / Face Color
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
                <label className="block mb-2 text-sm font-medium">
                  側面・ベース色 / Side Base Color
                </label>
                <input
                  type="color"
                  value={bevelColor}
                  onChange={(e) => setBevelColor(e.target.value)}
                  className="w-full h-10 bg-white border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="block mb-2 text-sm font-medium">
                  ベベル色（セグメントごと） / Bevel Segment Colors
                </div>
                {Array.from({ length: bevelSegments }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs w-20">Segment {i + 1}</span>
                    <input
                      type="color"
                      value={bevelSegmentColors[i] ?? bevelColor}
                      onChange={(e) => {
                        const next = [...bevelSegmentColors];
                        next[i] = e.target.value;
                        setBevelSegmentColors(next);
                      }}
                      className="h-8 w-14 bg-white border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* Bevel Parameters */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">縁取りの設定 / Bevel Parameters</h3>

                

                

                {/* height と curveSegments は固定化（height=1.0, curveSegments=12）*/}

                <div>
                  <label className="block mb-1 text-sm">
                    縁取りの大きさ / Bevel Size: {bevelSize.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={bevelSize}
                    onChange={(e) => setBevelSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">
                    縁取りの層 / Bevel Segments: {bevelSegments}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={bevelSegments}
                    onChange={(e) => {
                      const n = parseInt(e.target.value);
                      setBevelSegments(n);
                      setBevelSegmentColors((prev) => {
                        const next = Array.from({ length: n }, (_, i) => prev[i] ?? bevelColor);
                        return next;
                      });
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">
                    縁取りの厚さ / Bevel Thickness: {bevelThickness.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.001"
                    value={bevelThickness}
                    onChange={(e) =>
                      setBevelThickness(parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Material Effects */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">
                  マテリアル効果 / Material Effects
                </h3>

                <div>
                  <label className="block mb-1 text-sm">
                    メタリック / Metalness: {metalness.toFixed(2)}
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
                    粗さ / Roughness: {roughness.toFixed(2)}
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

                
              </div>

              {/* Lighting Controls */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">
                  ライティング制御 / Lighting Controls
                </h3>

                <div>
                  <label className="block mb-1 text-sm">
                    環境光 / Ambient Light: {ambientIntensity.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={ambientIntensity}
                    onChange={(e) =>
                      setAmbientIntensity(parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">
                    メインライト（キー） / Key: {mainLightIntensity.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={mainLightIntensity}
                    onChange={(e) =>
                      setMainLightIntensity(parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">
                    フィルライト / Fill: {sideLightIntensity.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={sideLightIntensity}
                    onChange={(e) =>
                      setSideLightIntensity(parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                
              </div>

              {/* JSON Settings */}
              <div className="space-y-4 border-t pt-4">
                <button
                  onClick={() => setIsJsonOpen(!isJsonOpen)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="font-medium">
                    設定（JSON） / Settings (JSON)
                  </h3>
                  <span className="text-lg">{isJsonOpen ? "−" : "+"}</span>
                </button>

                {isJsonOpen && (
                  <textarea
                    value={JSON.stringify(
                      {
                        text,
                        color,
                        bevelColor,
                        bevelSegmentColors,
                        selectedFont,
                        metalness,
                        roughness,
                        ambientIntensity,
                        mainLightIntensity,
                        sideLightIntensity,
                        size,
                        bevelEnabled,
                        bevelThickness,
                        bevelSize,
                        bevelSegments,
                        letterSpacing,
                        isVertical,
                      },
                      null,
                      2
                    )}
                    onChange={(e) => {
                      try {
                        const settings = JSON.parse(e.target.value);

                        // Apply settings with validation
                        if (settings.text !== undefined) setText(settings.text);
                        if (settings.color !== undefined)
                          setColor(settings.color);
                        if (settings.bevelColor !== undefined)
                          setBevelColor(settings.bevelColor);
                        if (settings.bevelSegmentColors !== undefined && Array.isArray(settings.bevelSegmentColors))
                          setBevelSegmentColors(settings.bevelSegmentColors);
                        if (settings.selectedFont !== undefined)
                          setSelectedFont(settings.selectedFont);
                        if (settings.metalness !== undefined)
                          setMetalness(settings.metalness);
                        if (settings.roughness !== undefined)
                          setRoughness(settings.roughness);
                        
                        if (settings.ambientIntensity !== undefined)
                          setAmbientIntensity(settings.ambientIntensity);
                        if (settings.mainLightIntensity !== undefined)
                          setMainLightIntensity(settings.mainLightIntensity);
                        if (settings.sideLightIntensity !== undefined)
                          setSideLightIntensity(settings.sideLightIntensity);
                        
                        if (settings.size !== undefined) setSize(settings.size);
                        if (settings.bevelEnabled !== undefined)
                          setBevelEnabled(settings.bevelEnabled);
                        if (settings.bevelThickness !== undefined)
                          setBevelThickness(settings.bevelThickness);
                        if (settings.bevelSize !== undefined)
                          setBevelSize(settings.bevelSize);
                        if (settings.bevelSegments !== undefined)
                          setBevelSegments(settings.bevelSegments);
                        
                        if (settings.letterSpacing !== undefined)
                          setLetterSpacing(settings.letterSpacing);
                        if (settings.isVertical !== undefined)
                          setIsVertical(settings.isVertical);
                        
                      } catch {
                        // Invalid JSON - ignore
                      }
                    }}
                    className="w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-xs overflow-auto resize-none focus:outline-none focus:border-blue-500"
                    spellCheck={false}
                  />
                )}
              </div>
            </div>
          </div>

          {/* プリセットスタイル */}
          <div className="mt-12 pb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              スタイルプリセット
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {presets.map((preset, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-bold mb-2">{preset.name}</h3>
                  <div className="mb-4">
                    <div className="h-32 bg-white rounded border border-gray-300 flex items-center justify-center relative overflow-hidden">
                      <Image
                        src={preset.image}
                        alt={preset.name}
                        width={200}
                        height={128}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => applyPreset(preset)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    このスタイルを使う
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* フッター */}
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
            <div
              className="mx-auto mb-4 w-full max-w-screen-lg rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700"
              role="note"
              aria-label="ライセンス情報"
            >
              <span className="font-medium">本サービスで制作した画像は</span>、
              <a href="/licenses" className="underline text-blue-600 hover:text-blue-700">ライセンス</a>
              に従う限り、商用・非商用を問わず、自由に使用・複製・改変・頒布・公開できます。
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Made by</span>
              <a
                href="https://sawara.dev"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Google Analytics イベント送信
                  sendGAEvent("sawara_dog_link_click", {
                    event_category: "engagement",
                    event_label: "footer_link",
                  });
                }}
              >
                <video
                  ref={(video) => {
                    if (video) {
                      // ページ読み込み時に1回再生
                      const playOnLoad = () => {
                        video.currentTime = 0;
                        video.play();
                      };

                      // 少し遅延してから再生（フォントなどの読み込みを待つ）
                      setTimeout(playOnLoad, 1000);

                      // 動画が終わったら停止
                      video.onended = () => {
                        video.pause();
                      };
                    }
                  }}
                  className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  muted
                  playsInline
                >
                  <source src="/images/logo.mp4" type="video/mp4" />
                </video>
              </a>
              <span>on</span>
              <a
                href="https://github.com/xhiroga/pachimoji"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                onClick={() => {
                  // Google Analytics イベント送信
                  sendGAEvent("github_link_click", {
                    event_category: "engagement",
                    event_label: "footer_github_link",
                  });
                }}
              >
                <Image
                  src="/images/github-mark.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="inline-block"
                />
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
