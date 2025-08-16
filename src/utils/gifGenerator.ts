import GIF from 'gif.js';

/**
 * GIFジェネレーターのオプション
 */
export interface GifGeneratorOptions {
  width: number;
  height: number;
  delay: number; // フレーム間の遅延（ミリ秒）
  quality: number; // 1-30の品質（低いほど高品質）
  transparent?: string; // 透明色のRGB値（"#000000" = 黒を透明にする）
  workerScript?: string; // ワーカースクリプトのパス
}

/**
 * フレームデータ
 */
export interface GifFrame {
  canvas: HTMLCanvasElement;
  delay?: number;
}

/**
 * GIFアニメーション生成クラス
 */
export class GifGenerator {
  private gif: GIF;
  private options: GifGeneratorOptions;

  constructor(options: GifGeneratorOptions) {
    this.options = options;
    this.gif = new GIF({
      workers: 2,
      quality: options.quality,
      width: options.width,
      height: options.height,
      transparent: options.transparent || "#000000", // デフォルトで黒を透明にする
      workerScript: '/gif.worker.js', // publicディレクトリに配置
    });
  }

  /**
   * フレームを追加
   */
  addFrame(canvas: HTMLCanvasElement, delay?: number): void {
    this.gif.addFrame(canvas, {
      delay: delay || this.options.delay,
      copy: true
    });
  }

  /**
   * GIFを生成してBlobとして返す
   */
  generateGif(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // GIF.jsはerrorイベントをサポートしていないため、timeoutで対応
      const timeout = setTimeout(() => {
        reject(new Error('GIF generation timeout'));
      }, 30000); // 30秒でタイムアウト

      this.gif.on('finished', (blob: Blob) => {
        clearTimeout(timeout);
        resolve(blob);
      });

      try {
        this.gif.render();
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * プログレスイベントリスナーを追加
   */
  onProgress(callback: (progress: number) => void): void {
    this.gif.on('progress', callback);
  }

  /**
   * GIF生成をリセット
   */
  reset(): void {
    this.gif.abort();
    this.gif = new GIF({
      workers: 2,
      quality: this.options.quality,
      width: this.options.width,
      height: this.options.height,
      transparent: this.options.transparent || "#000000",
      workerScript: '/gif.worker.js',
    });
  }
}

/**
 * Canvas要素をコピーして新しいCanvasを作成（透明ピクセル対応）
 */
export function cloneCanvas(originalCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const clonedCanvas = document.createElement('canvas');
  clonedCanvas.width = originalCanvas.width;
  clonedCanvas.height = originalCanvas.height;
  
  const clonedCtx = clonedCanvas.getContext('2d');
  if (clonedCtx) {
    clonedCtx.drawImage(originalCanvas, 0, 0);
    
    // 透明ピクセル（アルファ=0）を黒（RGB=0,0,0）に変換してGIFの透明色として扱う
    processTransparentPixels(clonedCtx, clonedCanvas.width, clonedCanvas.height);
  }
  
  return clonedCanvas;
}

/**
 * 透明ピクセルを黒に変換してGIFの透明色として処理
 */
function processTransparentPixels(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // アルファ値が0の場合（完全に透明）
    if (data[i + 3] === 0) {
      data[i] = 0;     // Red = 0
      data[i + 1] = 0; // Green = 0  
      data[i + 2] = 0; // Blue = 0
      data[i + 3] = 255; // Alpha = 255（GIFでは透明色として扱われる）
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Blobをダウンロード用のURLに変換してダウンロードを実行
 */
export function downloadGif(blob: Blob, filename: string = 'glitch-animation.gif'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}