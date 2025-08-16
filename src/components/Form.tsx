import { useEffect, useState } from "react";
import { FormProps, GlitchMode } from "../types";
import { ModeSelector } from "./ModeSelector";
import { SplitHeightSelector } from "./SplitHeightSelector";

export const Form = ({
  defaultMode,
  defaultSplitHeight,
  handleChange,
}: FormProps) => {
  const [mode, setMode] = useState<GlitchMode>(defaultMode);
  const [splitHeight, setSplitHeight] = useState<number>(defaultSplitHeight);

  useEffect(() => {
    handleChange(mode, splitHeight);
  }, [mode, splitHeight, handleChange]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <ModeSelector
        selectedMode={mode}
        onModeChange={setMode}
      />
      
      <SplitHeightSelector
        splitHeight={splitHeight}
        onSplitHeightChange={setSplitHeight}
      />
    </div>
  );
};