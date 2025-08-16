import GlitchImage from './components/GlitchImage'

function App() {
  return (
    <div className="min-h-screen">
      <main>
        <GlitchImage />
      </main>

      <footer className="mt-12 py-6 px-4 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          グリッチ画像ツール - リアルタイム画像エフェクトツール
        </p>
      </footer>
    </div>
  )
}

export default App