interface Block {
  laneNumber: number;
  noteID: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isHit: boolean;
  isPoor: boolean;
  menuId: string | undefined; // 紐付けるメニューのID
  color: string; // ノーツの色
}
