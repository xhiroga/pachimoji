import { Metadata } from "next";
import PachimojiEditor from "@/components/PachimojiEditor";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // URLパラメータから設定を取得
  const text = typeof searchParams.text === 'string' ? searchParams.text : '全国最大級';
  const color = typeof searchParams.color === 'string' ? searchParams.color : '#FFD700';
  const bevelColor = typeof searchParams.bevelColor === 'string' ? searchParams.bevelColor : '#8B4513';
  const metalness = typeof searchParams.metalness === 'string' ? searchParams.metalness : '1.0';
  const roughness = typeof searchParams.roughness === 'string' ? searchParams.roughness : '0.6';
  const emissive = typeof searchParams.emissive === 'string' ? searchParams.emissive : '#ffffff';
  const emissiveIntensity = typeof searchParams.emissiveIntensity === 'string' ? searchParams.emissiveIntensity : '0';
  const selectedTexture = typeof searchParams.selectedTexture === 'string' ? searchParams.selectedTexture : 'none';
  const letterSpacing = typeof searchParams.letterSpacing === 'string' ? searchParams.letterSpacing : '1.0';
  const isVertical = searchParams.isVertical === 'true';

  // OGP画像のURLを構築
  const ogImageParams = new URLSearchParams({
    text,
    color,
    bevelColor,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
    selectedTexture,
    letterSpacing,
    isVertical: isVertical.toString(),
  });

  const ogImageUrl = `/api/og?${ogImageParams.toString()}`;
  const title = text ? `${text} | パチ文字メーカー` : 'パチ文字メーカー | 3D文字作成ツール';
  const description = `「${text}」をパチンコ風の豪華な3D文字に変換。無料のオンラインツールで簡単作成！`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${text} - パチ文字メーカー`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  return <PachimojiEditor />;
}