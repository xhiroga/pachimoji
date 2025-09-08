# CONTRIBUTING

## 開発環境構築

- pnpm

### ローカルで動かすには

```bash
pnpm run dev
open localhost:3000
```

## 開発

- Don't use `FontLoader`. It causes `FontLoader.ts:90 Uncaught TypeError: Cannot read properties of undefined (reading 'yMax')`
- フォントファイルをコミットしないでください。再配布禁止などのライセンスに違反する恐れがあります。
- コードをコミットする前に、フォーマット・リントしてください。

```sh
pnpm run format
pnpm run lint
```

## Gitについて

コミットメッセージは[Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)にゆるく従っています。日本語でも英語でもOKです。
