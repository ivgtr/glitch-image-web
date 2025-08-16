import { GlitchMode } from "../types";

interface ModeSelectorProps {
  selectedMode: GlitchMode;
  onModeChange: (mode: GlitchMode) => void;
}

const MODE_COLORS = {
  r: "from-red-500 to-red-600",
  g: "from-green-500 to-green-600", 
  b: "from-blue-500 to-blue-600",
  rgb: "from-purple-500 to-indigo-600"
} as const;

const MODE_LABELS = {
  r: "Red Channel",
  g: "Green Channel", 
  b: "Blue Channel",
  rgb: "All Channels"
} as const;

export const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  const modes: GlitchMode[] = ["r", "g", "b", "rgb"];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-4">
        カラーモード
      </label>
      <div className="grid grid-cols-2 gap-3">
        {modes.map((mode) => (
          <label 
            key={mode} 
            className={`
              relative flex items-center justify-center p-3 rounded-lg cursor-pointer
              border-2 transition-all duration-200
              ${selectedMode === mode 
                ? `border-gray-400 bg-gradient-to-r ${MODE_COLORS[mode]} text-white shadow-md` 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }
            `}
            title={MODE_LABELS[mode]}
          >
            <input
              type="radio"
              name="mode"
              value={mode}
              checked={selectedMode === mode}
              onChange={() => onModeChange(mode)}
              className="sr-only"
            />
            <span className={`font-bold text-lg ${selectedMode === mode ? 'text-white' : 'text-gray-700'}`}>
              {mode.toUpperCase()}
            </span>
            {selectedMode === mode && (
              <div className="absolute top-1 right-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        R/G/Bは単一チャンネル、RGBは全チャンネルにエフェクトを適用
      </p>
    </div>
  );
};