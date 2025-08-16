# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# コードリント（必須チェック）
npm run lint

# ビルド済みファイルのプレビュー
npm run preview
```

## プロジェクト概要

グリッチ画像ツール専用のReact Webアプリケーション。[tenori.me](https://github.com/ivgtr/tenori.me/blob/master/src/app/tools/glitch-image/page.tsx)の実装をベースとしたリッチ版。

画像にリアルタイムでグリッチエフェクトを適用し、アーティスティックな表現を作成するツール。マウス操作で画像にエフェクトを適用し、処理済み画像をダウンロード可能。

### 技術スタック
- React 19 + TypeScript
- Vite（開発サーバー・ビルドツール）
- Canvas API（画像処理とエフェクト適用の中核）
- FileReader API（画像アップロード処理）

## アーキテクチャ

### 単一目的設計
- **単一画面構成**: App.tsxでグリッチツール機能を直接統合
- **専用コンポーネント**: GlitchImageコンポーネントがメイン機能を担当
- **シンプルな構造**: ページ分割やルーティングなし

### ファイル構成の原則
```
src/
├── components/GlitchImage.tsx  # メイン機能コンポーネント
├── App.tsx                     # アプリケーション統合
└── App.css                     # スタイル
```

### 状態管理パターン
- **ローカル状態**: React hooksによるシンプルな状態管理
- **Canvas操作**: useRefによるDOMアクセス
- **ファイル処理**: FileReader APIでの画像読み込み

## 実装時の注意点

### Canvas API使用
- GlitchImageコンポーネントでCanvas要素を管理
- 画像読み込み後にCanvas描画が必要
- マウス操作でのリアルタイムエフェクト処理が未実装（現在は基本UI のみ）

### 現在の実装状況
- **完了**: 画像アップロード、基本UI、ファイル選択
- **未実装**: グリッチエフェクト処理、Canvas描画、マウスイベント、画像ダウンロード

### PC環境特化
- マウス操作前提の設計
- モバイル環境では機能制限あり
- Canvas操作はPC環境で最適化

### 開発時の必須チェック
- TypeScript型チェック（`npm run build`で確認）
- ESLintチェック通過が必須（`npm run lint`）
- 画像処理ロジック追加時はパフォーマンス考慮

## 開発ガイドライン

### 基本方針
- **日本語対応**: 日本語でユーザーとのやりとりを行う
- **段階的開発**: 作業項目が多い場合は段階に区切り、git commitを行いながら進める
- **semantic commit**: conventional commitsの使用（feat:, fix:, docs: など）
- **作業説明**: 作業後は作業内容と次のアクションを説明

### 実装進行の原則
- ユーザーに質問を行い要求を明確化
- 大きな機能は小さな単位に分割してコミット
- コマンド出力の確認を徹底
- 勝手にローカルサーバーを起動しないで
- 指示された以上の行動はしないで（考察は可能）
- 指示するまでコミットしないで