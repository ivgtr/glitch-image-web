import { useState } from 'react';
import { SplitHeightMode } from '../types';

interface SplitHeightSelectorProps {
  splitHeight: number;
  onSplitHeightChange: (value: number) => void;
  imageHeight?: number; // 画像の高さ（動的な最大値設定用）
}

// パーセンテージプリセット
const PERCENTAGE_PRESETS = [10, 25, 50, 75, 100] as const;
// 固定値プリセット
const FIXED_PRESETS = [20, 30, 40, 50, 60] as const;

export const SplitHeightSelector = ({ 
  splitHeight, 
  onSplitHeightChange,
  imageHeight = 100 // デフォルトは100px
}: SplitHeightSelectorProps) => {
  const [mode, setMode] = useState<SplitHeightMode>('fixed');
  
  // 現在の設定をパーセンテージで表示
  const currentPercentage = Math.round((splitHeight / imageHeight) * 100);
  
  // 動的最大値設定（画像高さまたは最大300px）
  const maxFixedValue = Math.min(imageHeight, 300);
  
  const handleModeChange = (newMode: SplitHeightMode) => {
    setMode(newMode);
    
    if (newMode === 'full') {
      // 画面全体モード
      onSplitHeightChange(imageHeight);
    } else if (newMode === 'percentage' && mode === 'fixed') {
      // 固定値からパーセンテージに変換
      const percentage = Math.round((splitHeight / imageHeight) * 100);
      const newValue = Math.round((percentage / 100) * imageHeight);
      onSplitHeightChange(newValue);
    }
  };

  const handlePercentageChange = (percentage: number) => {
    const newValue = Math.round((percentage / 100) * imageHeight);
    onSplitHeightChange(newValue);
  };

  const isFullHeight = splitHeight >= imageHeight;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-800">
        分割高さ設定
      </label>
      
      {/* モード選択タブ */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleModeChange('percentage')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === 'percentage'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          パーセンテージ
        </button>
        <button
          onClick={() => handleModeChange('fixed')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === 'fixed'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          固定値
        </button>
        <button
          onClick={() => handleModeChange('full')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === 'full' || isFullHeight
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          画面全体
        </button>
      </div>

      {/* 現在の値表示 */}
      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-lg font-semibold text-blue-900">
          {isFullHeight ? '画面全体' : `${splitHeight}px`}
        </div>
        <div className="text-sm text-blue-700">
          画像の {currentPercentage}% ({imageHeight}px中)
        </div>
      </div>

      {/* パーセンテージモード */}
      {mode === 'percentage' && !isFullHeight && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {PERCENTAGE_PRESETS.map((percentage) => {
              const pixelValue = Math.round((percentage / 100) * imageHeight);
              const isActive = Math.abs(splitHeight - pixelValue) < 2;
              
              return (
                <button
                  key={percentage}
                  onClick={() => handlePercentageChange(percentage)}
                  className={`px-2 py-2 text-xs rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {percentage}%
                </button>
              );
            })}
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={currentPercentage}
              onChange={(e) => handlePercentageChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>細かい</span>
              <span>粗い</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* 固定値モード */}
      {mode === 'fixed' && !isFullHeight && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {FIXED_PRESETS.map((value) => (
              <button
                key={value}
                onClick={() => onSplitHeightChange(value)}
                className={`px-2 py-2 text-xs rounded-md font-medium transition-colors duration-200 ${
                  splitHeight === value
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {value}px
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="10"
              max={maxFixedValue}
              step="5"
              value={Math.min(splitHeight, maxFixedValue)}
              onChange={(e) => onSplitHeightChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10px</span>
              <span>細かい</span>
              <span>粗い</span>
              <span>{maxFixedValue}px</span>
            </div>
          </div>
        </div>
      )}

      {/* 説明文 */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• 値が小さいほど細かく、大きいほど粗いグリッチエフェクトになります</p>
        <p>• パーセンテージモードは画像サイズに応じて自動調整されます</p>
        {isFullHeight && <p>• 画面全体モードでは画像の高さ全体にエフェクトが適用されます</p>}
      </div>
    </div>
  );
};