import { createOrder } from '@/api/client';
import * as C from '@/app/FlavorGame/consts';

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

    try {
        await createOrder(C.STORE_ID, resolvedParams.id);
        orderSuccess = true;
    } catch (e) {
        error = e instanceof Error ? e.message : "不明なエラーが発生しました。";
    }
    
    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
            <div className="border-2 border-cyan-400 p-8 rounded-lg shadow-lg shadow-cyan-400/20 text-center">
                {error ? (
                    <>
                        <h1 className="text-4xl font-bold mb-4 text-red-400">注文が完了しました！</h1>
                        <p className="text-xl">ギクギクなカレー味</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-4">注文が完了しました！</h1>
                        <p className="text-xl">
                            {resolvedSearchParams.name || '商品名不明'}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
