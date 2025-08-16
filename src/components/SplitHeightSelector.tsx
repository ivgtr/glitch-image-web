interface SplitHeightSelectorProps {
  splitHeight: number;
  onSplitHeightChange: (value: number) => void;
}

const QUICK_SELECT_VALUES = [20, 30, 40, 50, 60] as const;

export const SplitHeightSelector = ({ 
  splitHeight, 
  onSplitHeightChange 
}: SplitHeightSelectorProps) => {
  return (
    <div>
      <label htmlFor="split-height" className="block text-sm font-semibold text-gray-800 mb-4">
        分割高さ: {splitHeight}px
      </label>
      <div className="space-y-4">
        {/* Range Slider */}
        <div className="relative">
          <input
            type="range"
            id="split-height"
            min="10"
            max="100"
            step="10"
            value={splitHeight}
            onChange={(e) => onSplitHeightChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10px</span>
            <span>細かい</span>
            <span>粗い</span>
            <span>100px</span>
          </div>
        </div>
        
        {/* Quick Select Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {QUICK_SELECT_VALUES.map((value) => (
            <button
              key={value}
              onClick={() => onSplitHeightChange(value)}
              className={`
                px-2 py-1 text-xs rounded-md font-medium transition-colors duration-200
                ${splitHeight === value 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {value}px
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        値が小さいほど細かく、大きいほど粗いグリッチエフェクトになります
      </p>
    </div>
  );
};