import Image from "next/image";

// 各レーンの状態
export interface LaneStatus {
  currentNumber: number | null;
  calledNumbers: number[];
}
type LeftCardsProps = {
  // 変数名を「スマホ予約」「口頭予約」の意味合いに変更
  mobileReservationData: LaneStatus;
  verbalReservationData: LaneStatus;
  myTicketNumber: number | null; // myTicketNumberを追加
  status: 'pending' | 'waitingPickup' | 'completed' | null; // statusを追加
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
        {calledNumbers.slice(0, 4).map((num) => ( // ここを0, 4に変更
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


export const LeftCards = ({ mobileReservationData, verbalReservationData, myTicketNumber, status }: LeftCardsProps) => {
    // completedの場合のみ、渡し済みのお客様に自分の番号を表示
    const displayedCurrentNumber = myTicketNumber;

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

            {/* スシローのような区切りとピクトグラム、送付完了 COMPLETE. */}
            <div className="w-full flex flex-col items-center justify-center my-4">
                <div className="flex items-center">
                    {/* ピクトグラム - publicフォルダの画像をルートパスで参照 */}
                    <Image src="/regi_guide.jpg" alt="完了" width={80} height={40} />
                    {/* 送付完了 COMPLETE. を縦に並べる */}
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white leading-none">前回呼出</span>
                        <span className="text-2xl font-bold text-white leading-none">PAST</span>
                    </div>
                </div>
                {/* V字矢印 */}
                <div className="flex flex-col items-center mt-2">
                    {/* 1つ目のV字矢印 */}
                    <div className="relative w-8 h-8">
                        <div className="absolute bottom-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2 rotate-45 origin-bottom-left"></div> 
                        <div className="absolute bottom-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2 -rotate-45 origin-bottom-right"></div>
                    </div>
                    {/* 2つ目のV字矢印 (ネガティブマージンで詰める) */}
                    <div className="relative w-8 h-8 -mt-5">
                        <div className="absolute bottom-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2 rotate-45 origin-bottom-left"></div> 
                        <div className="absolute bottom-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2 -rotate-45 origin-bottom-right"></div>
                    </div>
                    {/* 3つ目のV字矢印 (ネガティブマージンで詰める) */}
                    <div className="relative w-8 h-8 -mt-5">
                        <div className="absolute bottom-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2 rotate-45 origin-bottom-left"></div> 
                        <div className="absolute bottom-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2 -rotate-45 origin-bottom-right"></div>
                    </div>
                </div>
            </div>

            {/* 下段: 統合された「渡し済みのお客様」エリア */}
            <div className="w-full bg-white text-gray-900 rounded-lg p-3 flex flex-col items-center mt-4 shadow-inner">
                <span className="text-lg font-bold">渡し済みのお客様</span>
                {/* statusがcompletedの場合のみmyTicketNumberを表示、それ以外は既存のcurrentNumber */}
                <div className="text-7xl font-black tracking-tighter flex items-center">
                  <span>{displayedCurrentNumber}</span>
                </div>
            </div>
        </div>
    );
}
