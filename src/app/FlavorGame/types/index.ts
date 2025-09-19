import { type MenuItem } from '@/api/client';

export interface Block {
  laneNumber: number;
  noteID: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isHit: boolean;
  isPoor: boolean;
  menuId?: string; // 紐付けるメニューのID, string | undefinedだけだと存在してない時にエラーになる
  color: string; // ノーツの色
}

// MenuItem型に色情報を追加した新しい型を定義
export type MenuItemWithColor = MenuItem & { color: string };
