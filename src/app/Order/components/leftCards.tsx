// 各レーンの状態
export interface LaneStatus {
  currentNumber: number | null;
  calledNumbers: number[];
  onHoldNumbers: number[];
}
type LeftCardsProps = {
  // 変数名を「スマホ予約」「口頭予約」の意味合いに変更
  mobileReservationData: LaneStatus;
  verbalReservationData: LaneStatus;
};

/**
 * 「呼び出し済み」番号を個別のカードで表示するカラムコンポーネント
 */
const CalledListColumn = ({ title, calledNumbers }: { title: string, calledNumbers: number[] }) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-bold text-center text-white">{title}</h3>
      <span className="text-lg font-bold text-center text-white mb-2">未呼出</span>
      
      {/* 個別の番号カードを縦に並べる */}
      <div className="flex flex-col items-center gap-2">
        {calledNumbers.slice(0, 3).map((num) => (
          // 番号ひとつひとつを白いカードとして表示
          <div key={num} className="w-full bg-white text-gray-900 rounded-lg p-2 flex items-center justify-center shadow-inner">
            <span className="font-bold text-xl">{num}</span>
          </div>
        ))}
        {/* 呼び出し済みの番号がない場合に表示 */}
        {calledNumbers.length === 0 && (
           <div className="w-full bg-gray-800 text-gray-500 rounded-lg p-2 text-center text-xs shadow-inner mt-1">
            (なし)
          </div>
        )}
      </div>
    </div>
  );
};


export const LeftCards = ({ mobileReservationData, verbalReservationData }: LeftCardsProps) => {
    return (
        // 1つの大きなエリアとして定義
        <div className="wait-status-grid-left bg-gray-900 text-white p-4 rounded-lg flex flex-col shadow-lg h-full">
            
            {/* 上段: スマホ予約と口頭予約の情報を2列で表示 */}
            <div className="grid grid-cols-2 gap-4 w-full">
                <CalledListColumn 
                  title="スマホ予約" 
                  calledNumbers={mobileReservationData.calledNumbers} 
                />
                <CalledListColumn 
                  title="口頭予約"
                  calledNumbers={verbalReservationData.calledNumbers}
                />
            </div>

            {/* 下段: 統合された「渡し済みのお客様」エリア */}
            <div className="w-full bg-white text-gray-900 rounded-lg p-3 flex flex-col items-center mt-4 shadow-inner">
                <span className="text-lg font-bold">渡し済みのお客様</span>
                {/* ご提示のコードの通り、スマホ予約を優先して表示 */}
                <div className="text-7xl font-black tracking-tighter flex items-center">
                  <span>{mobileReservationData.currentNumber ?? verbalReservationData.currentNumber}</span>
                </div>
            </div>
        </div>
    );
}
