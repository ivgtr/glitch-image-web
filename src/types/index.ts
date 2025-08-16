// グリッチエフェクトのモード
export type GlitchMode = "r" | "g" | "b" | "rgb";

// 分割高さの設定モード
export type SplitHeightMode = 'percentage' | 'fixed' | 'full';

// 分割高さの設定
export interface SplitHeightConfig {
  mode: SplitHeightMode;
  value: number; // パーセンテージ(0-100)またはピクセル値
}

// 後方互換性のため
export type SplitHeight = number;

// グリッチエフェクトの設定
export interface GlitchSettings {
  mode: GlitchMode;
  splitHeight: SplitHeight;
}

// 画像データの型
export interface ImageData {
  src: string;
  width: number;
  height: number;
}

// ドラッグ&ドロップの状態
export interface DragState {
  isDragging: boolean;
}

// Canvas操作の結果
export interface CanvasResult {
  success: boolean;
  error?: string;
}

// ファイルアップロードのコールバック型
export type FileUploadHandler = (file: File) => Promise<string | null>;

// グリッチエフェクトの適用結果
export interface GlitchEffectResult {
  imageData: ImageData;
  appliedAt: number;
}

// イベントハンドラーの型
export interface EventHandlers {
  onImageSelect: () => void;
  onImageReset: () => void;
  onImageDownload: () => void;
  onRandomGlitch: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

// コンポーネントのProps型
export interface StageProps {
  mode: GlitchMode;
  splitHeight: SplitHeight;
  onImageSizeChange?: (imageSize: { width: number; height: number }) => void;
}

export interface FormProps {
  defaultMode: GlitchMode;
  defaultSplitHeight: SplitHeight;
  handleChange: (mode: GlitchMode, splitHeight: SplitHeight) => void;
  imageHeight?: number;
}