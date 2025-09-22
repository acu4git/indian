import { createOrder } from '@/api/client';
import * as C from '@/app/FlavorGame/consts';
import Link from 'next/link';

export default async function MenuDetailPage({ 
    params, 
    searchParams 
}: { 
    // 非同期処理はNext.js15ではPromiseで順番に受け取る
    params: Promise<{ id: string }>, 
    searchParams: Promise<{ name?: string, description?: string }> 
}) {
    // paramsとsearchParamsを非同期で取得
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    
    // 商品IDが存在しない場合はエラーを表示
    if (!resolvedParams.id) {
        return (
            <div className="text-white min-h-screen bg-gray-800 flex items-center justify-center">
                カレー味の注文は店にお尋ねください。
            </div>
        );
    }

    // サーバーサイドで直接注文処理を実行
    let orderSuccess = false;
    let error = null;
    let orderId = null;

    try {
        const data = await createOrder(C.STORE_ID, resolvedParams.id);
        console.log('注文レスポンス:', data); // デバッグ用
        orderSuccess = true;
        orderId = data.id;
        console.log('取得したorderId:', orderId); // デバッグ用
    } catch (e) {
        console.error('注文エラー:', e); // デバッグ用
        error = e instanceof Error ? e.message : "不明なエラーが発生しました。";
    }
    
    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
            <div className="border-2 border-cyan-400 p-8 rounded-lg shadow-lg shadow-cyan-400/20 text-center">
                {error ? (
                    <>
                        <h1 className="text-4xl font-bold mb-4 text-red-400">注文でエラーが発生しました</h1>
                        <p className="text-xl mb-6">{error}</p>
                        <p className="text-lg">ギクギクなカレー味</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-4">勝手に注文しました！</h1>
                        <p className="text-xl mb-6">
                            {resolvedSearchParams.name || '商品名不明'}
                        </p>
                        
                        {/* 注文成功時に注文詳細へのリンクを表示 */}
                        {orderSuccess && orderId ? (
                            <Link 
                                // href={`/Order/${C.STORE_ID}/${orderId}`}
                                href={`/terms?storeId=${C.STORE_ID}&orderId=${orderId}`}
                                className="inline-block mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                さらに注文したい (ID: {orderId})
                            </Link>
                        ) : (
                            <p className="text-red-400">注文IDが取得できませんでした</p>
                        )}
                        <div className="my-8 bg-white text-black p-4 rounded-md max-w-xs mx-auto">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">セットを選択</h3>
                            <div className="flex justify-around">
                                {['4袋', '8袋', '36袋'].map((set) => (
                                    <div key={set} className="flex flex-col items-center space-y-2">
                                        <label htmlFor={`set-${set}`} className="text-sm">{set}セット</label>
                                        <input type="radio" name="product-set" id={`set-${set}`} className="w-5 h-5" />
                                        <div className="w-4 h-4 border border-black rounded-full" title="在庫状況"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="absolute bottom-5 right-5 z-10 px-8 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
                            確定
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
