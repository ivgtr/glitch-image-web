import { useState, useCallback } from 'react';
import { fileToBase64 } from '../utils/glitchUtils';

export interface UseImageUploadReturn {
  image: string | null;
  isDragging: boolean;
  setImage: (image: string | null) => void;
  handleImageSelect: () => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

/**
 * 画像アップロード機能を提供するカスタムフック
 */
export const useImageUpload = (): UseImageUploadReturn => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageSelect = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const file = target.files[0];
      const imageData = await fileToBase64(file);
      setImage(imageData);
    };
    input.click();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const imageData = await fileToBase64(file);
      setImage(imageData);
    }
  }, []);

  return {
    image,
    isDragging,
    setImage,
    handleImageSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
};