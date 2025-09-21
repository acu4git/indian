import { ErrorCard } from '@/app/components/errorCard';
import { RightArea } from '@/app/Order/components/rightArea';
import { LeftCards } from '@/app/Order/components/leftCards';
import { fetchOrderById, type OrderResponse } from '@/api/client';

// --- Data Fetching Logic ---

export interface LaneStatus {
  currentNumber: number | null;
  calledNumbers: number[];
}

export interface WaitingStatus {
  mobile: LaneStatus;
  takeout: LaneStatus;
  waitingNumbers: number[];
}

async function fetchWaitingStatus(storeId: string): Promise<WaitingStatus> {
  console.log("Fetching DUMMY waiting status for store:", storeId);
  return {
    mobile: {
      currentNumber: 22,
      calledNumbers: [35, 11, 66, 13].sort((a, b) => b - a),
    },
    takeout: {
      currentNumber: 1,
      calledNumbers: [67, 12, 20, 4].sort((a, b) => b - a),
    },
    waitingNumbers: [9, 3, 33, 17, 15, 21, 28, 99, 68, 54, 40],
  };
}

function adjustDataForOrderStatus(
  waitingStatus: WaitingStatus,
  orderStatus: string,
  myTicketNumber: number
) {
  const baseWaitingNumbers = [...waitingStatus.waitingNumbers];

  if (orderStatus === 'pending') {
    if (Math.random() < 0.5) {
      const modifiedMobileData = { ...waitingStatus.mobile };
      const indexToReplace = Math.floor(Math.random() * modifiedMobileData.calledNumbers.length);
      modifiedMobileData.calledNumbers = modifiedMobileData.calledNumbers.map((num, idx) =>
        idx === indexToReplace ? myTicketNumber : num
      );
      modifiedMobileData.calledNumbers = [...new Set(modifiedMobileData.calledNumbers)];
      return {
        mobileReservationData: modifiedMobileData,
        verbalReservationData: { ...waitingStatus.takeout },
        currentNumber: waitingStatus.mobile.currentNumber,
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
  } else {
    console.log("[Debug] Fetched order data:", orderResult.value);
  }

  const order: OrderResponse = orderResult.value;
  const waitingStatus: WaitingStatus = waitingStatusResult.value;

  const myTicketNumber = order.order_number ?? parseInt(orderId, 10);
  const orderStatus = order.status;

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
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          @media (min-width: 768px) {
            .wait-status-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }

          /* Landscape Enforcer */
          .landscape-enforcer {
            transform: rotate(90deg);
            transform-origin: bottom left;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vh; /* Android向けに調整 */
            height: 100vw; /* Android向けに調整 */
            overflow-x: hidden;
            overflow-y: auto;
            z-index: 1000;
            background: #f9fafb;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .landscape-enforcer main {
            min-height: 100%;
            width: 100%;
            max-width: 100%;
            padding: 1rem;
            box-sizing: border-box;
          }
        `}
      </style>

      <div className="landscape-enforcer">
        <main className="mx-auto max-w-4xl p-4 font-sans bg-gray-50">
          <div className="grid gap-6 wait-status-grid">
            <LeftCards
              mobileReservationData={mobileReservationDataForLeftCards}
              verbalReservationData={verbalReservationDataForLeftCards}
              myTicketNumber={currentNumberForLeftCards}
              status={orderStatus}
            />
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
