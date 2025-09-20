import { SuccessCard } from '@/app/Order/components/successCard';
import { ErrorCard } from '@/app/components/errorCard';
import { fetchOrderById, type OrderResponse } from '@/api/client';

// --- Data Fetching Logic ---

interface WaitingStatus {
  currentNumber: number | null;
  calledNumbers: number[];
  onHoldNumbers: number[];
  waitingNumbers: number[];
}

/**
 * ダミーの待ち状況データを返す非同期関数
 * @param storeId 店舗ID (現在は未使用)
 * @returns {Promise<WaitingStatus>} 待ち状況データ
 */
async function fetchWaitingStatus(storeId: string): Promise<WaitingStatus> {
  console.log("Fetching DUMMY waiting status for store:", storeId);
  // この関数はサーバーサイドでのみ実行されます。
  return {
    currentNumber: 486,
    calledNumbers: [489, 488, 487].sort((a, b) => b - a), // 降順にソート
    onHoldNumbers: [465, 7292],
    waitingNumbers: [460, 463, 466, 471, 473, 482, 483, 484, 485], // 自分の番号より前の人も含める
  };
}

// --- Server Component ---

export default async function OrderPage({
  params: paramsPromise, // Promiseのまま受け取る
}: {
  params: Promise<{ storeId: string; orderId: string }>;
}) {
  const { storeId, orderId } = await paramsPromise;

  if (!storeId || !orderId) {
    return (
      <main className="mx-auto max-w-sm p-4">
        <ErrorCard 
          title="注文情報を取得できませんでした" 
          message="URLに店舗IDまたは注文IDが含まれていません。" 
        />
      </main>
    );
  }

  const [orderResult, waitingStatusResult] = await Promise.allSettled([
    fetchOrderById(storeId, orderId),
    fetchWaitingStatus(storeId)
  ]);

  if (orderResult.status === 'rejected' || waitingStatusResult.status === 'rejected') {
    const errorMessage = orderResult.status === 'rejected' 
      ? (orderResult.reason instanceof Error ? orderResult.reason.message : String(orderResult.reason))
      : '待ち状況の取得に失敗しました。';
    
    return (
      <main className="mx-auto max-w-sm p-4">
        <ErrorCard title="情報を取得できませんでした" message={errorMessage} />
      </main>
    );
  }

  const order: OrderResponse = orderResult.value;
  const waitingStatus: WaitingStatus = waitingStatusResult.value;

  const myTicketNumber = order.order_number ?? parseInt(orderId, 10);
  const waitingCount = waitingStatus.waitingNumbers.filter(num => num < myTicketNumber).length;

  return (
    <>
      {/* 縦画面のときにコンテンツを90度回転させるためのスタイル */}
      <style>
        {`
          /* スマートフォンの縦画面表示のみを対象 */
          @media (orientation: portrait) and (max-width: 767px) {
            body {
              overflow: hidden; /* 本体がスクロールしないように固定 */
            }
            .landscape-enforcer {
              transform: rotate(90deg);
              transform-origin: bottom left; /* 左下を軸に回転 */
              
              /* 回転後の位置とサイズを調整 */
              position: absolute;
              top: -100vw; /* 뷰포트 너비만큼 위로 이동 */
              left: 0;
              width: 100vh; /* 新しい幅 = 画面の高さ */
              height: 100vw; /* 新しい高さ = 画面の幅 */

              overflow-x: hidden;
              overflow-y: auto; /* コンテンツがはみ出た場合はスクロールを許可 */
            }
          }
        `}
      </style>

      {/* 回転を適用するためのラッパー */}
      <div className="landscape-enforcer">
        <main className="mx-auto max-w-4xl p-4 font-sans bg-gray-50 min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 左側: 呼び出し番号エリア */}
            <div className="md:col-span-1 bg-gray-900 text-white p-4 rounded-lg flex flex-col items-center shadow-lg">
              <div className="w-full">
                <h2 className="text-sm text-gray-400 border-b border-gray-600 pb-1 mb-2">呼び出し済み</h2>
                <div className="flex flex-col items-center gap-2 mb-4">
                  {waitingStatus.calledNumbers.slice(0, 3).map((num) => (
                    <div key={num} className="text-2xl font-bold flex items-center gap-2 p-1 rounded text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>{num}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full bg-white text-gray-900 rounded-lg p-4 flex flex-col items-center my-4 shadow-inner">
                 <span className="text-lg font-bold">次のお客様</span>
                 <p className="text-8xl font-black tracking-tighter">{waitingStatus.currentNumber ?? '---'}</p>
              </div>
              <div className="w-full mt-2">
                <h2 className="text-sm text-yellow-400 border-b border-gray-600 pb-1 mb-2">不在のため保留中</h2>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {waitingStatus.onHoldNumbers.map((num) => (
                    <div key={num} className="text-xl font-bold text-yellow-500 line-through">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右側: 自分の状況 & 広告エリア */}
            <div className="md:col-span-2">
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-6 shadow" role="alert">
                <p className="font-bold text-xl">あなたの整理番号: {myTicketNumber}</p>
                <p className="text-lg mt-1">
                  お客様の前には<span className="font-bold text-2xl mx-1 text-blue-900">{waitingCount}</span>組のお客様がお待ちです。
                </p>
              </div>
              
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                <div className="w-full h-full flex items-center justify-center bg-slate-300">
                  <span className="text-3xl text-slate-500">広告エリア</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">これは広告です</div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-gray-700">待機中のお客様番号</h3>
                <div className="flex flex-wrap gap-3 mt-2 p-3 bg-gray-100 rounded-md border">
                  {waitingStatus.waitingNumbers.map((num) => (
                    <span 
                      key={num} 
                      className={`px-3 py-1 text-lg font-bold rounded-full transition-all duration-300 ${
                        num === myTicketNumber 
                          ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-110' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
