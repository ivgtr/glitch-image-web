import GlitchImage from './components/GlitchImage'

function App() {
  return (
    <div className="min-h-screen">
      <header className="py-8 px-4 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          画像をマウスでグリッチする
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          画像にリアルタイムでグリッチエフェクトを適用できるツールです
        </p>
      </header>
      
      <main>
        <GlitchImage />
      </main>

      <footer className="mt-16 py-8 px-4 text-center border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">使い方</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                画像をアップロード
              </h3>
              <p className="text-gray-600 text-sm">
                画像をドラッグ&ドロップするか、クリックしてファイルを選択してください
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                エフェクトを適用
              </h3>
              <p className="text-gray-600 text-sm">
                画像上でマウスを動かしてリアルタイムでグリッチエフェクトを適用
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                設定を調整
              </h3>
              <p className="text-gray-600 text-sm">
                モード（R/G/B/RGB）と分割高さを調整してエフェクトをカスタマイズ
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                画像をダウンロード
              </h3>
              <p className="text-gray-600 text-sm">
                完成したグリッチ画像をPNG形式でダウンロード
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              このツールはデスクトップ環境での使用を推奨します
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App