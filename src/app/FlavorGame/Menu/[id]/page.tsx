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

    // --- Bad UI Logic ---
    const badText = (resolvedSearchParams.name || '') 
                  + ` は きっとおそらく${resolvedSearchParams.description}です...たぶん。`;
    
    let badTexts = [badText, '', ''];
    // テキストをランダムな2点で分割して3つの部分に分ける
    if (badText.length > 2) {
        let p1 = Math.floor(Math.random() * (badText.length - 1)) + 1;
        let p2 = Math.floor(Math.random() * (badText.length - 1)) + 1;
        
        while (p1 === p2) {
            p2 = Math.floor(Math.random() * (badText.length - 1)) + 1;
        }

        if (p1 > p2) [p1, p2] = [p2, p1]; // p1がp2より小さくなるように入れ替え

        badTexts = [
            badText.slice(0, p1),
            badText.slice(p1, p2),
            badText.slice(p2)
        ];
    }

    // より大きなインデントをランダムに生成
    const lineBreaks = [Math.floor(Math.random() * 300), Math.floor(Math.random() * 300), Math.floor(Math.random() * 300)];


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
        <div className="min-h-screen bg-amber-900 text-cyan-300 flex flex-col items-center justify-center p-4 font-serif relative overflow-hidden">
            <div className="border-4 border-dashed border-purple-500 bg-teal-800 p-8 rounded-xl shadow-lg shadow-purple-500/50 text-center max-w-2xl w-full">
                {error ? (
                    <>
                        <h1 className="text-4xl font-bold mb-4 text-red-400 animate-pulse">注文でエラーが発生しました</h1>
                        <p className="text-xl mb-6">{error}</p>
                        <p className="text-lg">ギクギクなカレー味</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-4 text-lime-400">勝手に注文しました！</h1>
                        
                        {/* --- Bad UI Element: Mismatch Content & Messy Indentation --- */}
                        <div className="text-xl mb-2 text-pink-300 text-left font-extrabold text-pink-500 overflow-hidden">
                            <p style={{ paddingLeft: `${lineBreaks[0]}px` }}>
                                {badTexts[0]}
                            </p>
                            <p style={{ paddingLeft: `${lineBreaks[1]}px` }}>
                                {badTexts[1]}
                            </p>
                            <p style={{ paddingLeft: `${lineBreaks[2]}px` }}>
                                {badTexts[2]}
                            </p>
                        </div>

                        {/* --- Bad UI Element: Confusing Table Layout --- */}
                        <div className="my-8 bg-white text-black p-4 rounded-md max-w-xs mx-auto border border-gray-300">
                            <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-800">福神漬もおすすめです</h3>
                            </div>
                            <div>
                                {['4袋', '8袋', '36袋'].map((set) => (
                                    <div key={set} className="flex items-center justify-between py-2 border-b border-gray-300 last:border-b-0">
                                        {/* ラベルも「〇〇辛」のようにすると、より意味が分からなくなります */}
                                        <label htmlFor={`set-${set}`} className="text-sm">{set}</label>
                                        <div className="flex flex-col items-center">
                                            <input type="radio" name="product-set" id={`set-${set}`} className="w-5 h-5" />
                                            {/* このインジケーターが何なのか、誰にも分からない */}
                                            <div className="w-4 h-4 border border-black rounded-full mt-1" title="謎のインジケーター"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                                   
                        {/* --- Bad UI Element: Misleading Buttons --- */}
                        <div className="mt-8 flex justify-between items-center w-full">
                            {orderSuccess && orderId ? (
                                <Link
                                    href={`/terms?storeId=${C.STORE_ID}&orderId=${orderId}`}
                                >
                                    0r4rl4-{orderId}
                                </Link>
                            ) : (
                                <p className="text-red-400">注文IDが取得できませんでした</p>
                            )}

                            <div className="flex items-center space-x-4">
                               <button className="px-8 py-4 bg-red-600 hover:bg-red-800 text-white font-bold rounded-full shadow-lg">
                                    会言十
                                </button>
                                <button className="px-8 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
                                    キャソセル
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
