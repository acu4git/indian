// 各レーンの状態
export interface LaneStatus {
  currentNumber: number | null;
  calledNumbers: number[];
  onHoldNumbers: number[];
}

type LeftCardsProps = {
  dineInData: LaneStatus;
  takeoutData: LaneStatus;
};

// 呼び出し済み・保留中のリストを表示する内部コンポーネント
const InfoColumn = ({ title, calledNumbers }: { title: string, calledNumbers: number[] }) => {
  
  return (
    <div>
      <h3 className={`text-center font-bold mb-2 'text-gray-300'`}>{title}</h3>
      
      {/* 呼び出し済み */}
      <div className="mb-3">
        <h4 className="text-xs text-gray-400 border-b border-gray-700 pb-1 mb-2">呼び出し済み</h4>
        <div className="flex flex-col items-center gap-1 text-sm">
          {calledNumbers.slice(0, 3).map((num) => (
            <div key={num} className="font-bold flex items-center gap-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>{num}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LeftCards = ({ dineInData, takeoutData }: LeftCardsProps) => {
    return (
        // 1つの大きなエリアとして定義
        <div className="wait-status-grid-left bg-gray-900 text-white p-4 rounded-lg flex flex-col items-center shadow-lg h-full">
            
            {/* 上段: イートインとテイクアウトの情報を2列で表示 */}
            <div className="grid grid-cols-2 gap-4 w-full">
                <InfoColumn 
                  title="イートイン" 
                  calledNumbers={dineInData.calledNumbers} 
                />
                <InfoColumn 
                  title="テイクアウト"
                  calledNumbers={takeoutData.calledNumbers}
                />
            </div>

            {/* 下段: 統合された「次のお客様」エリア */}
            <div className="w-full bg-white text-gray-900 rounded-lg p-3 flex flex-col items-center mt-4 shadow-inner">
                <span className="text-lg font-bold">次のお客様</span>
                {/* 2つの番号を区切り文字を小さくして並べ、分かりにくくする */}
                <div className="text-7xl font-black tracking-tighter flex items-center">
                  <span>{dineInData.currentNumber ?? takeoutData.currentNumber}</span>
                </div>
            </div>
        </div>
    );
}
