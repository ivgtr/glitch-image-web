import { GlitchMode } from '../types';
import { calculateCanvasSize } from '../config/canvasConfig';

/**
 * ファイルをBase64形式に変換
 */
export const fileToBase64 = (file: File): Promise<string | null> => {
  const isImageFile = file.type.startsWith("image/");
  if (!isImageFile) return Promise.resolve(null);
  
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      resolve(result);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 画像をCanvas上にロード（レスポンシブサイズ対応版）
 */
export const loadImageToCanvas = (
  canvas: HTMLCanvasElement, 
  imageSrc: string
): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      // 設定ファイルから論理的に計算されたサイズを取得
      const sizes = calculateCanvasSize(img.width, img.height);
      
      // Canvas内部解像度を設定
      canvas.width = sizes.canvasWidth;
      canvas.height = sizes.canvasHeight;
      
      // 画像をCanvas中央に配置
      ctx.drawImage(img, sizes.imageOffsetX, 0, sizes.displayWidth, sizes.displayHeight);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // シンプルな解決策：純黒(0,0,0,255)を(1,1,1,255)に置換
      // 視覚的にはほぼ変わらず、アルファ値の問題を回避
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0 && 
            imageData.data[i + 1] === 0 && 
            imageData.data[i + 2] === 0 && 
            imageData.data[i + 3] === 255) {
          imageData.data[i] = 1;
          imageData.data[i + 1] = 1;
          imageData.data[i + 2] = 1;
        }
      }
      
      // 修正したimageDataをCanvasに再描画
      ctx.putImageData(imageData, 0, 0);
      
      // Canvas全体のImageDataを返す（グリッチエフェクトで全体が使用されるため）
      resolve(imageData);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageSrc;
  });
};

/**
 * ランダムグリッチエフェクトを適用
 */
export const applyRandomGlitchEffect = (
  originImageData: ImageData,
  mode: GlitchMode,
  splitHeight: number
): ImageData => {
  const imageData = new ImageData(
    new Uint8ClampedArray(originImageData.data),
    originImageData.width,
    originImageData.height
  );

  const height = imageData.height;
  const splitCount = Math.floor(height / splitHeight);

  for (let i = 0; i < splitCount; i++) {
    const y = i * splitHeight;
    const shift = Math.floor(Math.random() * 100) - 50;
    
    applyGlitchToSegment(imageData, originImageData, y, splitHeight, shift, mode);
  }

  return imageData;
};

/**
 * マウス位置に基づくグリッチエフェクトを適用
 */
export const applyMouseGlitchEffect = (
  originImageData: ImageData,
  mode: GlitchMode,
  splitHeight: number,
  mouseX: number,
  canvasWidth: number
): ImageData => {
  const imageData = new ImageData(
    new Uint8ClampedArray(originImageData.data),
    originImageData.width,
    originImageData.height
  );

  const height = imageData.height;
  const splitCount = Math.floor(height / splitHeight);
  const shift = Math.floor((mouseX / canvasWidth) * 200) - 100;

  for (let i = 0; i < splitCount; i++) {
    const y = i * splitHeight;
    applyGlitchToSegment(imageData, originImageData, y, splitHeight, shift, mode);
  }

  return imageData;
};

/**
 * 画像セグメントにグリッチエフェクトを適用
 */
const applyGlitchToSegment = (
  targetImageData: ImageData,
  sourceImageData: ImageData,
  startY: number,
  segmentHeight: number,
  shift: number,
  mode: GlitchMode
): void => {
  const { width, height } = targetImageData;
  
  // shiftが0の場合は処理をスキップ（画像情報の損失を防ぐ）
  if (shift === 0) {
    return;
  }
  
  // 元実装準拠：シンプルな左から右ループ（読み取り元sourceと書き込み先targetが分離されているため方向別処理不要）
  for (let j = 0; j < segmentHeight && startY + j < height; j++) {
    for (let x = 0; x < width; x++) {
      const srcIndex = ((startY + j) * width + x) * 4;
      const dstIndex = ((startY + j) * width + ((x + shift + width) % width)) * 4;

      switch (mode) {
        case "r":
          // Rのみ移動：移動先に設定、移動元をクリア
          targetImageData.data[dstIndex] = sourceImageData.data[srcIndex];
          targetImageData.data[srcIndex] = 0; // 移動元のRをクリア
          break;
        case "g":
          // Gのみ移動：移動先に設定、移動元をクリア
          targetImageData.data[dstIndex + 1] = sourceImageData.data[srcIndex + 1];
          targetImageData.data[srcIndex + 1] = 0; // 移動元のGをクリア
          break;
        case "b":
          // Bのみ移動：移動先に設定、移動元をクリア
          targetImageData.data[dstIndex + 2] = sourceImageData.data[srcIndex + 2];
          targetImageData.data[srcIndex + 2] = 0; // 移動元のBをクリア
          break;
        case "rgb":
          // RGBすべて移動：移動先に設定、移動元をクリア
          targetImageData.data[dstIndex] = sourceImageData.data[srcIndex];
          targetImageData.data[dstIndex + 1] = sourceImageData.data[srcIndex + 1];
          targetImageData.data[dstIndex + 2] = sourceImageData.data[srcIndex + 2];
          targetImageData.data[srcIndex] = 0; // 移動元のRをクリア
          targetImageData.data[srcIndex + 1] = 0; // 移動元のGをクリア
          targetImageData.data[srcIndex + 2] = 0; // 移動元のBをクリア
          break;
      }
      
      // 元実装準拠：移動先のアルファをRGBの内容に基づいて再計算
      if (targetImageData.data[dstIndex] || 
          targetImageData.data[dstIndex + 1] || 
          targetImageData.data[dstIndex + 2]) {
        targetImageData.data[dstIndex + 3] = 255;
      } else {
        targetImageData.data[dstIndex + 3] = 0;
      }
      
      // 元実装準拠：移動元のアルファをRGBの内容に基づいて再計算
      if (targetImageData.data[srcIndex] || 
          targetImageData.data[srcIndex + 1] || 
          targetImageData.data[srcIndex + 2]) {
        targetImageData.data[srcIndex + 3] = 255;
      } else {
        targetImageData.data[srcIndex + 3] = 0;
      }
    }
  }
};

/**
 * Canvasの内容をダウンロード
 */
export const downloadCanvasAsImage = (
  canvas: HTMLCanvasElement, 
  filename: string = "glitch-image.png"
): void => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
};

/**
 * ドラッグ距離に基づくグリッチエフェクトを適用（範囲限定画像データ用）
 */
export const applyDragGlitchEffect = (
  rangeImageData: ImageData,
  mode: GlitchMode,
  _splitHeight: number,
  distanceX: number
): ImageData => {
  // 範囲限定の画像データを複製
  const glitchedImageData = new ImageData(
    new Uint8ClampedArray(rangeImageData.data),
    rangeImageData.width,
    rangeImageData.height
  );
  
  // ドラッグ距離を基にシフト量を計算
  const shift = Math.floor(distanceX * 0.8); // 感度調整


  // 範囲データ全体にグリッチを適用
  applyGlitchToSegment(glitchedImageData, rangeImageData, 0, rangeImageData.height, shift, mode);

  return glitchedImageData;
};

/**
 * マウス座標をCanvas座標に変換
 */
export const getCanvasCoordinates = (
  event: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  
  // 内部解像度と表示サイズの比率を計算
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
};