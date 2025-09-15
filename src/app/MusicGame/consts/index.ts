// --------------------------------
// ゲームの基本設定 (ゲームバランスの調整はここで行う)
// --------------------------------
export const LANE_WIDTH = 59;
export const BLOCK_HEIGHT = 17;
export const PLAY_TIME_SECONDS = 30; // プレイ時間（秒）
export const NOTES_PER_SECOND = 3; // 1秒あたりのノーツ数
export const TOTAL_NOTES = PLAY_TIME_SECONDS * NOTES_PER_SECOND;
export const NOTE_OFFSET_TIME_MS = 300; // ノーツ表示のオフセット（ミリ秒）

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
// 広告機能関連
// --------------------------------
export const AD_WIDTH = 700;
export const AD_HEIGHT = 70;
export const AD_SPEED = 1.5;
export const AD_IMAGE_URL = `https://placehold.co/${AD_WIDTH}x${AD_HEIGHT}/FFD700/000000?text=Curry+Ad`;

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

// 判定結果の文字列
export const JUDGE_RESULTS = {
  BEST: 'BEST',
  GOOD: 'GOOD',
  MISS: 'MISS',
  POOR: 'POOR',
};