import { useState, useCallback, useMemo } from 'react';
import { GlitchMode } from '../types';

interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onImageSelect: () => void;
  onReset: () => void;
  onRandomGlitch: () => void;
  onDownload: () => void;
  splitHeight: number;
  mode: GlitchMode;
}

export const CanvasEditor = ({
  canvasRef,
  onMouseDown,
  onImageSelect,
  onReset,
  onRandomGlitch,
  onDownload,
  splitHeight,
  mode
}: CanvasEditorProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setMouseY(y);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

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
    if (!isHovering || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // 分割高さ範囲の計算
    const startY = Math.max(0, mouseY - splitHeight / 2);
    const endY = Math.min(rect.height, mouseY + splitHeight / 2);
    const height = endY - startY;
    
    return {
      startY,
      height,
      width: rect.width,
      mouseY
    };
  }, [isHovering, mouseY, splitHeight, canvasRef]);

  const renderHoverOverlay = () => {
    if (!overlayStyle) return null;
    
    return (
      <>
        {/* グリッチモード対応のホバー範囲表示 */}
        <div
          className={`absolute pointer-events-none border ${modeColors.border} ${modeColors.background}`}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: overlayStyle.startY,
            width: overlayStyle.width,
            height: overlayStyle.height,
            zIndex: 10
          }}
        />
        
        {/* 中央線（マウス位置） */}
        <div
          className={`absolute pointer-events-none ${modeColors.line}`}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: overlayStyle.mouseY - 1,
            width: overlayStyle.width,
            height: 2,
            zIndex: 11
          }}
        />
        
        {/* モード対応の情報ラベル */}
        <div
          className={`absolute pointer-events-none ${modeColors.label} text-white text-xs px-2 py-1 rounded font-medium`}
          style={{
            left: overlayStyle.width + 8,
            top: overlayStyle.mouseY - 10,
            zIndex: 12,
            fontSize: '11px'
          }}
        >
          <span className="font-bold">{modeColors.name}</span> {splitHeight}px
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full h-[300px] bg-slate-200 dark:bg-slate-800">
        <div className="flex items-center justify-center w-full h-full">
          <div 
            onMouseDown={onMouseDown}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
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
      </div>
      
    </div>
  );
};