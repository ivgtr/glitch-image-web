import { useState, useCallback } from 'react';
import { GifGenerator, cloneCanvas } from '../utils/gifGenerator';
import { 
  generateAnimationSequence, 
  getDelayTime, 
  FrameType, 
  type AnimationFrame 
} from '../utils/animationSequence';

export interface UseGifAnimationReturn {
  isGenerating: boolean;
  progress: number;
  generatedGif: Blob | null;
  generateRandomGlitchGif: (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    applyRandomGlitch: () => void,
    applyRandomGlitchWithIntensity: (intensity: number, count: number) => void,
    resetCanvas: () => void,
    frameCount?: number
  ) => Promise<void>;
}

/**
 * GIFアニメーション生成を管理するカスタムフック
 */
export const useGifAnimation = (): UseGifAnimationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedGif, setGeneratedGif] = useState<Blob | null>(null);

  const generateRandomGlitchGif = useCallback(async (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    applyRandomGlitch: () => void,
    applyRandomGlitchWithIntensity: (intensity: number, count: number) => void,
    resetCanvas: () => void,
    frameCount: number = 50
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      // 気持ちの良いアニメーションシーケンスを生成
      const animationSequence = generateAnimationSequence(frameCount);

      // GIFジェネレーターを初期化（デフォルト遅延は使用しない）
      const gifGenerator = new GifGenerator({
        width: canvas.width,
        height: canvas.height,
        delay: 500, // 実際にはフレームごとに個別設定
        quality: 10,
        transparent: "#000000"
      });

      // プログレス監視
      gifGenerator.onProgress((progressValue: number) => {
        // GIF生成は50%〜100%の範囲
        setProgress(Math.round(50 + progressValue * 50));
      });

      // シーケンスに従ってフレームを生成
      for (let i = 0; i < animationSequence.length; i++) {
        const frame = animationSequence[i];
        const frameDelay = getDelayTime(frame.delay);
        
        // フレームタイプに応じた処理
        await processAnimationFrame(
          frame, 
          resetCanvas, 
          applyRandomGlitch, 
          applyRandomGlitchWithIntensity
        );
        
        // 描画完了を待つ
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // フレームを追加（個別の遅延時間を設定）
        gifGenerator.addFrame(cloneCanvas(canvas), frameDelay);
        
        // 準備段階の進行状況更新（0%〜50%）
        const preparationProgress = ((i + 1) / animationSequence.length) * 50;
        setProgress(Math.round(preparationProgress));
      }

      // GIFを生成
      const blob = await gifGenerator.generateGif();
      
      // 生成されたGIFを状態に保存
      setGeneratedGif(blob);

      setProgress(100);
      
    } catch (error) {
      console.error('GIF generation failed:', error);
      alert('GIF生成中にエラーが発生しました。');
    } finally {
      setIsGenerating(false);
      // 進行状況をリセット
      setTimeout(() => setProgress(0), 2000);
    }
  }, [isGenerating]);

  /**
   * アニメーションフレームを処理
   */
  const processAnimationFrame = async (
    frame: AnimationFrame,
    resetCanvas: () => void,
    applyRandomGlitch: () => void,
    applyRandomGlitchWithIntensity: (intensity: number, count: number) => void
  ): Promise<void> => {
    switch (frame.type) {
      case FrameType.ORIGINAL:
        resetCanvas();
        break;
        
      case FrameType.LIGHT_GLITCH:
        applyRandomGlitchWithIntensity(frame.intensity, frame.glitchCount);
        break;
        
      case FrameType.MEDIUM_GLITCH:
        applyRandomGlitchWithIntensity(frame.intensity, frame.glitchCount);
        break;
        
      case FrameType.HEAVY_GLITCH:
        applyRandomGlitchWithIntensity(frame.intensity, frame.glitchCount);
        break;
        
      case FrameType.BUILDUP:
        // ビルドアップは段階的にグリッチを適用
        for (let step = 0; step < frame.glitchCount; step++) {
          const stepIntensity = (frame.intensity * (step + 1)) / frame.glitchCount;
          applyRandomGlitchWithIntensity(stepIntensity, 1);
          await new Promise(resolve => setTimeout(resolve, 20));
        }
        break;
        
      case FrameType.RELEASE:
        // リリースは徐々に元画像に戻る
        resetCanvas();
        break;
        
      default:
        // フォールバック：標準のランダムグリッチ
        applyRandomGlitch();
        break;
    }
  };

  return {
    isGenerating,
    progress,
    generatedGif,
    generateRandomGlitchGif,
  };
};