# CloudFlare Pages Deployment Guide

## 概要
この3DテキストエディタアプリをCloudFlare Pagesにデプロイする手順です。

## 前提条件
- GitHubアカウント
- CloudFlareアカウント
- リポジトリがGitHubにプッシュされていること

## デプロイ手順

### 1. 静的ビルドの準備
```bash
# 依存関係のインストール
pnpm install

# 静的ビルドの実行
pnpm run build
```

### 2. CloudFlare Pagesでのセットアップ

1. **CloudFlare Dashboard**にログイン
2. **Pages**セクションに移動
3. **Create a project**をクリック
4. **Connect to Git**を選択
5. GitHubリポジトリを選択（3dtext）

### 3. ビルド設定

**Build Configuration:**
- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `pnpm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

**Environment Variables:**
- `NODE_VERSION`: `18` または `20`
- `PNPM_VERSION`: `8.15.6` (または最新)

### 4. 高度な設定

**next.config.ts の設定は既に完了:**
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

## 自動デプロイ

GitHubにプッシュすると自動的にCloudFlare Pagesにデプロイされます：

```bash
git add .
git commit -m "feat: ready for cloudflare deployment"
git push origin main
```

## カスタムドメイン（オプション）

1. CloudFlare Pagesの設定で**Custom domains**に移動
2. 独自ドメインを追加
3. DNS設定を更新

## トラブルシューティング

### ビルドエラーが発生した場合
```bash
# ローカルでビルドテスト
pnpm run build

# distディレクトリの確認
ls -la dist/
```

### フォント読み込みエラー
- Google Fontsを使用しているため、外部リソースへのアクセスが必要
- CloudFlare Pagesは外部リソースアクセスをサポート

## 完成予定URL
`https://your-project-name.pages.dev`

## 注意点
- Three.jsを使用しているため、初回読み込み時間が若干長い場合があります
- WebGL対応ブラウザが必要です
- 日本語フォントの読み込みに時間がかかる場合があります