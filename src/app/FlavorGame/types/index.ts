interface Block {
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
