export const Instructions = () => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        使い方
      </h3>
      <ul className="space-y-2 text-xs text-gray-600">
        <li>• 画像をアップロード</li>
        <li>• マウス操作でエフェクト適用</li>
        <li>• <kbd className="bg-gray-200 px-1 rounded text-[10px]">Tab</kbd> でモード切り替え（R→G→B→RGB）</li>
        <li>• <kbd className="bg-gray-200 px-1 rounded text-[10px]">Shift + R</kbd> でリセット</li>
        <li>• 分割高さで粗さを調整</li>
        <li>• Shift + ドラッグで範囲指定</li>
        <li>• 結果をダウンロード</li>
      </ul>
    </div>
  );
};