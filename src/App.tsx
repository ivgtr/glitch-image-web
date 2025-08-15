import GlitchImage from './components/GlitchImage'
import './App.css'

function App() {
  return (
    <div className="App">
      <header style={{ padding: '2rem 1rem 1rem', textAlign: 'center' }}>
        <h1>画像をマウスでグリッチする</h1>
        <p>画像にリアルタイムでグリッチエフェクトを適用できるツールです</p>
      </header>
      
      <main>
        <GlitchImage />
      </main>

      <footer style={{ padding: '2rem 1rem', textAlign: 'center', borderTop: '1px solid #ccc', marginTop: '2rem' }}>
        <div>
          <h2>使い方</h2>
          <ul style={{ listStyle: 'none', padding: 0, maxWidth: '600px', margin: '0 auto' }}>
            <li>• 画像をアップロードまたはドラッグ&ドロップで読み込み</li>
            <li>• 画像上でマウスを動かしてグリッチエフェクトを適用</li>
            <li>• エフェクトの強度を調整</li>
            <li>• 完成した画像をダウンロード</li>
          </ul>
          <p style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666' }}>
            ※このツールはPC環境での使用を推奨します
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
