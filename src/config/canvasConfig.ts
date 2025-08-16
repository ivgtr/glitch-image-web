/**
 * Canvas表示サイズ設定（Canvas幅700px固定版）
 * 
 * すべてのCanvas関連サイズは論理的な関係に基づいて自動計算されます
 * 
 * ## Canvas幅固定設計の理念
 * 
 * 従来のCanvas幅可変システムでは以下の問題がありました：
 * - アスペクト比によってCanvas幅がバラバラ（420〜700px）
 * - 横長画像で過剰な余白、縦長画像で不足する余白
 * - UI の一貫性が損なわれる
 * 
 * 新システムでは、Canvas最大幅を700px固定し、そこから逆算：
 * 
 * - Canvas幅: 常に700px以下の固定値
 * - 画像幅 = 700px ÷ グリッチ倍率（アスペクト比適応）
 * - 横長画像（4:1）→ 倍率1.2 → 画像幅583px + 余白117px = Canvas幅700px
 * - 正方形（1:1）→ 倍率1.5 → 画像幅466px + 余白234px = Canvas幅700px  
 * - 縦長画像（1:2）→ 倍率2.0 → 画像幅350px + 余白350px = Canvas幅700px
 * 
 * ## 最大領域活用アルゴリズム
 * 
 * 極端なアスペクト比でも適切なサイズを確保：
 * 1. アスペクト比からグリッチ倍率を計算
 * 2. Canvas幅700pxから画像幅を逆算
 * 3. アスペクト比維持で高さを決定
 * 4. 極端なケースでは最小サイズ制限を緩和
 */

// 基本設定（変更可能な主要パラメータ）
export const CANVAS_BASE_CONFIG = {
  // Canvas総幅の最大サイズ（グリッチ余白込み）
  MAX_CANVAS_WIDTH: 700,   // Canvas最大総幅（px）
  MAX_IMAGE_HEIGHT: 300,   // 最大画像高さ（px）
  
  // 操作性確保のための最小サイズ
  MIN_IMAGE_WIDTH: 200,   // 最小画像幅（px）
  MIN_IMAGE_HEIGHT: 150,  // 最小画像高さ（px）
  
  // グリッチ余白のアスペクト比適応設定
  GLITCH_MARGIN: {
    MIN_MULTIPLIER: 1.2,    // 横長画像での最小グリッチ倍率（20%余白）
    MAX_MULTIPLIER: 2.0,    // 縦長画像での最大グリッチ倍率（100%余白）
    STANDARD_MULTIPLIER: 1.5, // 正方形での標準グリッチ倍率（50%余白）
    WIDE_THRESHOLD: 2.0,    // 横長判定の閾値
    TALL_THRESHOLD: 0.5,    // 縦長判定の閾値
  }
} as const;

/**
 * アスペクト比に基づくグリッチ倍率の計算
 */
export const calculateGlitchMultiplier = (aspectRatio: number): number => {
  const { MIN_MULTIPLIER, MAX_MULTIPLIER, STANDARD_MULTIPLIER, WIDE_THRESHOLD, TALL_THRESHOLD } = CANVAS_BASE_CONFIG.GLITCH_MARGIN;
  
  if (aspectRatio >= WIDE_THRESHOLD) {
    // 横長画像: 最小倍率
    return MIN_MULTIPLIER;
  } else if (aspectRatio <= TALL_THRESHOLD) {
    // 縦長画像: 最大倍率
    return MAX_MULTIPLIER;
  } else if (aspectRatio > 1.0) {
    // 横長寄り: 標準から最小への線形補間
    const progress = (aspectRatio - 1.0) / (WIDE_THRESHOLD - 1.0);
    return STANDARD_MULTIPLIER + (MIN_MULTIPLIER - STANDARD_MULTIPLIER) * progress;
  } else {
    // 縦長寄り: 標準から最大への線形補間
    const progress = (1.0 - aspectRatio) / (1.0 - TALL_THRESHOLD);
    return STANDARD_MULTIPLIER + (MAX_MULTIPLIER - STANDARD_MULTIPLIER) * progress;
  }
};

// 論理的に計算される派生サイズ（固定Canvas幅ベース）
export const CANVAS_COMPUTED_CONFIG = {
  // Canvas最大総幅（固定値）
  MAX_CANVAS_WIDTH: CANVAS_BASE_CONFIG.MAX_CANVAS_WIDTH,
  
  // Canvas総高さ
  MAX_CANVAS_HEIGHT: CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT,
  
  // コンテナサイズ（最大幅 + 余裕）
  CONTAINER_MAX_WIDTH: CANVAS_BASE_CONFIG.MAX_CANVAS_WIDTH + 100,
  
  // 動的に計算される最大画像幅（倍率ごと）
  MAX_IMAGE_WIDTH_FOR_MIN_MULTIPLIER: Math.floor(CANVAS_BASE_CONFIG.MAX_CANVAS_WIDTH / CANVAS_BASE_CONFIG.GLITCH_MARGIN.MIN_MULTIPLIER), // 583px
  MAX_IMAGE_WIDTH_FOR_MAX_MULTIPLIER: Math.floor(CANVAS_BASE_CONFIG.MAX_CANVAS_WIDTH / CANVAS_BASE_CONFIG.GLITCH_MARGIN.MAX_MULTIPLIER), // 350px
} as const;

