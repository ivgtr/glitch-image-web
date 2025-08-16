import { useState, useEffect } from 'react'
import { Stage } from './Stage'
import { Form } from './Form'
import { Instructions } from './Instructions'
import { useGlitchSettings } from '../hooks/useGlitchSettings'
import { GlitchMode, SplitHeight } from '../types'

const DEFAULT_MODE: GlitchMode = "rgb";
const DEFAULT_SPLIT_HEIGHT: SplitHeight = 40;

function GlitchImage() {
  const { mode, splitHeight, updateSettings } = useGlitchSettings(
    DEFAULT_MODE,
    DEFAULT_SPLIT_HEIGHT
  );
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleSplitHeightChange = (value: number) => {
    updateSettings(mode, value);
  };

  const handleReset = () => {
    setResetTrigger(prev => prev + 1);
  };

  // モード切り替えの順序
  const modeOrder: GlitchMode[] = ['r', 'g', 'b', 'rgb'];

  const switchToNextMode = () => {
    const currentIndex = modeOrder.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modeOrder.length;
    const nextMode = modeOrder[nextIndex];
    updateSettings(nextMode, splitHeight);
  };

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // フォーカスされた要素がinput, textarea, button, select以外の場合のみ処理
      const activeElement = document.activeElement as HTMLElement;
      const isFormElement = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'BUTTON' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true'
      );

      // Shift + R でリセット（フォーム要素の制限を無視）
      if (event.key === 'R' && event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        handleReset();
        return;
      }

      // TABキーでのモード切り替え
      if (event.key === 'Tab' && !event.ctrlKey && !event.metaKey && !event.altKey && !isFormElement) {
        event.preventDefault();
        switchToNextMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, splitHeight]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Glitch Image Web
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            簡単操作で画像にグリッチエフェクトを適用
          </p>
        </div>
        
        {/* 現在のモード表示 */}
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">現在のモード</div>
          <div className={`text-lg font-bold px-3 py-1 rounded-lg border-2 ${
            mode === 'r' ? 'text-red-700 bg-red-50 border-red-200' :
            mode === 'g' ? 'text-green-700 bg-green-50 border-green-200' :
            mode === 'b' ? 'text-blue-700 bg-blue-50 border-blue-200' :
            'text-purple-700 bg-purple-50 border-purple-200'
          }`}>
            {mode === 'rgb' ? 'RGB' : mode.toUpperCase()}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            <kbd className="bg-gray-200 px-1 rounded text-[10px]">Tab</kbd> で切り替え
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stage - takes up 3 columns on large screens */}
        <section className="lg:col-span-3">
          <Stage 
            mode={mode} 
            splitHeight={splitHeight} 
            onImageSizeChange={setImageSize}
            onSplitHeightChange={handleSplitHeightChange}
            resetTrigger={resetTrigger}
          />
        </section>
        
        {/* Controls and Instructions - takes up 1 column */}
        <aside className="space-y-4">
          <Form
            defaultMode={DEFAULT_MODE}
            defaultSplitHeight={DEFAULT_SPLIT_HEIGHT}
            handleChange={updateSettings}
            imageHeight={imageSize?.height}
          />
          
          <Instructions />
        </aside>
      </main>
    </div>
  );
}

export default GlitchImage;