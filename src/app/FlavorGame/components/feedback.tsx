'use client';
import * as C from '../consts';

type FeedbackProps = {
    comboCount: number;
    judgeResult: string;
};

// フィードバックコンポーネント
export const Feedback = ({ comboCount, judgeResult }: FeedbackProps) => {
    return (
        <div>
            <div className="absolute text-4xl font-mono font-bold text-white" style={{ left: `${C.DEFAULT_LEFT + C.LANE_WIDTH}px`, top: `${C.CANVAS_HEIGHT / 2}px`, transform: 'translateY(-50%)' }}>
                COMBO<br/>{String(comboCount).padStart(4, '0')}
            </div>
            <div className="absolute text-3xl font-mono font-bold text-yellow-400" style={{ left: `${C.DEFAULT_LEFT + C.LANE_WIDTH * 1.5}px`, top: `${C.BUTTONS_TOP - 60}px` }}>
                {judgeResult}
            </div>
        </div>
    );
}
