type SkipToAdProps = {
  skipTimer: number;
  setSkipTimer: React.Dispatch<React.SetStateAction<number>>;
  setRemountKey: React.Dispatch<React.SetStateAction<number>>;
};

export const SkipToAd = ( {skipTimer, setSkipTimer, setRemountKey} : SkipToAdProps) => {

    const handleRestart = () => {
        // タイマーを5秒にリセット
        setSkipTimer(5);
        // iframeのkeyを変更して強制的に再マウント（動画をリスタート）させる
        setRemountKey(prevKey => prevKey + 1);
    };
    return (
        <div className="absolute bottom-4 right-4 z-10">
            {skipTimer === 0 ? (
                <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-black bg-opacity-70 text-white rounded-md hover:bg-opacity-90 transition-all cursor-pointer"
                >
                    広告にスキップ
                </button>
                ) : (
                <div className="px-4 py-2 bg-black bg-opacity-70 text-white rounded-md">
                    {skipTimer > 0 ? `${skipTimer}秒後にスキップ` : 'スキップ'}
                </div>
            )}
        </div>
    )
}