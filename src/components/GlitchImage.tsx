import { useState } from 'react'
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

  const handleSplitHeightChange = (value: number) => {
    updateSettings(mode, value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            グリッチ画像ツール
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            画像にリアルタイムでグリッチエフェクトを適用
          </p>
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