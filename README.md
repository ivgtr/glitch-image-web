# Glitch Image Web

[tenori.me](https://github.com/ivgtr/tenori.me/blob/master/src/app/tools/glitch-image/page.tsx)の実装をベースとしたリッチ版のグリッチ画像ツールです。

## 概要

画像にグリッチエフェクトを適用する専用Webアプリケーションです。マウス操作で画像にリアルタイムでグリッチエフェクトを適用し、アーティスティックな表現を簡単に作成できます。

## 技術スタック

- **React 19** - UIフレームワーク
- **TypeScript** - 型安全な開発
- **Vite** - 高速な開発サーバーとビルドツール
- **Canvas API** - 画像処理とエフェクト適用
- **ESLint** - コード品質管理

## プロジェクト構造

```
src/
├── components/
│   └── GlitchImage.tsx  # メインのグリッチエフェクトコンポーネント
├── assets/              # 静的アセット
├── App.tsx              # メインアプリケーション
├── App.css              # アプリケーションスタイル
└── main.tsx             # エントリーポイント
```

## 開発

### 必要条件

- Node.js (推奨: 最新のLTS版)
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# リント
npm run lint

# プレビュー
npm run preview
```

## 機能

- 画像のアップロード（ドラッグ&ドロップ対応）
- マウス操作によるリアルタイムグリッチエフェクト
- エフェクト強度の調整
- 処理済み画像のダウンロード

## ブラウザサポート

PC環境での使用を推奨します。モバイル環境では一部機能が制限される場合があります。

## 参考

このプロジェクトは [ivgtr/tenori.me](https://github.com/ivgtr/tenori.me) のグリッチ画像ツールをベースに、よりリッチな機能を追加したバージョンです。
