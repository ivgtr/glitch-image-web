export const Instructions = () => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        使い方・推奨環境
      </h3>
      
      {/* 推奨環境 */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="text-xs font-medium text-blue-700 mb-2">推奨環境</div>
        <div className="text-xs text-blue-600 space-y-1">
          <div>• <strong>画面幅</strong>: 810px以上（PC）</div>
          <div>• <strong>ブラウザ</strong>: Chrome, Firefox, Safari, Edge（最新版）</div>
          <div>• <strong>操作</strong>: マウス・トラックパッド推奨</div>
        </div>
      </div>

      {/* 基本操作 */}
      <div className="text-xs font-medium text-gray-700 mb-2">基本操作</div>
      <ul className="space-y-2 text-xs text-gray-600">
        <li>• 画像をアップロード</li>
        <li>• マウス操作でエフェクト適用</li>
        <li>• <kbd className="bg-gray-200 px-1 rounded text-[10px]">Tab</kbd> でモード切り替え（R→G→B→RGB→ALL）</li>
        <li>• <kbd className="bg-gray-200 px-1 rounded text-[10px]">Shift + R</kbd> でリセット</li>
        <li>• 分割高さで粗さを調整</li>
        <li>• Shift + ドラッグで範囲指定</li>
        <li>• 結果をダウンロード</li>
      </ul>
    </div>
  );
};