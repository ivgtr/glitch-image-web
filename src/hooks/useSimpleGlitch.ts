import { useState, useCallback, useEffect } from 'react';

export interface UseSimpleGlitchReturn {
  isMouseDown: boolean;
  baseX: number;
  baseY: number;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>, canvasY: number) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
}

/**
 * 元実装準拠のシンプルなグリッチ操作管理
 */
export const useSimpleGlitch = (
  onMove?: (distanceX: number) => void,
  onUp?: () => void
): UseSimpleGlitchReturn => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [baseX, setBaseX] = useState(0);
  const [baseY, setBaseY] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isMouseDown) return;
    const distanceX = e.clientX - baseX;
    
    if (onMove) {
      onMove(distanceX);
    }
  }, [isMouseDown, baseX, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setBaseX(0);
    setBaseY(0);
    
    if (onUp) {
      onUp();
    }

    // イベントリスナーを削除
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, onUp]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, canvasY: number) => {
    setIsMouseDown(true);
    setBaseX(e.clientX);
    setBaseY(canvasY);
  }, []);

  // グローバルイベントリスナーの管理（元実装と同じ）
  useEffect(() => {
    if (isMouseDown) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMouseDown, handleMouseMove, handleMouseUp]);

  return {
    isMouseDown,
    baseX,
    baseY,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};