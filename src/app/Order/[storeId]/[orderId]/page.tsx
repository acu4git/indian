import { ErrorCard } from '@/app/components/errorCard';
import { RightArea } from '@/app/Order/components/rightArea';
import { LeftCards } from '@/app/Order/components/leftCards';
import { fetchOrderById, type OrderResponse } from '@/api/client';

// --- Data Fetching Logic ---

// 各レーンの状態
export interface LaneStatus {
  currentNumber: number | null;
  calledNumbers: number[];
}

// ページ全体で使う待ち状況データ
export interface WaitingStatus {
  mobile: LaneStatus;
  takeout: LaneStatus;
  waitingNumbers: number[]; // RightAreaで使う共通の待機リスト
}

/**
 * myTicketNumberに近いランダムなダミーデータを生成する関数
 * 券もそうだが、券以外でも被らせたくない
 * 19個を券の数字連続周辺で生成する
 * badUIだから券の大小関係なく、どの数字をどこに置くかはランダム
 * 券だけはもちろんstatusに応じて場所を分ける
 */
function generateWaitingStatus(storeId: string, myTicketNumber: number): WaitingStatus {
  console.log("Generating DUMMY waiting status for store:", storeId, "around ticket:", myTicketNumber);

  // myTicketNumberを除外したユニークな19個の数字を生成
  const allUniqueNumbers = new Set<number>();
  const spread = 20; // myTicketNumber周辺の範囲
  
  // myTicketNumberを中心とした範囲でユニークな19個の数字を生成
  while (allUniqueNumbers.size < 19) {
    const randomOffset = Math.floor((Math.random() - 0.5) * 2 * spread);
    const candidate = myTicketNumber + randomOffset;
    
    // 正の数で、myTicketNumberでない場合のみ追加
    if (candidate > 0 && candidate !== myTicketNumber) {
      allUniqueNumbers.add(candidate);
    }
  }
  
  // 生成した19個の数字を配列に変換してシャッフル
  const shuffledNumbers = Array.from(allUniqueNumbers).sort(() => Math.random() - 0.5);
  
  // 固定数で振り分け
  // 将来的にモバイルと口頭で分けるのもありだが、今は共通にする
  const calledNumbers = shuffledNumbers.slice(0, 8);  // 最初の8個
  const currentNumber = shuffledNumbers.slice(8, 9);  // 1個
  const waitingNumbers = shuffledNumbers.slice(9, 19); // 残りの10個
  
  return {
    mobile: {
      currentNumber: currentNumber[0],
      calledNumbers: calledNumbers.slice(0, 4).sort((a, b) => b - a),
    },
    takeout: {
      currentNumber: currentNumber[0],
      calledNumbers: calledNumbers.slice(4, 8).sort((a, b) => b - a),
    },
    waitingNumbers: waitingNumbers.sort((a, b) => a - b),
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
      const modifiedMobileData = { ...waitingStatus.mobile };
      modifiedMobileData.calledNumbers = [...new Set([myTicketNumber, ...modifiedMobileData.calledNumbers.slice(0, 3)])];
      
      return {
        mobileReservationData: modifiedMobileData,
        verbalReservationData: { ...waitingStatus.takeout },
        currentNumber: waitingStatus.mobile.currentNumber,
        waitingNumbers: baseWaitingNumbers
      };
    } else {
      const modifiedVerbalData = { ...waitingStatus.takeout };
      modifiedVerbalData.calledNumbers = [...new Set([myTicketNumber, ...modifiedVerbalData.calledNumbers.slice(0, 3)])];
      
      return {
        mobileReservationData: { ...waitingStatus.mobile },
        verbalReservationData: modifiedVerbalData,
        currentNumber: waitingStatus.mobile.currentNumber,
        waitingNumbers: baseWaitingNumbers
      };
    }
  } else if (orderStatus === 'waitingPickup') {
    return {
      mobileReservationData: { ...waitingStatus.mobile },
      verbalReservationData: { ...waitingStatus.takeout },
      currentNumber: waitingStatus.takeout.currentNumber,
      waitingNumbers: [...new Set([...baseWaitingNumbers, myTicketNumber])].sort(() => Math.random() - 0.5)
    };
  } else if (orderStatus === 'completed') {
    return {
      mobileReservationData: { ...waitingStatus.mobile },
      verbalReservationData: { ...waitingStatus.takeout },
      currentNumber: myTicketNumber,
      waitingNumbers: baseWaitingNumbers
    };
  } else {
    // デフォルト
    return {
      mobileReservationData: { ...waitingStatus.mobile },
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

  // --- データ取得の順番を変更 ---
  // 1. 最初に注文情報を取得して、myTicketNumberを確定させる
  try {
    const order: OrderResponse = await fetchOrderById(storeId, orderId);
    console.log("[Debug] Fetched order data:", order);

    const myTicketNumber = order.order_number ?? parseInt(orderId, 10);
    const orderStatus = order.status;

    // 2. myTicketNumberを使って、それに近いダミーの待ち状況データを生成
    const waitingStatus: WaitingStatus = generateWaitingStatus(storeId, myTicketNumber);
    
    // 'waitingPickup', 'completed'は現状orderStatusの引数を直接文字列に変えて試してください
    const adjustedData = adjustDataForOrderStatus(waitingStatus, orderStatus, myTicketNumber);

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
              html, body { 
                overflow: hidden; 
                margin: 0;
                padding: 0;
                height: 100%;
              }
              .landscape-enforcer {
                transform: rotate(90deg);
                transform-origin: bottom left;
                position: fixed;
                top: -100vw;
                left: 0;
                width: 100vh;
                height: 100vw;
                overflow-x: hidden;
                overflow-y: scroll;
                z-index: 1000;
                background: #f9fafb;
              }
              .landscape-enforcer main {
                min-height: calc(100vh + 2rem);
                width: 100%;
                padding: 1rem;
                box-sizing: border-box;
              }
              .landscape-enforcer .wait-status-grid {
                min-height: calc(100vh - 2rem);
                gap: 1.5rem;
              }
            }
          `}
        </style>

        <div className="landscape-enforcer">
          <main className="mx-auto max-w-4xl p-4 font-sans bg-gray-50 min-h-screen">
            <div className="grid gap-6 wait-status-grid">
              <LeftCards
                mobileReservationData={mobileReservationDataForLeftCards}
                verbalReservationData={verbalReservationDataForLeftCards}
                myTicketNumber={currentNumberForLeftCards}
              />
              <RightArea
                waitingNumbers={waitingNumbersForRightArea}
              />
            </div>
          </main>
        </div>
      </>
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return (
      <main className="mx-auto max-w-sm p-4">
        <ErrorCard title="情報の取得に失敗しました" message={errorMessage} />
      </main>
    );
  }
}
