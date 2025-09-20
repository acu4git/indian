'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouterをインポート

type CurryAdProps = {
    isPlaying: boolean;
    left: number;
    top: number;
};

// カレー広告コンポーネント
export const CurryAd = ({ isPlaying, left, top }: CurryAdProps) => {
    const router = useRouter(); // useRouterフックを呼び出し

    // 広告に関するパラメータ
    const AD_WIDTH = 700;
    const AD_HEIGHT = 100;
    const AD_SPEED = 5.0;
    // 表示用の画像URL
    const AD_IMAGE_URL = `https://placehold.co/${AD_WIDTH}x${AD_HEIGHT}/FFD700/000000?text=Curry+Ad`;
    // 再生するYouTube動画のID (限定公開の動画IDなどを設定)
    const YOUTUBE_VIDEO_ID = 'aLpcjQDiBDM'; // ここに再生したいYouTube動画のIDを設定してください
    // ゲームページのURL (広告から戻るため)
    const GAME_PAGE_URL = '/FlavorGame';

    // 広告の位置と透明度
    const [adY, setAdY] = useState(AD_HEIGHT);
    const adOpacity = Math.min(1, Math.max(0, (adY + AD_HEIGHT) * 1.7 / top));

    // 広告アニメーション
    useEffect(() => {
        let adInterval: NodeJS.Timeout | null = null;
        if (isPlaying) {
            adInterval = setInterval(() => {
                setAdY(prevY => (prevY > top ? -AD_HEIGHT : prevY + AD_SPEED));
            }, 1000 / 60);
        }
        return () => { if (adInterval) clearInterval(adInterval); };
    }, [isPlaying]);

    const handleAdClick = () => {
        // 広告ページに遷移する
        // videoIdと戻り先のURLをクエリパラメータとして渡す
        const adUrl = `/Ad?videoId=${YOUTUBE_VIDEO_ID}&returnUrl=${encodeURIComponent(GAME_PAGE_URL)}`;
        router.push(adUrl);
    };

    return (
        <div 
            className="absolute cursor-pointer" 
            style={{ 
                left: `${left}px`, 
                top: `${adY}px`, 
                opacity: adOpacity 
            }} 
            onClick={handleAdClick} // 変更: window.openからhandleAdClickへ
        >
            <img src={AD_IMAGE_URL} alt="Ad" width={AD_WIDTH} height={AD_HEIGHT} />
        </div>
    );
}
