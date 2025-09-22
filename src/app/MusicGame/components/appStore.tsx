type appStoreProps = {
    showAd: boolean;
    closeAd: () => void;
};

export const AppStore = ({ showAd, closeAd }: appStoreProps) => {
    return (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-end transition-transform duration-500 ${showAd ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="w-full bg-gray-900 text-white rounded-t-2xl p-6 shadow-2xl transform transition-transform duration-500">
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
                  {/* <img src="/app-icon.png" alt="App Icon" className="w-full h-full rounded-2xl" /> */}
                </div>
                
                {/* タイトルとサブタイトル */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">Amazon Music: 音楽やポッドキャスト</h3>
                  <p className="text-gray-400 text-sm">1億曲が聴き放題</p>
                </div>
                
                {/* 入手ボタン */}
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium ml-4">
                  入手
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
                  <p className="text-2xl font-bold">4.3</p>
                  <div className="flex text-yellow-400 text-sm">
                    ★★★★☆
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">年齢</p>
                  <p className="text-2xl font-bold">12+</p>
                  <p className="text-gray-400 text-xs">歳</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">ランキング</p>
                  <p className="text-2xl font-bold">#3</p>
                  <p className="text-gray-400 text-xs">ミュージック</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">デベ</p>
                  <p className="text-lg font-bold">🅰️</p>
                  <p className="text-gray-400 text-xs">AMZN M</p>
                </div>
              </div>
              
              {/* 特徴説明部分 */}
              <div className="flex space-x-4 mb-4">
                <div className="bg-teal-400 rounded-xl p-4 flex-1">
                  <p className="text-black font-semibold text-sm mb-2">オーディオブックが</p>
                  <p className="text-black font-semibold text-sm">毎月1冊聴けるようになりました</p>
                  
                  {/* 黒い四角（画像の代替） */}
                  <div className="w-full h-32 bg-black rounded-lg mt-3">
                    {/* ここにスクリーンショット画像を入れる場合 */}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 flex-1">
                  <p className="text-white font-semibold text-sm mb-2">1億曲以上が</p>
                  <p className="text-white font-semibold text-sm">広告なしで聴き放題</p>
                  
                  {/* 黒い四角（画像の代替） */}
                  <div className="w-full h-32 bg-black rounded-lg mt-3">
                    {/* ここにスクリーンショット画像を入れる場合 */}
                  </div>
                </div>
              </div>
              
              {/* アプリ内課金情報 */}
              <p className="text-gray-400 text-xs text-center">アプリ内課金</p>
            </div>
          </div>
    );
}
