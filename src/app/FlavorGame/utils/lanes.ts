import * as C from '@/app/FlavorGame/consts';

export const drawLanes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let i = 0; i < C.LANE_LEFTS.length; i++) {
        ctx.strokeRect(C.LANE_LEFTS[i], 0, C.LANE_WIDTH, C.CANVAS_HEIGHT);
    }
    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(C.DEFAULT_LEFT, C.BUTTONS_TOP);
    ctx.lineTo(C.DEFAULT_LEFT + 4 * C.LANE_WIDTH, C.BUTTONS_TOP);
    ctx.stroke();
};
