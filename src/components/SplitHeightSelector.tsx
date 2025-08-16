interface SplitHeightSelectorProps {
  splitHeight: number;
  onSplitHeightChange: (value: number) => void;
  imageHeight?: number;
}

export const SplitHeightSelector = ({ 
  splitHeight, 
  onSplitHeightChange,
  imageHeight = 100
}: SplitHeightSelectorProps) => {
  const maxHeight = Math.max(imageHeight, 100);
  const percentage = Math.round((splitHeight / imageHeight) * 100);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-800">
        分割高さ: {splitHeight}px ({percentage}%)
      </label>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max={maxHeight}
          step="1"
          value={splitHeight}
          onChange={(e) => onSplitHeightChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0px</span>
          <span>細かい ← → 粗い</span>
          <span>{maxHeight}px</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        画像上でマウスドラッグしても範囲を指定できます
      </p>
    </div>
  );
};