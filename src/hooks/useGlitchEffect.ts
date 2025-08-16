import { useRef, useCallback, useState } from 'react';
import { GlitchMode } from '../types';
import {
  loadImageToCanvas,
  applyDragGlitchEffect,
  downloadCanvasAsImage,
} from '../utils/glitchUtils';

export interface UseGlitchEffectReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageSize: { width: number; height: number } | null;
  initializeCanvas: (imageSrc: string) => Promise<void>;
  startDragGlitch: (clickY: number, splitHeight: number) => void;
  glitchImage: (distanceX: number, baseY: number, mode: GlitchMode, splitHeight: number) => void;
  applyRandomGlitch: () => void;
  applyRandomGlitchWithIntensity: (intensity: number, count: number) => void;
  applyDragGlitch: (distanceX: number, mode: GlitchMode, splitHeight: number, clickY: number) => void;
  finalizeDragGlitch: () => void;
  resetCanvas: () => void;
  downloadImage: () => void;
}


/**
 * グリッチエフェクト機能を提供するカスタムフック（ドラッグ対応版）
 */
export const useGlitchEffect = (): UseGlitchEffectReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originImageDataRef = useRef<ImageData | null>(null);
  const prevImageDataRef = useRef<ImageData | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // Canvas取得の共通関数（取得失敗時はエラーをスロー）
  const getCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Canvas element not found");
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context not available");
    }
    
    return { canvas, ctx };
  }, []);

  const initializeCanvas = useCallback(async (imageSrc: string) => {
    const { canvas, ctx } = getCanvas();

    try {
      const imageData = await loadImageToCanvas(canvas, imageSrc);
      originImageDataRef.current = imageData;
      
      // 画像サイズを設定
      setImageSize({
        width: imageData.width,
        height: imageData.height
      });
      
      // 初期状態として元画像データを前回状態にも設定
      prevImageDataRef.current = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
      );
      
      // Canvasに再描画
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
    }
  }, [getCanvas]);

  // 元実装準拠のglitchImage関数
  const glitchImage = useCallback((
    distanceX: number,
    baseY: number,
    mode: GlitchMode,
    splitHeight: number
  ) => {
    if (!prevImageDataRef.current) return;

    // distanceXが0の場合は処理をスキップ（画像情報の損失を防ぐ）
    if (distanceX === 0) return;

    const { canvas, ctx } = getCanvas();

    const prevImageData = prevImageDataRef.current;
    const cloneImageData = ctx.createImageData(prevImageData);
    const imageData = new Uint8ClampedArray(cloneImageData.data);
    const tmp = new Uint8ClampedArray(prevImageData.data);
    const width = canvas.width;

    // 元実装準拠：シンプルなコピー処理
    for (let y = 0; y < splitHeight; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const dstX = x + distanceX;

        if (dstX >= 0 && dstX < width) {
          const dstI = (y * width + dstX) * 4;
          
          // 元実装と同じ：mode に応じてコピー
          if (mode === "rgb") {
            imageData[dstI + 0] = tmp[i + 0];
            imageData[dstI + 1] = tmp[i + 1];
            imageData[dstI + 2] = tmp[i + 2];
          } else if (mode === "r") {
            imageData[dstI + 0] = tmp[i + 0];
            imageData[i + 1] = tmp[i + 1];
            imageData[i + 2] = tmp[i + 2];
          } else if (mode === "g") {
            imageData[i + 0] = tmp[i + 0];
            imageData[dstI + 1] = tmp[i + 1];
            imageData[i + 2] = tmp[i + 2];
          } else if (mode === "b") {
            imageData[i + 0] = tmp[i + 0];
            imageData[i + 1] = tmp[i + 1];
            imageData[dstI + 2] = tmp[i + 2];
          }
          
          // 元実装準拠：アルファをRGBの内容に基づいて再計算
          if (imageData[dstI + 0] || imageData[dstI + 1] || imageData[dstI + 2]) {
            imageData[dstI + 3] = 255;
          } else {
            imageData[dstI + 3] = 0;
          }

          if (imageData[i + 0] || imageData[i + 1] || imageData[i + 2]) {
            imageData[i + 3] = 255;
          } else {
            imageData[i + 3] = 0;
          }
        }
      }
    }
    
    cloneImageData.data.set(imageData);

    // 元実装と同じ位置に配置
    const y = baseY - splitHeight / 2;
    ctx.putImageData(cloneImageData, 0, y);
    
  }, [getCanvas]);

  const startDragGlitch = useCallback((clickY: number, splitHeight: number) => {
    const { canvas, ctx } = getCanvas();

    // 元実装と同じ処理：クリック位置から上にsplitHeight/2分の範囲
    const startY = clickY - splitHeight / 2;

    // 元実装と同じ：範囲限定で画像データを取得
    const rangeImageData = ctx.getImageData(0, startY, canvas.width, splitHeight);
    prevImageDataRef.current = rangeImageData;
  }, [getCanvas]);

  const applyRandomGlitch = useCallback(() => {
    if (!originImageDataRef.current) return;

    const { canvas, ctx } = getCanvas();

    const imageData = originImageDataRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // 元実装と同じ：元画像をコピー
    const cloneImageData = ctx.createImageData(imageData);
    cloneImageData.data.set(imageData.data);
    
    // 元実装と同じ：ランダムグリッチポイントを生成（3-7箇所）
    const numGlitches = Math.floor(Math.random() * 5) + 3;
    
    
    for (let g = 0; g < numGlitches; g++) {
      const y = Math.floor(Math.random() * (height - 50));
      const glitchHeight = Math.floor(Math.random() * 35) + 5; // 5-40px
      
      // 元実装と同じ：R, G, Bチャンネルごとに異なるずらし量（画像幅の-15%〜+15%）
      const shiftR = Math.floor((Math.random() - 0.5) * width * 0.3);
      const shiftG = Math.floor((Math.random() - 0.5) * width * 0.3);
      const shiftB = Math.floor((Math.random() - 0.5) * width * 0.3);
      
      // 元実装と同じ：グリッチエリアの元データを保存
      const originalData = new Uint8ClampedArray(cloneImageData.data);
      
      for (let row = y; row < Math.min(y + glitchHeight, height); row++) {
        for (let x = 0; x < width; x++) {
          const i = (row * width + x) * 4;
          
          // 元実装と同じ：Rチャンネルをずらし
          const dstXR = x + shiftR;
          if (dstXR >= 0 && dstXR < width) {
            const dstIR = (row * width + dstXR) * 4;
            cloneImageData.data[dstIR + 0] = originalData[i + 0];
          }
          
          // 元実装と同じ：Gチャンネルをずらし
          const dstXG = x + shiftG;
          if (dstXG >= 0 && dstXG < width) {
            const dstIG = (row * width + dstXG) * 4;
            cloneImageData.data[dstIG + 1] = originalData[i + 1];
          }
          
          // 元実装と同じ：Bチャンネルをずらし
          const dstXB = x + shiftB;
          if (dstXB >= 0 && dstXB < width) {
            const dstIB = (row * width + dstXB) * 4;
            cloneImageData.data[dstIB + 2] = originalData[i + 2];
          }
        }
      }
    }
    
    // 元実装準拠：アルファチャンネルをRGBの内容に基づいて再計算
    for (let i = 0; i < cloneImageData.data.length; i += 4) {
      if (
        cloneImageData.data[i + 0] ||
        cloneImageData.data[i + 1] ||
        cloneImageData.data[i + 2]
      ) {
        cloneImageData.data[i + 3] = 255;
      } else {
        cloneImageData.data[i + 3] = 0;
      }
    }
    
    ctx.putImageData(cloneImageData, 0, 0);
    
    // 元実装と同じ：現在の状態を保存
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    prevImageDataRef.current = currentImageData;
  }, [getCanvas]);

  const applyRandomGlitchWithIntensity = useCallback((intensity: number, count: number) => {
    if (!originImageDataRef.current) return;

    const { canvas, ctx } = getCanvas();

    // 強度に応じた基本設定
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    
    // 重ね掛け回数をさらに制限（最大2回まで）
    const limitedCount = Math.min(count, 2);
    
    // フラッシュパターン：20%の確率で元画像に急に戻す
    if (Math.random() < 0.2) {
      ctx.putImageData(originImageDataRef.current, 0, 0);
      prevImageDataRef.current = new ImageData(
        new Uint8ClampedArray(originImageDataRef.current.data),
        originImageDataRef.current.width,
        originImageDataRef.current.height
      );
      return;
    }
    
    // 複数回適用で重ね掛け効果
    for (let application = 0; application < limitedCount; application++) {
      const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      
      // 強度に基づいてグリッチポイント数を調整（1-3箇所にさらに減少）
      const baseGlitches = Math.floor(clampedIntensity * 2) + 1; // 1-3
      const numGlitches = baseGlitches + (Math.random() < 0.3 ? 0 : 1); // 0-1のランダム性（確率を下げる）
      
      const cloneImageData = ctx.createImageData(currentImageData);
      cloneImageData.data.set(currentImageData.data);
      
      for (let g = 0; g < numGlitches; g++) {
        // 強度に基づいてグリッチエリアの高さを調整（さらに控えめに）
        const minHeight = Math.floor(clampedIntensity * 10) + 2; // 2-12px
        const maxHeight = Math.floor(clampedIntensity * 25) + 5; // 5-30px
        const glitchHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
        
        const y = Math.floor(Math.random() * (height - glitchHeight));
        
        // 強度に基づいてずらし量を調整（画像幅の0-20%にさらに減少）
        const maxShift = clampedIntensity * width * 0.2;
        const shiftR = Math.floor((Math.random() - 0.5) * maxShift);
        const shiftG = Math.floor((Math.random() - 0.5) * maxShift);
        const shiftB = Math.floor((Math.random() - 0.5) * maxShift);
        
        const originalData = new Uint8ClampedArray(cloneImageData.data);
        
        for (let row = y; row < Math.min(y + glitchHeight, height); row++) {
          for (let x = 0; x < width; x++) {
            const i = (row * width + x) * 4;
            
            // Rチャンネルをずらし
            const dstXR = x + shiftR;
            if (dstXR >= 0 && dstXR < width) {
              const dstIR = (row * width + dstXR) * 4;
              cloneImageData.data[dstIR + 0] = originalData[i + 0];
            }
            
            // Gチャンネルをずらし
            const dstXG = x + shiftG;
            if (dstXG >= 0 && dstXG < width) {
              const dstIG = (row * width + dstXG) * 4;
              cloneImageData.data[dstIG + 1] = originalData[i + 1];
            }
            
            // Bチャンネルをずらし
            const dstXB = x + shiftB;
            if (dstXB >= 0 && dstXB < width) {
              const dstIB = (row * width + dstXB) * 4;
              cloneImageData.data[dstIB + 2] = originalData[i + 2];
            }
          }
        }
      }
      
      // アルファチャンネルをRGBの内容に基づいて再計算
      for (let i = 0; i < cloneImageData.data.length; i += 4) {
        if (
          cloneImageData.data[i + 0] ||
          cloneImageData.data[i + 1] ||
          cloneImageData.data[i + 2]
        ) {
          cloneImageData.data[i + 3] = 255;
        } else {
          cloneImageData.data[i + 3] = 0;
        }
      }
      
      ctx.putImageData(cloneImageData, 0, 0);
      
      // 各回の適用後に10%の確率で早期に元画像フラッシュ
      if (Math.random() < 0.1) {
        ctx.putImageData(originImageDataRef.current, 0, 0);
        prevImageDataRef.current = new ImageData(
          new Uint8ClampedArray(originImageDataRef.current.data),
          originImageDataRef.current.width,
          originImageDataRef.current.height
        );
        return;
      }
    }
    
    // 現在の状態を保存
    const finalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    prevImageDataRef.current = finalImageData;
  }, [getCanvas]);

  const applyDragGlitch = useCallback((
    distanceX: number,
    mode: GlitchMode,
    splitHeight: number,
    clickY: number
  ) => {
    if (!prevImageDataRef.current || !originImageDataRef.current) return;

    const { ctx } = getCanvas();

    // 元画像を復元
    ctx.putImageData(originImageDataRef.current, 0, 0);

    // 範囲限定でグリッチを適用
    const glitchedRangeData = applyDragGlitchEffect(
      prevImageDataRef.current,
      mode,
      splitHeight,
      distanceX
    );

    // グリッチした範囲データを元の位置に配置
    const startY = Math.max(0, Math.floor(clickY - splitHeight / 2));
    ctx.putImageData(glitchedRangeData, 0, startY);
    
  }, [getCanvas]);

  const finalizeDragGlitch = useCallback(() => {
    const { canvas, ctx } = getCanvas();

    // 元実装と同じ：現在のCanvas状態を保存
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    prevImageDataRef.current = currentImageData;
  }, [getCanvas]);

  const resetCanvas = useCallback(() => {
    if (!originImageDataRef.current) return;

    const { ctx } = getCanvas();

    ctx.putImageData(originImageDataRef.current, 0, 0);
    
    // リセット時は元画像を前回状態として設定
    prevImageDataRef.current = new ImageData(
      new Uint8ClampedArray(originImageDataRef.current.data),
      originImageDataRef.current.width,
      originImageDataRef.current.height
    );
  }, [getCanvas]);

  const downloadImage = useCallback(() => {
    const { canvas } = getCanvas();
    downloadCanvasAsImage(canvas);
  }, [getCanvas]);

  return {
    canvasRef,
    imageSize,
    initializeCanvas,
    startDragGlitch,
    glitchImage,
    applyRandomGlitch,
    applyRandomGlitchWithIntensity,
    applyDragGlitch,
    finalizeDragGlitch,
    resetCanvas,
    downloadImage,
  };
};