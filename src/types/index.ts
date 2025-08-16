// グリッチエフェクトのモード
export type GlitchMode = "r" | "g" | "b" | "rgb";

// 分割高さの型
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
}

export interface FormProps {
  defaultMode: GlitchMode;
  defaultSplitHeight: SplitHeight;
  handleChange: (mode: GlitchMode, splitHeight: SplitHeight) => void;
}