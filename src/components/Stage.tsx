import { useEffect } from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import { useGlitchEffect } from "../hooks/useGlitchEffect";
import { useSimpleGlitch } from "../hooks/useSimpleGlitch";
import { useGifAnimation } from "../hooks/useGifAnimation";
import { StageProps } from "../types";
import { ImageDropZone } from "./ImageDropZone";
import { CanvasEditor } from "./CanvasEditor";

export const Stage = ({ mode, splitHeight, onImageSizeChange }: StageProps) => {
  const { image, isDragging, handleImageSelect, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useImageUpload();
  const { canvasRef, imageSize, initializeCanvas, startDragGlitch, glitchImage, finalizeDragGlitch, resetCanvas, applyRandomGlitch, applyRandomGlitchWithIntensity, downloadImage } = useGlitchEffect();
  const { isGenerating, progress, generateRandomGlitchGif } = useGifAnimation();

  useEffect(() => {
    if (image) {
      initializeCanvas(image);
    }
  }, [image, initializeCanvas]);

  useEffect(() => {
    if (imageSize && onImageSizeChange) {
      onImageSizeChange(imageSize);
    }
  }, [imageSize, onImageSizeChange]);

  // 元実装準拠のグローバルイベント管理
  const { baseY, handleMouseDown } = useSimpleGlitch(
    (distanceX: number) => {
      // グローバルマウス移動時の処理
      glitchImage(distanceX, baseY, mode, splitHeight);
    },
    () => {
      // グローバルマウスアップ時の処理
      finalizeDragGlitch();
    }
  );

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 元実装と同じ座標計算
    const canvas = canvasRef.current;
    if (!canvas) return;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    
    
    // 範囲限定画像データの保存（元実装準拠）
    startDragGlitch(y, splitHeight);
    
    // グローバルイベント管理を開始
    handleMouseDown(e, y);
  };


  const handleRandomGlitch = () => {
    applyRandomGlitch();
  };

  const handleGenerateGif = () => {
    generateRandomGlitchGif(canvasRef, applyRandomGlitch, applyRandomGlitchWithIntensity, resetCanvas);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {!image ? (
        <ImageDropZone
          isDragging={isDragging}
          onImageSelect={handleImageSelect}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ) : (
        <CanvasEditor
          canvasRef={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onImageSelect={handleImageSelect}
          onReset={resetCanvas}
          onRandomGlitch={handleRandomGlitch}
          onDownload={downloadImage}
          onGenerateGif={handleGenerateGif}
          isGeneratingGif={isGenerating}
          gifProgress={progress}
          splitHeight={splitHeight}
          mode={mode}
        />
      )}
    </div>
  );
};