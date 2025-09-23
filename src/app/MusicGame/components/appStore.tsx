import Image from "next/image";
type appStoreProps = {
    showAd: boolean;
    closeAd: () => void;
};

export const AppStore = ({ showAd, closeAd }: appStoreProps) => {
    return (
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-end transition-transform duration-500 ${showAd ? 'translate-y-0' : 'translate-y-full'}`}
            style={{
              width: '100dvw', // 動的ビューポート高さ（モダンブラウザ用）
              height: '100dvh', // 動的ビューポート高さ（モダンブラウザ用）
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999
            }}
          >
            <div 
              className="w-full bg-gray-900 text-white rounded-t-2xl p-6 shadow-2xl transform transition-transform duration-500"
              style={{
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch' // iOS用のスムーズスクロール
              }}
            >
              {/* 完了ボタン */}
              <div className="flex justify-end mb-4">
                <button 
                  onClick={closeAd}
                  className="text-blue-400 text-lg font-medium"
                >
                  完了
                </button>
              </div>
              
              {/* アプリアイコンとタイトル部分 */}
              <div className="flex items-center mb-4">
                {/* アプリアイコン（黒い四角で代替） */}
                <div className="w-16 h-16 bg-black rounded-2xl mr-4 flex-shrink-0">
                  {/* ここに実際の画像を入れる場合は以下のように */}
                  <Image src="/game2.png" alt="App Icon" width={64} height={64} />
                </div>
                
                {/* タイトルとサブタイトル */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">Shari Carry: 次世代の音ゲー</h3>
                  <p className="text-gray-400 text-sm">ノーツと共に日常にスパイスと新鮮さを叩き込め！</p>
                </div>
                
                {/* 入手ボタン */}
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium ml-4">
                  人手
                </button>
                
                {/* シェアボタン */}
                <button className="ml-3 p-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
              
              {/* 評価・年齢・ランキング情報 */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">132万件の評価</p>
                  <p className="text-2xl font-bold">0.3</p>
                  <div className="flex text-yellow-400 text-sm">
                    ★☆☆☆☆
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">年齢</p>
                  <p className="text-2xl font-bold">0+</p>
                  <p className="text-gray-400 text-xs">歳</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">ランキング</p>
                  <p className="text-2xl font-bold">#1</p>
                  <p className="text-gray-400 text-xs">フード</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">デベロッパー</p>
                  <p className="text-lg font-bold">S</p>
                  <p className="text-gray-400 text-xs">SHR CRR</p>
                </div>
              </div>
              
              {/* 特徴説明部分 */}
              <div className="flex space-x-4 mb-4">
                <div className="bg-teal-400 rounded-xl p-4 flex-1">
                  <p className="text-black font-semibold text-sm mb-2">ノーツをとにかく叩いて</p>
                  <p className="text-black font-semibold text-sm">コンボと命を繋げ！</p>
                  
                  {/* 画像コンテナ */}
                  <div className="w-full h-32 bg-black rounded-lg mt-3 overflow-hidden flex items-center justify-center">
                    <Image 
                      src="/game2.png" 
                      alt="Game Screenshot" 
                      width={200} 
                      height={128} 
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 flex-1">
                  <p className="text-white font-semibold text-sm mb-2">色付きのノーツを叩いたら</p>
                  <p className="text-white font-semibold text-sm">その味を楽しむしかない！</p>
                  
                  {/* 画像コンテナ */}
                  <div className="w-full h-32 bg-black rounded-lg mt-3 overflow-hidden flex items-center justify-center">
                    <Image 
                      src="/game2.png" 
                      alt="Game Screenshot" 
                      width={200} 
                      height={128} 
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              {/* アプリ内課金情報 */}
              <p className="text-gray-400 text-xs text-center">アプリ内課金</p>
            </div>
          </div>
    );
}
