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
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          グリッチ画像ツール
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          画像にリアルタイムでグリッチエフェクトを適用
        </p>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stage - takes up 2 columns on large screens */}
        <section className="lg:col-span-2">
          <Stage 
            mode={mode} 
            splitHeight={splitHeight} 
            onImageSizeChange={setImageSize}
            onSplitHeightChange={handleSplitHeightChange}
          />
        </section>
        
        {/* Controls and Instructions - takes up 1 column */}
        <aside className="space-y-6">
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