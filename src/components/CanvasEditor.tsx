import React, { useState, useCallback, useMemo } from 'react';
import { GlitchMode } from '../types';

interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onImageSelect: () => void;
  onReset: () => void;
  onRandomGlitch: () => void;
  onDownload: () => void;
  onGenerateGif: () => void;
  isGeneratingGif: boolean;
  gifProgress: number;
  splitHeight: number;
  mode: GlitchMode;
  onSplitHeightChange?: (value: number) => void; // 範囲指定用
}

export const CanvasEditor = ({
  canvasRef,
  onMouseDown,
  onImageSelect,
  onReset,
  onRandomGlitch,
  onDownload,
  onGenerateGif,
  isGeneratingGif,
  gifProgress,
  splitHeight,
  mode,
  onSplitHeightChange
}: CanvasEditorProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mouseY, setMouseY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setMouseY(y);
    
    if (isDragging) {
      setDragEnd(y);
    }
  }, [isDragging]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDragging(false);
  }, []);

  // 範囲指定のためのドラッグ操作（Shiftキー + ドラッグ）
  const handleRangeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.shiftKey && onSplitHeightChange) {
      e.preventDefault();
      e.stopPropagation();
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      
      setIsDragging(true);
      setDragStart(y);
      setDragEnd(y);
    } else {
      // 通常のグリッチ操作
      onMouseDown(e);
    }
  }, [onMouseDown, onSplitHeightChange, canvasRef]);

  const handleRangeMouseUp = useCallback(() => {
    if (isDragging && onSplitHeightChange) {
      const height = Math.abs(dragEnd - dragStart);
      if (height > 5) { // 最小5pxの範囲が必要
        onSplitHeightChange(Math.round(height));
      }
      setIsDragging(false);
    }
  }, [isDragging, dragStart, dragEnd, onSplitHeightChange]);

  // グローバルマウスアップイベント
  const handleGlobalMouseUp = useCallback(() => {
    if (isDragging) {
      handleRangeMouseUp();
    }
  }, [isDragging, handleRangeMouseUp]);

  // グローバルイベントリスナーの設定
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging, handleGlobalMouseUp]);

  // グリッチモードに応じた色設定
  const modeColors = useMemo(() => {
    switch (mode) {
      case 'r':
        return {
          border: 'border-red-500 dark:border-red-400',
          background: 'bg-red-500/20 dark:bg-red-400/20',
          line: 'bg-red-600 dark:bg-red-300',
          label: 'bg-red-600 dark:bg-red-500',
          name: 'RED'
        };
      case 'g':
        return {
          border: 'border-green-500 dark:border-green-400',
          background: 'bg-green-500/20 dark:bg-green-400/20',
          line: 'bg-green-600 dark:bg-green-300',
          label: 'bg-green-600 dark:bg-green-500',
          name: 'GREEN'
        };
      case 'b':
        return {
          border: 'border-blue-500 dark:border-blue-400',
          background: 'bg-blue-500/20 dark:bg-blue-400/20',
          line: 'bg-blue-600 dark:bg-blue-300',
          label: 'bg-blue-600 dark:bg-blue-500',
          name: 'BLUE'
        };
      case 'rgb':
        return {
          border: 'border-purple-500 dark:border-purple-400',
          background: 'bg-purple-500/20 dark:bg-purple-400/20',
          line: 'bg-purple-600 dark:bg-purple-300',
          label: 'bg-purple-600 dark:bg-purple-500',
          name: 'RGB'
        };
      default:
        return {
          border: 'border-gray-500 dark:border-gray-400',
          background: 'bg-gray-500/20 dark:bg-gray-400/20',
          line: 'bg-gray-600 dark:bg-gray-300',
          label: 'bg-gray-600 dark:bg-gray-500',
          name: 'ALL'
        };
    }
  }, [mode]);

  const overlayStyle = useMemo(() => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (isDragging) {
      // ドラッグ中は選択範囲を表示
      const startY = Math.min(dragStart, dragEnd);
      const endY = Math.max(dragStart, dragEnd);
      const height = endY - startY;
      
      return {
        startY,
        height: Math.max(height, 2),
        width: rect.width,
        mouseY: dragEnd,
        isDragging: true
      };
    } else if (isHovering) {
      // ホバー中は現在の設定範囲を表示
      const startY = Math.max(0, mouseY - splitHeight / 2);
      const endY = Math.min(rect.height, mouseY + splitHeight / 2);
      const height = endY - startY;
      
      return {
        startY,
        height,
        width: rect.width,
        mouseY,
        isDragging: false
      };
    }
    
    return null;
  }, [isHovering, mouseY, splitHeight, canvasRef, isDragging, dragStart, dragEnd]);

  const renderHoverOverlay = () => {
    if (!overlayStyle) return null;
    
    const isDragMode = overlayStyle.isDragging;
    const currentHeight = isDragMode ? Math.abs(dragEnd - dragStart) : splitHeight;
    
    return (
      <>
        {/* 範囲表示 */}
        <div
          className={`absolute pointer-events-none border-2 ${
            isDragMode 
              ? 'border-yellow-400 bg-yellow-400/30' 
              : `${modeColors.border} ${modeColors.background}`
          }`}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: overlayStyle.startY,
            width: overlayStyle.width,
            height: overlayStyle.height,
            zIndex: 10
          }}
        />
        
        {/* 中央線またはドラッグ線 */}
        <div
          className={`absolute pointer-events-none ${
            isDragMode ? 'bg-yellow-500' : modeColors.line
          }`}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: overlayStyle.mouseY - 1,
            width: overlayStyle.width,
            height: 2,
            zIndex: 11
          }}
        />
        
        {/* 情報ラベル */}
        <div
          className={`absolute pointer-events-none text-white text-xs px-2 py-1 rounded font-medium ${
            isDragMode 
              ? 'bg-yellow-600' 
              : modeColors.label
          }`}
          style={{
            left: overlayStyle.width + 8,
            top: overlayStyle.mouseY - 10,
            zIndex: 12,
            fontSize: '11px'
          }}
        >
          {isDragMode ? (
            <>範囲選択: {Math.round(currentHeight)}px</>
          ) : (
            <><span className="font-bold">{modeColors.name}</span> {splitHeight}px</>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div 
        className="relative w-full h-[300px] transparency-checkerboard"
      >
        <div className="flex items-center justify-center w-full h-full">
          <div 
            onMouseDown={handleRangeMouseDown}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleRangeMouseUp}
            className="relative cursor-crosshair"
            title="左クリック: グリッチ効果 | Shift + ドラッグ: 範囲指定"
          >
            <canvas ref={canvasRef} />
            {renderHoverOverlay()}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        <button 
          onClick={onImageSelect}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
        >
          別の画像を選択
        </button>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 rounded-lg transition-colors duration-200 font-medium"
        >
          リセット
        </button>
        <button 
          onClick={onRandomGlitch}
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 rounded-lg transition-colors duration-200 font-medium"
        >
          ランダムグリッチ
        </button>
        <button 
          onClick={onDownload}
          className="px-4 py-2 bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 rounded-lg transition-colors duration-200 font-medium"
        >
          画像をダウンロード
        </button>
        <button 
          onClick={onGenerateGif}
          disabled={isGeneratingGif}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium relative ${
            isGeneratingGif 
              ? 'bg-purple-100 border border-purple-200 text-purple-500 cursor-not-allowed'
              : 'bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-700'
          }`}
        >
          {isGeneratingGif ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              GIF生成中... {gifProgress}%
            </span>
          ) : (
            'GIFアニメーション生成'
          )}
        </button>
      </div>
      
      {/* 操作説明 */}
      <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">操作方法</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <span>• <strong>左クリック</strong>: グリッチエフェクト</span>
          <span>• <strong>Shift + ドラッグ</strong>: 範囲指定（分割高さ設定）</span>
        </div>
      </div>
    </div>
  );
};