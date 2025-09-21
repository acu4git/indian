import { ErrorCard } from '@/app/components/errorCard';
import { RightArea } from '@/app/Order/components/rightArea';
import { LeftCards } from '@/app/Order/components/leftCards';
import { fetchOrderById, type OrderResponse } from '@/api/client';

// --- Data Fetching Logic ---

// 各レーンの状態
export interface LaneStatus {
  currentNumber: number | null;
  calledNumbers: number[];
  onHoldNumbers: number[];
}

// ページ全体で使う待ち状況データ
export interface WaitingStatus {
  dineIn: LaneStatus;
  takeout: LaneStatus;
  waitingNumbers: number[]; // RightAreaで使う共通の待機リスト
}

/**
 * ダミーの待ち状況データを返す非同期関数
 * イートインとテイクアウトのデータを分けて生成するように変更
 */
async function fetchWaitingStatus(storeId: string): Promise<WaitingStatus> {
  console.log("Fetching DUMMY waiting status for store:", storeId);
  return {
    // イートイン用のデータ
    dineIn: {
      currentNumber: 486,
      calledNumbers: [489, 488, 487].sort((a, b) => b - a),
      onHoldNumbers: [465, 7292],
    },
    // テイクアウト用のデータ
    takeout: {
      currentNumber: 105,
      calledNumbers: [108, 107, 106].sort((a, b) => b - a),
      onHoldNumbers: [99],
    },
    // 右側エリアで表示する共通の待機番号リスト
    waitingNumbers: [460, 463, 466, 471, 473, 482, 483, 484, 485, 109, 110],
  };
}

// データ調整用の関数
function adjustDataForOrderStatus(
  waitingStatus: WaitingStatus,
  orderStatus: string,
  myTicketNumber: number
) {
  const baseWaitingNumbers = [...waitingStatus.waitingNumbers];
  
  if (orderStatus === 'pending') {
    // pendingの場合、ランダムでどちらかのcalledNumbersにmyTicketNumberを追加
    if (Math.random() < 0.5) {
      const modifiedMobileData = { ...waitingStatus.dineIn };
      const indexToReplace = Math.floor(Math.random() * modifiedMobileData.calledNumbers.length);
      modifiedMobileData.calledNumbers = modifiedMobileData.calledNumbers.map((num, idx) => 
        idx === indexToReplace ? myTicketNumber : num
      );
      modifiedMobileData.calledNumbers = [...new Set(modifiedMobileData.calledNumbers)];
      
      return {
        mobileReservationData: modifiedMobileData,
        verbalReservationData: { ...waitingStatus.takeout },
        currentNumber: waitingStatus.dineIn.currentNumber,
        waitingNumbers: baseWaitingNumbers
      };
    } else {
      const modifiedVerbalData = { ...waitingStatus.takeout };
      const indexToReplace = Math.floor(Math.random() * modifiedVerbalData.calledNumbers.length);
      modifiedVerbalData.calledNumbers = modifiedVerbalData.calledNumbers.map((num, idx) => 
        idx === indexToReplace ? myTicketNumber : num
      );
      modifiedVerbalData.calledNumbers = [...new Set(modifiedVerbalData.calledNumbers)];
      
      return {
        mobileReservationData: { ...waitingStatus.dineIn },
        verbalReservationData: modifiedVerbalData,
        currentNumber: waitingStatus.dineIn.currentNumber,
        waitingNumbers: baseWaitingNumbers
      };
    }
  } else if (orderStatus === 'waitingPickup') {
    return {
      mobileReservationData: { ...waitingStatus.dineIn },
      verbalReservationData: { ...waitingStatus.takeout },
      currentNumber: waitingStatus.takeout.currentNumber,
      waitingNumbers: [...new Set([...baseWaitingNumbers, myTicketNumber])].sort(() => Math.random() - 0.5)
    };
  } else if (orderStatus === 'completed') {
    return {
      mobileReservationData: { ...waitingStatus.dineIn },
      verbalReservationData: { ...waitingStatus.takeout },
      currentNumber: myTicketNumber,
      waitingNumbers: baseWaitingNumbers
    };
  } else {
    // デフォルト
    return {
      mobileReservationData: { ...waitingStatus.dineIn },
      verbalReservationData: { ...waitingStatus.takeout },
      currentNumber: null,
      waitingNumbers: baseWaitingNumbers
    };
  }
}

// --- Server Component ---

export default async function OrderPage({
  params: paramsPromise,
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
  else{
    console.log("[Debug] Fetched order data:", orderResult.value); // 取得した注文データをログに出す
  }

  const order: OrderResponse = orderResult.value;
  const waitingStatus: WaitingStatus = waitingStatusResult.value;

  const myTicketNumber = order.order_number ?? parseInt(orderId, 10);
  const orderStatus = order.status; // 注文のステータスを取得

  // 使用箇所
  // 'waitingPickup', 'completed'は現状orderStatusの引数を直接文字列に変えて試してください
  const adjustedData = adjustDataForOrderStatus(waitingStatus, 'completed', myTicketNumber);

  const mobileReservationDataForLeftCards = adjustedData.mobileReservationData;
  const verbalReservationDataForLeftCards = adjustedData.verbalReservationData;
  const currentNumberForLeftCards = adjustedData.currentNumber;
  const waitingNumbersForRightArea = adjustedData.waitingNumbers;

  return (
    <>
      <style>
        {`
          .wait-status-grid {
            grid-template-columns: 1fr;
          }
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
          @media (orientation: portrait) and (max-width: 767px) {
            body { overflow: hidden; }
            .landscape-enforcer {
              transform: rotate(90deg);
              transform-origin: bottom left;
              position: absolute;
              top: -100vw;
              left: 0;
              width: 100vh;
              height: 100vw;
              overflow-x: hidden;
              overflow-y: auto;
            }
          }
        `}
      </style>

      <div className="landscape-enforcer">
        <main className="mx-auto max-w-4xl p-4 font-sans bg-gray-50 min-h-screen">
          <div className="grid gap-6 wait-status-grid">
            {/* LeftCardsに調整済みのデータを渡す */}
            <LeftCards
              mobileReservationData={mobileReservationDataForLeftCards}
              verbalReservationData={verbalReservationDataForLeftCards}
              myTicketNumber={currentNumberForLeftCards} // completedの場合のみここにmyTicketNumberが入る
              status={orderStatus}
            />
            {/* RightAreaに調整済みのデータを渡す */}
            <RightArea
              waitingNumbers={waitingNumbersForRightArea}
              myTicketNumber={myTicketNumber}
              status={orderStatus}
            />
          </div>
        </main>
      </div>
    </>
  );
}
