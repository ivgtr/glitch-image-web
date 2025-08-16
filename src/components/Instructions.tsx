export const Instructions = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        使い方
      </h3>
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          画像をアップロード（ドラッグ&ドロップまたはクリック）
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          マウスを画像上で動かしてリアルタイムエフェクトを適用
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          モード（R/G/B/RGB）で適用するカラーチャンネルを選択
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          分割高さでグリッチの粗さを調整
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          「ランダムグリッチ」でランダムなエフェクトを適用
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          「画像をダウンロード」で結果を保存
        </li>
      </ul>
    </div>
  );
};