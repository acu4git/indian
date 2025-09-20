type LeftCardsProps = {
  currentNumber: number | null;
  calledNumbers: number[];
  onHoldNumbers: number[];
};

// 左側コンポーネント(暫定)
export const LeftCards = ({ currentNumber, calledNumbers, onHoldNumbers }: LeftCardsProps) => {
    return (
        // 左上: 呼び出し番号エリア
        <div className="wait-status-grid-left bg-gray-900 text-white p-4 rounded-lg flex flex-col items-center shadow-lg">
            <div className="w-full">
                <h2 className="text-sm text-gray-400 border-b border-gray-600 pb-1 mb-2">呼び出し済み</h2>
                    <div className="flex flex-col items-center gap-2 mb-4">
                        {calledNumbers.slice(0, 3).map((num) => (
                            <div key={num} className="text-2xl font-bold flex items-center gap-2 p-1 rounded text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{num}</span>
                            </div>
                        ))}
                    </div>
            </div>
            {/* 左下: 呼び出し番号エリア */}
            <div className="w-full bg-white text-gray-900 rounded-lg p-4 flex flex-col items-center my-4 shadow-inner">
                <span className="text-lg font-bold">次のお客様</span>
                <p className="text-8xl font-black tracking-tighter">{currentNumber ?? '---'}</p>
            </div>
            {/* 左下2: 呼び出し番号エリア */}
                <div className="w-full mt-2">
                <h2 className="text-sm text-yellow-400 border-b border-gray-600 pb-1 mb-2">不在のため保留中</h2>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {onHoldNumbers.map((num) => (
                        <div key={num} className="text-xl font-bold text-yellow-500 line-through">
                            {num}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