/**
 * 画像サイズからCanvas表示サイズを計算（Canvas幅700px固定版）
 */
export const calculateCanvasSize = (
  imageWidth: number,
  imageHeight: number
): {
  displayWidth: number;
  displayHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  imageOffsetX: number;
  glitchMultiplier: number;
  aspectRatio: number;
} => {
  const aspectRatio = imageWidth / imageHeight;
  
  // ステップ1: アスペクト比からグリッチ倍率を計算
  const glitchMultiplier = calculateGlitchMultiplier(aspectRatio);
  
  // ステップ2: Canvas幅700pxから画像幅を逆算
  const maxImageWidthForThisRatio = Math.floor(CANVAS_BASE_CONFIG.MAX_CANVAS_WIDTH / glitchMultiplier);
  
  let displayWidth: number;
  let displayHeight: number;
  
  if (aspectRatio >= 1.0) {
    // 横長・正方形：逆算した最大画像幅を使用
    displayWidth = maxImageWidthForThisRatio;
    displayHeight = displayWidth / aspectRatio;  // アスペクト比を維持
    
    // 高さが制限を超える場合のみ調整
    if (displayHeight > CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT) {
      displayHeight = CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT;
      displayWidth = displayHeight * aspectRatio;  // アスペクト比を維持
    }
  } else {
    // 縦長：高さを最大まで使用
    displayHeight = CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT;
    displayWidth = displayHeight * aspectRatio;  // アスペクト比を維持
    
    // 逆算した最大幅を超える場合は制限
    if (displayWidth > maxImageWidthForThisRatio) {
      displayWidth = maxImageWidthForThisRatio;
      displayHeight = displayWidth / aspectRatio;  // アスペクト比を維持
    }
  }
  
  // ステップ3: 最小サイズ保証（極端なアスペクト比では最大領域活用を優先）
  
  // 極端なアスペクト比の判定（2.5倍以上の差）
  const isExtremeAspectRatio = aspectRatio >= 2.5 || aspectRatio <= 0.4;
  
  if (!isExtremeAspectRatio) {
    // 通常のアスペクト比：最小サイズ制限を適用
    
    // 幅の最小値チェック
    if (displayWidth < CANVAS_BASE_CONFIG.MIN_IMAGE_WIDTH) {
      displayWidth = CANVAS_BASE_CONFIG.MIN_IMAGE_WIDTH;
      displayHeight = displayWidth / aspectRatio;  // アスペクト比を維持
      
      // 高さが制限を超える場合は制限内に収める
      if (displayHeight > CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT) {
        displayHeight = CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT;
        displayWidth = displayHeight * aspectRatio;  // アスペクト比を維持
      }
    }
    
    // 高さの最小値チェック
    if (displayHeight < CANVAS_BASE_CONFIG.MIN_IMAGE_HEIGHT) {
      displayHeight = CANVAS_BASE_CONFIG.MIN_IMAGE_HEIGHT;
      displayWidth = displayHeight * aspectRatio;  // アスペクト比を維持
      
      // 逆算した最大幅制限をチェック
      if (displayWidth > maxImageWidthForThisRatio) {
        displayWidth = maxImageWidthForThisRatio;
        displayHeight = displayWidth / aspectRatio;  // アスペクト比を維持
      }
    }
  }
  // 極端なアスペクト比の場合：最大領域活用を優先し、最小サイズ制限をスキップ
  
  // ステップ4: Canvas幅の計算（常に700px以下になる）
  const canvasWidth = Math.ceil(displayWidth * glitchMultiplier);
  
  return {
    displayWidth,
    displayHeight,
    canvasWidth,
    canvasHeight: displayHeight,
    imageOffsetX: (canvasWidth - displayWidth) / 2,  // 適応的中央配置
    glitchMultiplier,
    aspectRatio
  };
};

/**
 * 設定値の妥当性チェック
 */
export const validateConfig = (): boolean => {
  const margin = CANVAS_BASE_CONFIG.GLITCH_MARGIN;
  const computed = CANVAS_COMPUTED_CONFIG;
  const checks = [
    CANVAS_BASE_CONFIG.MIN_IMAGE_WIDTH <= computed.MAX_IMAGE_WIDTH_FOR_MAX_MULTIPLIER,
    CANVAS_BASE_CONFIG.MIN_IMAGE_HEIGHT <= CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT,
    CANVAS_BASE_CONFIG.MAX_CANVAS_WIDTH > 0,
    CANVAS_BASE_CONFIG.MAX_IMAGE_HEIGHT > 0,
    margin.MIN_MULTIPLIER >= 1.0,
    margin.MAX_MULTIPLIER >= margin.MIN_MULTIPLIER,
    margin.STANDARD_MULTIPLIER >= margin.MIN_MULTIPLIER,
    margin.STANDARD_MULTIPLIER <= margin.MAX_MULTIPLIER,
    margin.WIDE_THRESHOLD > 1.0,
    margin.TALL_THRESHOLD < 1.0,
    margin.TALL_THRESHOLD > 0,
    computed.MAX_IMAGE_WIDTH_FOR_MIN_MULTIPLIER >= computed.MAX_IMAGE_WIDTH_FOR_MAX_MULTIPLIER, // 583px >= 350px
  ];
  
  return checks.every(check => check);
};

// 開発時の設定値チェック
if (!validateConfig()) {
  console.error('Canvas config validation failed!');
}