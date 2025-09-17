// --------------------------------
// ゲームの基本設定 (ゲームバランスの調整はここで行う)
// --------------------------------
export const LANE_WIDTH = 59;
export const BLOCK_HEIGHT = 17;
export const PLAY_TIME_SECONDS = 30; // プレイ時間（秒）
export const NOTES_PER_SECOND = 3; // 1秒あたりのノーツ数
export const TOTAL_NOTES = PLAY_TIME_SECONDS * NOTES_PER_SECOND;
export const NOTE_OFFSET_TIME_MS = 300; // ノーツ表示のオフセット（ミリ秒）
export const DEFAULT_SPEED = 9;
export const DEFAULT_SHOW_COMBO = true;
export const DEFAULT_SHOW_JUDGE = true;

// --------------------------------
// レイアウト関連 (見た目に関する固定値)
// --------------------------------
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// 定数から派生する計算値
export const DEFAULT_LEFT = CANVAS_WIDTH / 2 - 2 * LANE_WIDTH;
export const LANE_LEFTS = [
  DEFAULT_LEFT,
  DEFAULT_LEFT + LANE_WIDTH,
  DEFAULT_LEFT + 2 * LANE_WIDTH,
  DEFAULT_LEFT + 3 * LANE_WIDTH
];
export const BUTTONS_HEIGHT = CANVAS_HEIGHT * 0.16 - BLOCK_HEIGHT / 2;
export const BUTTONS_TOP = CANVAS_HEIGHT - BUTTONS_HEIGHT;

// --------------------------------
// 判定システム (判定追加・変更はここで行う)
// --------------------------------
export const JUDGE_TYPES = {
  BEST: {
    name: 'BEST',
    range: 8,        // speed * 8
    combo: true,     // コンボが継続するか
    order: 1         // 判定の優先順位（小さいほど優先）
  },
  GOOD: {
    name: 'GOOD',
    range: 15,       // speed * 15
    combo: true,
    order: 2
  },
  MISS: {
    name: 'MISS',
    range: 25,       // speed * 25
    combo: false,    // コンボがリセットされる
    order: 3
  },
  POOR: {
    name: 'POOR',
    range: Infinity, // 画面外に出た時の判定
    combo: false,
    order: 4
  }
} as const;

// 判定タイプの配列（順序保証）
export const JUDGE_ORDER = Object.values(JUDGE_TYPES).sort((a, b) => a.order - b.order);

// 判定結果の文字列（後方互換性のため）
export const JUDGE_RESULTS = Object.fromEntries(
  Object.entries(JUDGE_TYPES).map(([key, value]) => [key, value.name])
);

// 判定範囲を計算する関数
export const getJudgeYBounds = (speed: number) => {
  const bounds: Record<string, { min: number; max: number }> = {};
  
  Object.entries(JUDGE_TYPES).forEach(([key, judge]) => {
    if (judge.range === Infinity) {
      bounds[key] = { min: -Infinity, max: Infinity };
    } else {
      bounds[key] = {
        min: BUTTONS_TOP - speed * judge.range,
        max: BUTTONS_TOP + speed * judge.range
      };
    }
  });
  
  return bounds;
};

// 判定を実行する関数
export const getJudgeResult = (blockY: number, speed: number): keyof typeof JUDGE_TYPES | null => {
  const bounds = getJudgeYBounds(speed);
  
  // 優先順位順に判定をチェック
  for (const judge of JUDGE_ORDER) {
    const key = Object.keys(JUDGE_TYPES).find(k => JUDGE_TYPES[k as keyof typeof JUDGE_TYPES] === judge) as keyof typeof JUDGE_TYPES;
    const bound = bounds[key];
    
    if (blockY >= bound.min && blockY <= bound.max) {
      return key;
    }
  }
  
  return null;
};

// --------------------------------
// ゲームプレイ関連
// --------------------------------
// キーボードマッピング
export const KEY_MAPPINGS: { [key: string]: number } = {
  KeyD: 0,
  KeyF: 1,
  KeyJ: 2,
  KeyK: 3,
};

// 味に対応する色の配列を定義
export const FLAVOR_COLORS = [
  '#f00', // いちご (赤系)
  '#0f0', // メロン (緑系)
  '#00f', // ブルーハワイ (青系)
  '#f90', // オレンジ (黄系)
  '#c90', // 予備色1 (カレー系)
  '#d0d', // 予備色2 (明るい緑)
];

// 店のID（環境変数から取得）
export const STORE_ID = 'store-001'; //process.env.NEXT_PUBLIC_STORE_ID
