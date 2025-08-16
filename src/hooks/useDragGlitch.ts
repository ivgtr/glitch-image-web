import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  clickY: number; // クリック位置のCanvas内Y座標
}

export interface UseDragGlitchReturn {
  dragState: DragState;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  getDistanceX: () => number;
  getClickY: () => number;
  isDragging: () => boolean;
}

/**
 * ドラッグベースのグリッチ操作を管理するカスタムフック
 */
export const useDragGlitch = (): UseDragGlitchReturn => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    clickY: 0,
  });

  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    if (!canvas) {
      return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;
    
    // 表示サイズと内部解像度の比率を計算
    // 注意: Canvas内部は2倍幅だが、表示はベース幅
    const scaleY = canvas.height / rect.height;
    const canvasY = displayY * scaleY;


    setDragState({
      isDragging: true,
      startX: displayX,
      startY: displayY,
      currentX: displayX,
      currentY: displayY,
      clickY: canvasY,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    if (!canvas) {
      return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragState(prev => {
      if (!prev.isDragging) return prev;

      return {
        ...prev,
        currentX: x,
        currentY: y,
      };
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      isDragging: false,
    }));
  }, []);

  const getDistanceX = useCallback(() => {
    return dragStateRef.current.currentX - dragStateRef.current.startX;
  }, []);

  const getClickY = useCallback(() => {
    return dragStateRef.current.clickY;
  }, []);

  const isDragging = useCallback(() => {
    return dragStateRef.current.isDragging;
  }, []);

  return {
    dragState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getDistanceX,
    getClickY,
    isDragging,
  };
};