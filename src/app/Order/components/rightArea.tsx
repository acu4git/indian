type RightAreaProps = {
  waitingNumbers: number[];
  myTicketNumber: number | null; // myTicketNumberをnull許容に変更
  status: 'pending' | 'waitingPickup' | 'completed' | null; // statusを追加
};

// 左側コンポーネント(暫定)
export const RightArea = ({ waitingNumbers, myTicketNumber, status }: RightAreaProps) => {
    // statusがwaitingPickupの場合のみmyTicketNumberをwaitingNumbersに含める
    const numbersToDisplay = status === 'waitingPickup' && myTicketNumber !== null
      ? [...new Set([...waitingNumbers, myTicketNumber])]
      : [...new Set(waitingNumbers)]; // waitingPickup以外ではmyTicketNumberを含めない

    const displayNumbers = numbersToDisplay.sort(() => Math.random() - 0.5);

    return (
        <div className="wait-status-grid-right">
            {/* 右上: 自分の状況 */}
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-6 shadow" role="alert">
            <p className="font-bold text-xl">あなたの運命の人: 5</p>
            <p className="text-lg mt-1">
                お客様の後には<span className="font-bold text-2xl mx-1 text-blue-900">13</span>組のお客様を待たせています。
            </p>
            </div>
            {/* 右中: 広告 */}
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-full flex items-center justify-center bg-slate-300">
                <span className="text-3xl text-slate-500">広告エリア</span>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">これは広告です</div>
            </div>

            {/* 右下: 待機中 */}
            <div className="mt-6">
                <h3 className="font-bold text-gray-700">呼び出し中のお客様番号</h3>
                <div className="flex items-center mt-2"> {/* V字矢印とカード群を横並びにするためのflexコンテナ */}
                    {/* 左向きV字矢印を2つ (横に並べてサイズを調整) */}
                    <div className="flex items-center mr-4"> {/* V字矢印全体を横に並べるためのコンテナ */}
                        {/* 1つ目の左向きV字矢印 */}
                        <div className="relative w-8 h-8 mr-[-8px]"> {/* 矢印全体のコンテナサイズ調整、重なり調整 */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 -rotate-45 origin-bottom-left"></div> {/* 上側の斜め線 */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 rotate-45 origin-top-left"></div> {/* 下側の斜め線 */}
                        </div>
                        {/* 2つ目の左向きV字矢印 */}
                        <div className="relative w-8 h-8"> {/* 矢印全体のコンテナサイズ調整 */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 -rotate-45 origin-bottom-left"></div> {/* 上側の斜め線 */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 rotate-45 origin-top-left"></div> {/* 下側の斜め線 */}
                        </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-100 rounded-md border overflow-x-auto whitespace-nowrap flex-grow"> {/* 横スクロールと nowrap を追加、flex-growで残りのスペースを占める */}
                        {/* 矢印のようなカードを横一直線に並べる */}
                        {displayNumbers.map((num) => (
                            <div 
                                key={num} 
                                className={`relative px-4 py-2 text-lg font-bold mr-1 flex items-center justify-center transition-all duration-300 transform skew-x-[-15deg] bg-gray-300 text-gray-600`}
                                style={{ minWidth: '70px' }} // カードの最小幅を設定
                            >
                                <span className="relative z-10 transform skew-x-[15deg]">{num}</span> {/* 文字の傾きを戻す */}
                                {/* 右側の三角部分 */}
                                <div className={`absolute right-[-15px] top-0 w-0 h-0 border-t-[22px] border-b-[22px] border-l-[15px] border-l-gray-300 border-t-transparent border-b-transparent z-0`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
