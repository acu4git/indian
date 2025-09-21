type RightAreaProps = {
  waitingNumbers: number[];
  myTicketNumber: number;
};

// 左側コンポーネント(暫定)
export const RightArea = ({ waitingNumbers, myTicketNumber }: RightAreaProps) => {
    // myTicketNumberをwaitingNumbersに含める
    const displayNumbers = [...new Set([...waitingNumbers, myTicketNumber])].sort(() => Math.random() - 0.5);

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
            <div className="flex flex-wrap gap-3 mt-2 p-3 bg-gray-100 rounded-md border">
                {/* myTicketNumberを含むdisplayNumbersを使用 */}
                {displayNumbers.map((num) => (
                <span 
                    key={num} 
                    className={`px-3 py-1 text-lg font-bold rounded-full transition-all duration-300 'bg-gray-300 text-gray-600`}
                >
                    {num}
                </span>
                ))}
            </div>
            </div>
        </div>
    );
}
