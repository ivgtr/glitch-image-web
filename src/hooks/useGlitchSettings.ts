import { useState, useCallback } from 'react';
import { GlitchMode, SplitHeight } from '../types';

export interface UseGlitchSettingsReturn {
  mode: GlitchMode;
  splitHeight: SplitHeight;
  updateSettings: (mode: GlitchMode, splitHeight: SplitHeight) => void;
}

/**
 * グリッチ設定管理を提供するカスタムフック
 */
export const useGlitchSettings = (
  defaultMode: GlitchMode = "rgb",
  defaultSplitHeight: SplitHeight = 40
): UseGlitchSettingsReturn => {
  const [mode, setMode] = useState<GlitchMode>(defaultMode);
  const [splitHeight, setSplitHeight] = useState<SplitHeight>(defaultSplitHeight);

  const updateSettings = useCallback((newMode: GlitchMode, newSplitHeight: SplitHeight) => {
    setMode(newMode);
    setSplitHeight(newSplitHeight);
  }, []);

  return {
    mode,
    splitHeight,
    updateSettings,
  };
};