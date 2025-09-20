'use client';
import { useEffect, useState } from 'react';

type CurryAdProps = {
    isPlaying: boolean;
    left: number;
    top: number;
};

// カレー広告コンポーネント
export const CurryAd = ({ isPlaying, left, top }: CurryAdProps) => {
    // 広告に関するパラメータ
    const AD_WIDTH = 700;
    const AD_HEIGHT = 100;
    const AD_SPEED = 5.0;
    const AD_IMAGE_URL = `https://placehold.co/${AD_WIDTH}x${AD_HEIGHT}/FFD700/000000?text=Curry+Ad`;

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

    return (
        <div className="absolute cursor-pointer" style={{ left: `${left}px`, top: `${adY}px`, opacity: adOpacity }} onClick={() => window.open(AD_IMAGE_URL, '_blank')}>
            <img src={AD_IMAGE_URL} alt="Ad" width={AD_WIDTH} height={AD_HEIGHT} />
        </div>
    );
}
