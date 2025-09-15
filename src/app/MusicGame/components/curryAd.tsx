'use client';
import * as C from '../consts';

type CurryAdProps = {
    adY: number;
    adOpacity: number;
};

// カレー広告コンポーネント
export const CurryAd = ({ adY, adOpacity }: CurryAdProps) => {
    return (
        <div className="absolute cursor-pointer" style={{ left: `${C.DEFAULT_LEFT - 220}px`, top: `${adY}px`, opacity: adOpacity }} onClick={() => window.open(C.AD_IMAGE_URL, '_blank')}>
            <img src={C.AD_IMAGE_URL} alt="Ad" width={C.AD_WIDTH} height={C.AD_HEIGHT} />
        </div>
    );
}
