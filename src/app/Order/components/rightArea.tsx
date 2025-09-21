type RightAreaProps = {
  waitingNumbers: number[];
  orderName: string;
};

// 左側コンポーネント(暫定)
export const RightArea = ({ waitingNumbers, orderName }: RightAreaProps) => {
    const displayNumbers = waitingNumbers.sort(() => Math.random() - 0.5);
    const videoId = "aLpcjQDiBDM"; // Rick Astley - Never Gonna Give You Up (Video)

    // menuNameから「な」の前だけを抽出
    const eventName = orderName.split('な')[0];;
    const flavorName = orderName.split('な')[1] || 'カレー味';

    // --- ここからが修正箇所 ---
    // ユーザーを困惑させるため、ランダムに選択されたカードを緑色にハイライトする
    // 0から表示されるカード数までの間で、ランダムにハイライトする個数を決定
    const highlightCount = Math.floor(Math.random() * (displayNumbers.length + 1));
    
    // ハイライトするカードのインデックスをランダムにシャッフルして取得
    const indices = Array.from(Array(displayNumbers.length).keys());
    const highlightedIndices = new Set(indices.sort(() => 0.5 - Math.random()).slice(0, highlightCount));
    // --- ここまでが修正箇所 ---

    return (
        <div className="wait-status-grid-right">
            {/* 右上: 自分の状況 */}
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-6 shadow" role="alert">
                <p className="font-bold text-xl">{eventName}なお客様lD: 20251011-1012</p>
                <p className="text-lg mt-1">
                    ※{flavorName}は稀にカレー味になります
                </p>
            </div>
            {/* 中段: YouTube Iframeエリア */}
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
            </div>

            {/* 右下: 待機中 */}
            <div className="mt-6">
                <h3 className="font-bold text-gray-700">呼出中のお客様番号</h3>
                <div className="flex items-center mt-2"> {/* V字矢印とカード群を横並びにするためのflexコンテナ */}
                    {/* 左向きV字矢印を2つ */}
                    <div className="flex items-center mr-4">
                        <div className="relative w-8 h-8 mr-[-8px]">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 -rotate-45 origin-bottom-left"></div>
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 rotate-45 origin-top-left"></div>
                        </div>
                        <div className="relative w-8 h-8">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 -rotate-45 origin-bottom-left"></div>
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2 rotate-45 origin-top-left"></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-100 rounded-md border overflow-x-auto whitespace-nowrap flex-grow">
                        {/* 矢印のようなカードを横一直線に並べる */}
                        {displayNumbers.map((num, index) => {
                            const isHighlighted = highlightedIndices.has(index);
                            return (
                                <div 
                                    key={num} 
                                    className={`relative px-4 py-2 text-lg font-bold mr-1 flex items-center justify-center transition-all duration-300 transform skew-x-[-15deg] ${
                                      isHighlighted 
                                        ? 'bg-green-600 text-white' // 緑でハイライト
                                        : 'bg-gray-300 text-gray-600' // デフォルト
                                    }`}
                                    style={{ minWidth: '70px' }}
                                >
                                    <div className="relative z-10 transform skew-x-[15deg] flex items-center">
                                        {isHighlighted && (
                                            // ハイライトされている場合にチェックマークを表示
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        )}
                                        <span>{num}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
