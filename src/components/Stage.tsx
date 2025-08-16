import { useEffect, useState } from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import { useGlitchEffect } from "../hooks/useGlitchEffect";
import { useSimpleGlitch } from "../hooks/useSimpleGlitch";
import { useGifAnimation } from "../hooks/useGifAnimation";
import { StageProps } from "../types";
import { ImageDropZone } from "./ImageDropZone";
import { CanvasEditor } from "./CanvasEditor";
import { GifPreviewModal } from "./GifPreviewModal";

export const Stage = ({ mode, splitHeight, onImageSizeChange, onSplitHeightChange, resetTrigger }: StageProps) => {
  const { image, isDragging, handleImageSelect, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useImageUpload();
  const { canvasRef, imageSize, initializeCanvas, startDragGlitch, glitchImage, finalizeDragGlitch, resetCanvas, applyRandomGlitch, applyRandomGlitchWithIntensity, downloadImage } = useGlitchEffect();
  const { isGenerating, progress, generatedGif, generateRandomGlitchGif } = useGifAnimation();
  const [showGifModal, setShowGifModal] = useState(false);

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

  // GIF生成完了時にモーダルを表示
  useEffect(() => {
    if (generatedGif && !isGenerating) {
      setShowGifModal(true);
    }
  }, [generatedGif, isGenerating]);

  // resetTriggerの変更を監視してリセット実行
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      resetCanvas();
    }
  }, [resetTrigger, resetCanvas]);

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

  const handleCloseGifModal = () => {
    setShowGifModal(false);
  };

  const gifFilename = `dynamic-glitch-${new Date().toISOString().replace(/[:.]/g, '-')}.gif`;

  return (
    <>
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
          onSplitHeightChange={onSplitHeightChange}
        />
      )}
      </div>

      {/* GIFプレビューモーダル */}
      <GifPreviewModal
        isOpen={showGifModal}
        onClose={handleCloseGifModal}
        gifBlob={generatedGif}
        filename={gifFilename}
      />
    </>
  );
};