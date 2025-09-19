import { Block } from '../types';
import * as C from '../consts';
import { MenuItemWithColor } from '@/app/FlavorGame/types'; // page.tsxから型をインポート

/**
 * ゲームのノーツ（ブロック）配列を生成する
 * @param menuItems - 色情報が付与されたメニューアイテムの配列
 * @returns 生成されたBlockオブジェクトの配列
 */

export const createNotes = (menuItems: MenuItemWithColor[]): Block[] => {
    const notes: Block[] = [];
    const baseSpeed = (60 * C.PLAY_TIME_SECONDS) / C.TOTAL_NOTES;

    // 特殊な色付きノーツの数（メニューの数と総ノーツ数の少ない方）
    const numFlavorNotes = Math.min(menuItems.length, C.TOTAL_NOTES); 

    // 1. 全ノーツのインデックスを生成し、シャッフル
    const allNoteIndices = Array.from({ length: C.TOTAL_NOTES }, (_, i) => i);
    for (let i = allNoteIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allNoteIndices[i], allNoteIndices[j]] = [allNoteIndices[j], allNoteIndices[i]];
    }
    // 特殊な色付きノーツを配置するインデックスを選択
    const flavorNoteIndices = allNoteIndices.slice(0, numFlavorNotes);

    // 2. menuItemsをシャッフル（色情報が既に含まれているため、これでランダムに色と味が割り当てられる）
    const shuffledMenuItems = [...menuItems];
    for (let i = shuffledMenuItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledMenuItems[i], shuffledMenuItems[j]] = [shuffledMenuItems[j], shuffledMenuItems[i]];
    }

    // ノーツインデックスと割り当てるMenuItemのマップを作成
    const noteIndexToMenuItemMap = new Map<number, MenuItemWithColor>();
    flavorNoteIndices.forEach((index, i) => {
        if (i < shuffledMenuItems.length) {
            noteIndexToMenuItemMap.set(index, shuffledMenuItems[i]);
        }
    });

    for (let i = 0; i < C.TOTAL_NOTES; i++) {
        const laneNum = Math.floor(Math.random() * 4);
        
        const assignedMenuItem = noteIndexToMenuItemMap.get(i);
        const noteColor = assignedMenuItem ? assignedMenuItem.color : '#FFFFFF'; // デフォルトは白色
        const noteMenuId = assignedMenuItem ? assignedMenuItem.id : undefined; // 味のIDをノーツに紐付け
        
        notes.push({
            laneNumber: laneNum, 
            noteID: i, 
            x: C.LANE_LEFTS[laneNum],
            y: -(baseSpeed * C.DEFAULT_SPEED * i) - C.NOTE_OFFSET_TIME_MS + C.BUTTONS_TOP,
            width: C.LANE_WIDTH, 
            height: C.BLOCK_HEIGHT, 
            isHit: false, 
            isPoor: false,
            menuId: noteMenuId, // ノーツにメニューIDを紐付け
            color: noteColor, // ノーツに色を紐付け
        });
    }
  return notes;
};
