import { SuccessCard } from '@/app/Order/components/successCard';
import { ErrorCard } from '@/app/components/errorCard';
import { fetchOrderById, type OrderResponse } from '@/api/client';

// Server Componentでは async/await が使える
export default async function OrderPage({
  params,
}: {
  params: Promise<{ storeId: string; orderId: string }>;
}) {
  // paramsを await で取得
  const { storeId, orderId } = await params;

  // パラメータの検証
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

  // Server Component内で直接APIを呼び出し
  let order: OrderResponse | null = null;
  let error: string | null = null;

  try {
    order = await fetchOrderById(storeId, orderId);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  // エラーの場合
  if (error) {
    return (
      <main className="mx-auto max-w-sm p-4">
        <ErrorCard title="注文情報を取得できませんでした" message={error} />
      </main>
    );
  }

  // 成功の場合
  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="text-2xl font-bold text-center">ご注文ありがとうございます</h1>
      {order && <SuccessCard order={order} />}
    </main>
  );
}