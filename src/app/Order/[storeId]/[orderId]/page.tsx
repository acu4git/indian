import { ErrorCard } from '@/app/components/errorCard';
import { RightArea } from '@/app/Order/components/rightArea';
import { LeftCards } from '@/app/Order/components/leftCards';
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
      {/* 画面回転とレイアウト制御のためのスタイル */}
      <style>
        {`
          .wait-status-grid {
            /* デフォルトは1カラムレイアウト */
            grid-template-columns: 1fr;
          }

          /* 画面幅が広い場合(PC) または スマホ縦画面の場合に2カラムレイアウトを適用 */
          @media (min-width: 768px), (orientation: portrait) and (max-width: 767px) {
            .wait-status-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .wait-status-grid-left {
              grid-column: span 1 / span 1;
            }
            .wait-status-grid-right {
              grid-column: span 2 / span 2;
            }
          }

          /* スマートフォンの縦画面表示でコンテンツを90度回転させる */
          @media (orientation: portrait) and (max-width: 767px) {
            body {
              overflow: hidden; /* 本体がスクロールしないように固定 */
            }
            .landscape-enforcer {
              transform: rotate(90deg);
              transform-origin: bottom left; /* 左下を軸に回転 */
              
              /* 回転後の位置とサイズを調整 */
              position: absolute;
              top: -100vw; /* viewportの幅の分だけ上に移動 */
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
          {/* レイアウト制御用のカスタムクラスを適用 */}
          <div className="grid gap-6 wait-status-grid">
            <LeftCards
              currentNumber={waitingStatus.currentNumber}
              calledNumbers={waitingStatus.calledNumbers}
              onHoldNumbers={waitingStatus.onHoldNumbers}
            />
            <RightArea
              waitingNumbers={waitingStatus.waitingNumbers}
              myTicketNumber={myTicketNumber}
            />
          </div>
        </main>
      </div>
    </>
  );
}

