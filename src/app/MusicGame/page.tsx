'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
// 定数をまとめてインポート
import * as C from './consts';

export default function MusicGamePage() {
  // 音ゲーの描画による再レンダリングを避けるため、useRefで状態を管理
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const isKeysHitRef = useRef<boolean[]>([false, false, false, false]);
  const touchFeedbackRef = useRef<boolean[]>([false, false, false, false]);
  const gameLoopRef = useRef<number | null>(null);

  // ゲーム状態（UIに反映が必要なもの）
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(7);
  const [comboCount, setComboCount] = useState(0);
  const [maxComboCount, setMaxComboCount] = useState(0);
  const [judgeResult, setJudgeResult] = useState('');
  const [bestCount, setBestCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [poorCount, setPoorCount] = useState(0);
  const [showCombo, setShowCombo] = useState(true);
  const [showJudge, setShowJudge] = useState(true);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [adY, setAdY] = useState(-C.AD_HEIGHT);

  // 判定範囲の計算
  const getJudgeYBounds = useCallback(() => {
    return {
      BEST_Y_MIN: C.BUTTONS_TOP - speed * 8,
      BEST_Y_MAX: C.BUTTONS_TOP + speed * 8,
      GOOD_Y_MIN: C.BUTTONS_TOP - speed * 15,
      GOOD_Y_MAX: C.BUTTONS_TOP + speed * 15,
      MISS_Y_MIN: C.BUTTONS_TOP - speed * 25,
      MISS_Y_MAX: C.BUTTONS_TOP + speed * 25,
    };
  }, [speed]);

  // 判定処理
  const onBest = useCallback(() => {
    setJudgeResult(C.JUDGE_RESULTS.BEST);
    setBestCount(prev => prev + 1);
    setComboCount(prev => {
      const newCombo = prev + 1;
      setMaxComboCount(current => Math.max(current, newCombo));
      return newCombo;
    });
  }, []);

  const onGood = useCallback(() => {
    setJudgeResult(C.JUDGE_RESULTS.GOOD);
    setGoodCount(prev => prev + 1);
    setComboCount(prev => {
      const newCombo = prev + 1;
      setMaxComboCount(current => Math.max(current, newCombo));
      return newCombo;
    });
  }, []);

  const onMiss = useCallback(() => {
    setJudgeResult(C.JUDGE_RESULTS.MISS);
    setMissCount(prev => prev + 1);
    setComboCount(0);
  }, []);

  const onPoor = useCallback(() => {
    setJudgeResult(C.JUDGE_RESULTS.POOR);
    setPoorCount(prev => prev + 1);
    setComboCount(0);
  }, []);

  // 入力処理
  const onLaneHit = useCallback((index: number) => {
    if (!isPlaying || isKeysHitRef.current[index]) return;

    isKeysHitRef.current[index] = true;
    touchFeedbackRef.current[index] = true;
    setTimeout(() => { touchFeedbackRef.current[index] = false; }, 150);

    const { BEST_Y_MIN, BEST_Y_MAX, GOOD_Y_MIN, GOOD_Y_MAX, MISS_Y_MIN, MISS_Y_MAX } = getJudgeYBounds();

    const hitBlock = blocksRef.current.find(
      (block) =>
        !block.isHit &&
        block.x === C.LANE_LEFTS[index] &&
        block.y >= MISS_Y_MIN &&
        block.y <= MISS_Y_MAX
    );

    if (hitBlock) {
      hitBlock.isHit = true;
      if (hitBlock.y >= BEST_Y_MIN && hitBlock.y <= BEST_Y_MAX) onBest();
      else if (hitBlock.y >= GOOD_Y_MIN && hitBlock.y <= GOOD_Y_MAX) onGood();
      else onMiss();
    }
  }, [isPlaying, getJudgeYBounds, onBest, onGood, onMiss]);

  // キャンバス描画
  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
  }, []);

  const drawLanes = useCallback((ctx: CanvasRenderingContext2D) => {
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
  }, []);

  const drawBlocks = useCallback((ctx: CanvasRenderingContext2D) => {
    const { MISS_Y_MAX } = getJudgeYBounds();
    blocksRef.current.forEach((block) => {
      if (!block.isHit && !block.isPoor && block.y > MISS_Y_MAX) {
        block.isPoor = true;
        onPoor();
      }
      block.y += speed;
      if (block.y > -C.BLOCK_HEIGHT && block.y < C.CANVAS_HEIGHT + C.BLOCK_HEIGHT && !block.isHit && !block.isPoor) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(block.x, block.y - C.BLOCK_HEIGHT / 2, block.width, block.height);
      }
    });
  }, [getJudgeYBounds, onPoor, speed]);
  
  // ゲームループ
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx);
    drawLanes(ctx);
    drawBlocks(ctx);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [clearCanvas, drawLanes, drawBlocks]);

  // ゲーム開始
  const gameStart = useCallback(() => {
    blocksRef.current = [];
    setBestCount(0); setGoodCount(0); setMissCount(0); setPoorCount(0);
    setComboCount(0); setMaxComboCount(0); setJudgeResult('');
    setShowFinalResult(false); setGameStarted(true); setIsPlaying(true);
    
    const baseSpeed = (60 * C.PLAY_TIME_SECONDS) / C.TOTAL_NOTES;
    for (let i = 0; i < C.TOTAL_NOTES; i++) {
      const laneNum = Math.floor(Math.random() * 4);
      blocksRef.current.push({
        laneNumber: laneNum, noteID: i, x: C.LANE_LEFTS[laneNum],
        y: -(baseSpeed * speed * i) - C.NOTE_OFFSET_TIME_MS + C.BUTTONS_TOP,
        width: C.LANE_WIDTH, height: C.BLOCK_HEIGHT, isHit: false, isPoor: false,
      });
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    setTimeout(() => {
      setIsPlaying(false);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
      setShowFinalResult(true);
    }, 1000 * C.PLAY_TIME_SECONDS + 2000);
  }, [speed, gameLoop]);
  
  // キーボードイベント
  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (!isPlaying || ev.repeat) return;
      const laneIndex = C.KEY_MAPPINGS[ev.code];
      if (laneIndex !== undefined) onLaneHit(laneIndex);
    };
    const handleKeyUp = (ev: KeyboardEvent) => {
      const laneIndex = C.KEY_MAPPINGS[ev.code];
      if (laneIndex !== undefined) isKeysHitRef.current[laneIndex] = false;
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onLaneHit, isPlaying]);

  // タッチイベント
  const getTouchLane = useCallback((x: number) => {
    for (let i = 0; i < C.LANE_LEFTS.length; i++) {
      if (x >= C.LANE_LEFTS[i] && x <= C.LANE_LEFTS[i] + C.LANE_WIDTH) return i;
    }
    return -1;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleTouch = (ev: TouchEvent) => {
      if (!isPlaying) return;
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < ev.touches.length; i++) {
        const touch = ev.touches[i];
        const lane = getTouchLane(touch.clientX - rect.left);
        if (lane !== -1) onLaneHit(lane);
      }
    };
    const handleTouchEnd = (ev: TouchEvent) => {
      if (!isPlaying) return;
      ev.preventDefault();
      isKeysHitRef.current.fill(false);
    };
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchend', handleTouchEnd);
    return () => {
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPlaying, getTouchLane, onLaneHit]);

  // 広告アニメーション
  useEffect(() => {
    let adInterval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      adInterval = setInterval(() => {
        setAdY(prevY => (prevY > C.CANVAS_HEIGHT ? -C.AD_HEIGHT : prevY + C.AD_SPEED));
      }, 1000 / 60);
    }
    return () => { if (adInterval) clearInterval(adInterval); };
  }, [isPlaying]);

  // クリーンアップ
  useEffect(() => {
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, []);

  // 初期キャンバス描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        clearCanvas(ctx);
        drawLanes(ctx);
      }
    }
  }, [clearCanvas, drawLanes]);

  const finalResultText = `
    BEST: ${bestCount}
    GOOD: ${goodCount}
    MISS: ${missCount}
    POOR: ${poorCount}
    MAXCOMBO: ${maxComboCount}`;
  
  const adOpacity = Math.min(1, Math.max(0, (adY + C.AD_HEIGHT) * 1.7 / C.CANVAS_HEIGHT));

  return (
    <div className={`min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 ${isPlaying ? 'cursor-none' : ''}`}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={C.CANVAS_WIDTH}
          height={C.CANVAS_HEIGHT}
          className="border border-gray-600 bg-black touch-none"
          style={{ touchAction: 'none' }}
        />

        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold mb-8">MUSIC GAME</h1>
              <div className="space-y-2">
                <label className="flex items-center justify-center space-x-2">
                  <input type="checkbox" checked={showCombo} onChange={(e) => setShowCombo(e.target.checked)} className="w-4 h-4"/>
                  <span>コンボ表示</span>
                </label>
                <label className="flex items-center justify-center space-x-2">
                  <input type="checkbox" checked={showJudge} onChange={(e) => setShowJudge(e.target.checked)} className="w-4 h-4"/>
                  <span>判定表示</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="block">SPEED: {speed}</label>
                <input type="range" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-32" min="5" max="20"/>
              </div>
              <button onClick={gameStart} className="px-8 py-3 border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors text-xl">
                START GAME
              </button>
            </div>
          </div>
        )}

        {isPlaying && (
          <div className="absolute cursor-pointer" style={{ left: `${C.DEFAULT_LEFT - 220}px`, top: `${adY}px`, opacity: adOpacity }} onClick={() => window.open(C.AD_IMAGE_URL, '_blank')}>
            <img src={C.AD_IMAGE_URL} alt="Ad" width={C.AD_WIDTH} height={C.AD_HEIGHT} />
          </div>
        )}

        {isPlaying && showCombo && (
          <div className="absolute text-4xl font-mono font-bold text-white" style={{ left: `${C.DEFAULT_LEFT + C.LANE_WIDTH}px`, top: `${C.CANVAS_HEIGHT / 2}px`, transform: 'translateY(-50%)' }}>
            COMBO<br/>{String(comboCount).padStart(4, '0')}
          </div>
        )}

        {isPlaying && showJudge && judgeResult && (
          <div className="absolute text-3xl font-mono font-bold text-yellow-400" style={{ left: `${C.DEFAULT_LEFT + C.LANE_WIDTH * 1.5}px`, top: `${C.BUTTONS_TOP - 60}px` }}>
            {judgeResult}
          </div>
        )}

        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            {C.LANE_LEFTS.map((left, index) => (
              <div
                key={index}
                className={`absolute border-2 transition-all duration-150 ${ touchFeedbackRef.current[index] ? 'border-red-500 bg-red-500 bg-opacity-30' : 'border-yellow-500 opacity-30' }`}
                style={{ left: `${left}px`, top: `${C.BUTTONS_TOP - C.BLOCK_HEIGHT / 2}px`, width: `${C.LANE_WIDTH}px`, height: `${C.BLOCK_HEIGHT}px` }}
              />
            ))}
          </div>
        )}

        {showFinalResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
            <div className="text-center space-y-6">
              <div className="text-4xl font-bold mb-8">RESULT</div>
              <div className="text-xl font-mono whitespace-pre-line">{finalResultText}</div>
              <button
                onClick={() => {
                  setShowFinalResult(false);
                  setGameStarted(false);
                  setIsPlaying(false);
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      clearCanvas(ctx);
                      drawLanes(ctx);
                    }
                  }
                }}
                className="px-8 py-3 border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isPlaying && (
        <div className="mt-4 text-xs opacity-50">
          Blocks: {blocksRef.current.length} | Playing: {isPlaying.toString()}
        </div>
      )}
    </div>
  );
}
