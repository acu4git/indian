'use client';
import * as C from '@/app/FlavorGame/consts';
import { useEffect, useState } from 'react';

type CurryAdProps = {
    isPlaying: boolean;
};

// カレー広告コンポーネント
export const CurryAd = ({ isPlaying }: CurryAdProps) => {
    // 広告に関するパラメータ
    const AD_WIDTH = 700;
    const AD_HEIGHT = 70;
    const AD_SPEED = 5.0;
    const AD_IMAGE_URL = `https://placehold.co/${AD_WIDTH}x${AD_HEIGHT}/FFD700/000000?text=Curry+Ad`;

    // 広告の位置と透明度
    const [adY, setAdY] = useState(AD_HEIGHT);
    const adOpacity = Math.min(1, Math.max(0, (adY + AD_HEIGHT) * 1.7 / C.CANVAS_HEIGHT));

    // 広告アニメーション
    useEffect(() => {
        let adInterval: NodeJS.Timeout | null = null;
        if (isPlaying) {
            adInterval = setInterval(() => {
            setAdY(prevY => (prevY > C.CANVAS_HEIGHT ? -AD_HEIGHT : prevY + AD_SPEED));
            }, 1000 / 60);
        }
        return () => { if (adInterval) clearInterval(adInterval); };
    }, [isPlaying]);

    return (
        <div className="absolute cursor-pointer" style={{ left: `${C.DEFAULT_LEFT - 220}px`, top: `${adY}px`, opacity: adOpacity }} onClick={() => window.open(AD_IMAGE_URL, '_blank')}>
            <img src={AD_IMAGE_URL} alt="Ad" width={AD_WIDTH} height={AD_HEIGHT} />
        </div>
    );
}
