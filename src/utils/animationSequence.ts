/**
 * フレームの種類
 */
export enum FrameType {
  ORIGINAL = 'original',        // 元画像
  LIGHT_GLITCH = 'light',       // 軽いグリッチ
  MEDIUM_GLITCH = 'medium',     // 中程度のグリッチ
  HEAVY_GLITCH = 'heavy',       // 強いグリッチ
  BUILDUP = 'buildup',          // グリッチビルドアップ
  RELEASE = 'release'           // リリース（元画像への戻り）
}

/**
 * フレーム遅延の種類
 */
export enum DelayType {
  FLASH = 'flash',     // 30-50ms（瞬間的）
  QUICK = 'quick',     // 60-100ms（素早い）
  NORMAL = 'normal',   // 120-180ms（標準）
  FREEZE = 'freeze'    // 250-400ms（静止・強調）
}

/**
 * アニメーションフレームの定義
 */
export interface AnimationFrame {
  type: FrameType;
  delay: DelayType;
  intensity: number; // 0-1の強度（グリッチの強さ）
  glitchCount: number; // グリッチエフェクトの適用回数
}

/**
 * 遅延時間を取得（ランダムな幅を持つ）
 */
export function getDelayTime(delayType: DelayType): number {
  const ranges = {
    [DelayType.FLASH]: [30, 50],
    [DelayType.QUICK]: [60, 100],
    [DelayType.NORMAL]: [120, 180],
    [DelayType.FREEZE]: [250, 400]
  };
  
  const [min, max] = ranges[delayType];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 音楽的なリズムパターンを生成
 */
function generateRhythmPattern(): DelayType[] {
  const patterns = [
    // 4拍子パターン（強-弱-中-弱）
    [DelayType.FREEZE, DelayType.QUICK, DelayType.NORMAL, DelayType.QUICK],
    // シンコペーション（弱-強-弱-強）
    [DelayType.QUICK, DelayType.FREEZE, DelayType.QUICK, DelayType.NORMAL],
    // グラデーション（徐々に速く）
    [DelayType.FREEZE, DelayType.NORMAL, DelayType.QUICK, DelayType.FLASH],
    // 波形（上がって下がる）
    [DelayType.NORMAL, DelayType.QUICK, DelayType.FLASH, DelayType.NORMAL],
    // 高速パターン（素早い変化）
    [DelayType.FLASH, DelayType.FLASH, DelayType.QUICK, DelayType.QUICK],
    // スタッカート（短い音符のような）
    [DelayType.FLASH, DelayType.NORMAL, DelayType.FLASH, DelayType.FREEZE],
    // ドラムロール風（高速連打）
    [DelayType.FLASH, DelayType.FLASH, DelayType.FLASH, DelayType.NORMAL],
  ];
  
  return patterns[Math.floor(Math.random() * patterns.length)];
}

/**
 * 緊張と緩和のサイクルを生成
 */
function generateTensionCycle(): { buildupLength: number; releaseLength: number } {
  // 黄金比（1.618）を使用した自然な比率
  const goldenRatio = 1.618;
  const baseLength = 2 + Math.floor(Math.random() * 3); // 2-4フレーム
  
  return {
    buildupLength: Math.ceil(baseLength * goldenRatio),
    releaseLength: baseLength
  };
}

/**
 * 気持ちの良いアニメーションシーケンスを生成
 */
export function generateAnimationSequence(totalFrames: number = 40): AnimationFrame[] {
  const sequence: AnimationFrame[] = [];
  const rhythmPattern = generateRhythmPattern();
  let rhythmIndex = 0;
  
  // 開始：必ず元画像から
  sequence.push({
    type: FrameType.ORIGINAL,
    delay: DelayType.FREEZE,
    intensity: 0,
    glitchCount: 0
  });
  
  let remainingFrames = totalFrames - 1;
  
  while (remainingFrames > 0) {
    const cycle = generateTensionCycle();
    const cycleLength = Math.min(cycle.buildupLength + cycle.releaseLength, remainingFrames);
    
    if (cycleLength < 3) {
      // 残りが少ない場合は単純なパターン
      sequence.push({
        type: FrameType.LIGHT_GLITCH,
        delay: DelayType.QUICK,
        intensity: Math.random() * 0.5 + 0.3,
        glitchCount: 1
      });
      remainingFrames--;
      continue;
    }
    
    // ビルドアップフェーズ
    for (let i = 0; i < cycle.buildupLength && remainingFrames > 0; i++) {
      const progress = i / (cycle.buildupLength - 1);
      const intensity = progress * 0.8 + 0.2; // 0.2 から 1.0 へ
      
      let frameType: FrameType;
      let glitchCount: number;
      
      if (progress < 0.3) {
        frameType = FrameType.LIGHT_GLITCH;
        glitchCount = 1;
      } else if (progress < 0.7) {
        frameType = FrameType.MEDIUM_GLITCH;
        glitchCount = 2;
      } else {
        frameType = FrameType.HEAVY_GLITCH;
        glitchCount = 3 + Math.floor(Math.random() * 2); // 3-4回
      }
      
      sequence.push({
        type: frameType,
        delay: rhythmPattern[rhythmIndex % rhythmPattern.length],
        intensity,
        glitchCount
      });
      
      rhythmIndex++;
      remainingFrames--;
    }
    
    // クライマックス（最も強いグリッチ）
    if (remainingFrames > 0) {
      sequence.push({
        type: FrameType.HEAVY_GLITCH,
        delay: DelayType.FLASH,
        intensity: 0.9 + Math.random() * 0.1,
        glitchCount: 4 + Math.floor(Math.random() * 3) // 4-6回
      });
      remainingFrames--;
    }
    
    // リリースフェーズ
    for (let i = 0; i < cycle.releaseLength && remainingFrames > 0; i++) {
      const progress = i / (cycle.releaseLength - 1);
      const intensity = (1 - progress) * 0.6; // 0.6 から 0 へ
      
      if (i === cycle.releaseLength - 1) {
        // 最後は元画像
        sequence.push({
          type: FrameType.ORIGINAL,
          delay: DelayType.FREEZE,
          intensity: 0,
          glitchCount: 0
        });
      } else {
        sequence.push({
          type: FrameType.LIGHT_GLITCH,
          delay: DelayType.NORMAL,
          intensity,
          glitchCount: Math.max(1, Math.floor(intensity * 2))
        });
      }
      
      remainingFrames--;
    }
    
    // ランダムな "呼吸" を追加（時々元画像を挟む）
    if (remainingFrames > 3 && Math.random() < 0.4) {
      sequence.push({
        type: FrameType.ORIGINAL,
        delay: DelayType.QUICK, // 短めに変更
        intensity: 0,
        glitchCount: 0
      });
      remainingFrames--;
      
      // 連続する軽いグリッチも追加してテンポアップ
      if (remainingFrames > 1 && Math.random() < 0.6) {
        sequence.push({
          type: FrameType.LIGHT_GLITCH,
          delay: DelayType.FLASH,
          intensity: 0.2 + Math.random() * 0.3,
          glitchCount: 1
        });
        remainingFrames--;
      }
    }
  }
  
  // 終了：必ず元画像で終わる
  if (sequence[sequence.length - 1].type !== FrameType.ORIGINAL) {
    sequence.push({
      type: FrameType.ORIGINAL,
      delay: DelayType.FREEZE,
      intensity: 0,
      glitchCount: 0
    });
  }
  
  return sequence;
}

/**
 * シーケンスの統計情報を取得（デバッグ用）
 */
export function getSequenceStats(sequence: AnimationFrame[]): {
  totalDuration: number;
  frameTypeCount: Record<FrameType, number>;
  averageIntensity: number;
} {
  const totalDuration = sequence.reduce((sum, frame) => sum + getDelayTime(frame.delay), 0);
  
  const frameTypeCount: Record<FrameType, number> = {
    [FrameType.ORIGINAL]: 0,
    [FrameType.LIGHT_GLITCH]: 0,
    [FrameType.MEDIUM_GLITCH]: 0,
    [FrameType.HEAVY_GLITCH]: 0,
    [FrameType.BUILDUP]: 0,
    [FrameType.RELEASE]: 0
  };
  
  let totalIntensity = 0;
  
  sequence.forEach(frame => {
    frameTypeCount[frame.type]++;
    totalIntensity += frame.intensity;
  });
  
  return {
    totalDuration,
    frameTypeCount,
    averageIntensity: totalIntensity / sequence.length
  };
}