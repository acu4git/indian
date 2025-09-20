export interface LaneStatus {
  currentNumber: number | null;
  calledNumbers: number[];
  onHoldNumbers: number[];
}

type LaneProps = {
  title: string;
  data: LaneStatus;
  theme: 'default' | 'takeout';
};

// 1列分のUIを描画する内部コンポーネント
const Lane = ({ title, data, theme }: LaneProps) => {
  const themeClasses = {
    default: {
      bg: 'bg-gray-900',
      header: 'text-lg font-bold',
      currentNumberBg: 'bg-white text-gray-900',
    },
    takeout: {
      bg: 'bg-green-900',
      header: 'text-lg font-bold text-green-200',
      currentNumberBg: 'bg-green-100 text-green-900',
    }
  };
  const currentTheme = themeClasses[theme];

  return (
    <div className={`${currentTheme.bg} text-white p-3 rounded-lg flex flex-col items-center shadow-md h-full`}>
      <h2 className={currentTheme.header}>{title}</h2>
      
      <div className="w-full mt-2">
        <h3 className="text-xs text-gray-400 border-b border-gray-600 pb-1 mb-2">呼び出し済み</h3>
        <div className="flex flex-col items-center gap-1 mb-3 text-sm">
          {data.calledNumbers.slice(0, 3).map((num) => (
            <div key={num} className="font-bold flex items-center gap-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>{num}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`w-full ${currentTheme.currentNumberBg} rounded-lg p-2 flex flex-col items-center my-auto shadow-inner`}>
        <span className="text-sm font-bold">次のお客様</span>
        <p className="text-6xl font-black tracking-tighter">{data.currentNumber ?? '---'}</p>
      </div>
      
      <div className="w-full mt-3">
        <h3 className="text-xs text-yellow-400 border-b border-gray-600 pb-1 mb-2">不在のため保留中</h3>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          {data.onHoldNumbers.map((num) => (
            <div key={num} className="text-base font-bold text-yellow-500 line-through">
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


type LeftCardsProps = {
  dineInData: LaneStatus;
  takeoutData: LaneStatus;
};

// 「イートイン」と「テイクアウト」の2列を表示するメインコンポーネント
export const LeftCards = ({ dineInData, takeoutData }: LeftCardsProps) => {
    return (
        <div className="wait-status-grid-left grid grid-cols-2 gap-4">
            <Lane title="イートイン" data={dineInData} theme="default" />
            <Lane title="テイクアウト" data={takeoutData} theme="takeout" />
        </div>
    );
}
