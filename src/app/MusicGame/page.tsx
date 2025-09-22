'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
// 定数をまとめてインポート
import * as C from './consts';
import { Result } from './components/result';
import { Feedback } from './components/feedback';
import { AppStore } from './components/appStore';

export default function MusicGamePage() {
  // 音ゲーの描画による再レンダリングを避けるため、useRefで状態を管理
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const isKeysHitRef = useRef<boolean[]>([false, false, false, false]);
  const touchFeedbackRef = useRef<boolean[]>([false, false, false, false]);
  const gameLoopRef = useRef<number | null>(null);
  
  // --- ▼ここから追加 ▼ ---
  // 効果音用のAudioオブジェクトを保持するref
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  // --- ▲ここまで追加 ▲ ---

  // --- ▼広告表示用の状態追加 ▼ ---
  const [showAd, setShowAd] = useState(false);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);
  // --- ▲広告表示用の状態追加 ▲ ---

  // ゲーム状態（UIに反映が必要なもの）
  const [isPlaying, setIsPlaying] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [maxComboCount, setMaxComboCount] = useState(0);
  const [judgeResult, setJudgeResult] = useState('');
  const [showFinalResult, setShowFinalResult] = useState(false);

  // 判定結果のカウント（動的に生成）
  const [judgeCounts, setJudgeCounts] = useState<Record<string, number>>(() =>
    Object.keys(C.JUDGE_TYPES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

  // 判定処理（汎用化）
  const onJudge = useCallback((judgeType: keyof typeof C.JUDGE_TYPES) => {
    const judge = C.JUDGE_TYPES[judgeType];
    
    setJudgeResult(judge.name);
    setJudgeCounts(prev => ({ ...prev, [judgeType]: prev[judgeType] + 1 }));
    
    if (judge.combo) {
      // コンボ継続
      setComboCount(prev => {
        const newCombo = prev + 1;
        setMaxComboCount(current => Math.max(current, newCombo));
        return newCombo;
      });
    } else {
      // コンボリセット
      setComboCount(0);
    }
  }, []);

  // 入力処理
  const onLaneHit = useCallback((index: number) => {
    if (!isPlaying || isKeysHitRef.current[index]) return;

    isKeysHitRef.current[index] = true;
    touchFeedbackRef.current[index] = true;
    setTimeout(() => { touchFeedbackRef.current[index] = false; }, 150);

    const maxRange = Math.max(...Object.values(C.JUDGE_TYPES).map(j => j.range === Infinity ? 25 : j.range));
    const bounds = C.getJudgeYBounds(C.DEFAULT_SPEED);
    const maxBound = bounds[Object.keys(bounds).find(key => C.JUDGE_TYPES[key as keyof typeof C.JUDGE_TYPES].range === maxRange) || 'MISS'];

    const hitBlock = blocksRef.current.find(
      (block) =>
        !block.isHit &&
        block.x === C.LANE_LEFTS[index] &&
        block.y >= maxBound.min &&
        block.y <= maxBound.max
    );

    if (hitBlock) {
      // --- ▼ここから変更 ▼ ---
      // 効果音を再生
      if (hitSoundRef.current) {
        hitSoundRef.current.currentTime = 0; // 再生位置を先頭に戻す
        hitSoundRef.current.play();          // 再生
      }
      // --- ▲ここまで変更 ▲ ---

      hitBlock.isHit = true;
      const judgeType = C.getJudgeResult(hitBlock.y, C.DEFAULT_SPEED);
      if (judgeType) {
        onJudge(judgeType);
      }
    }
  }, [isPlaying, onJudge]); // C.DEFAULT_SPEEDを依存配列から削除（定数のため）

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
    // POORの範囲を取得（画面外判定）
    const poorBound = C.getJudgeYBounds(C.DEFAULT_SPEED)['POOR'];
    
    blocksRef.current.forEach((block) => {
      if (!block.isHit && !block.isPoor && block.y > poorBound.max) {
        block.isPoor = true;
        onJudge('POOR');
      }
      block.y += C.DEFAULT_SPEED;
      if (block.y > -C.BLOCK_HEIGHT && block.y < C.CANVAS_HEIGHT + C.BLOCK_HEIGHT && !block.isHit && !block.isPoor) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(block.x, block.y - C.BLOCK_HEIGHT / 2, block.width, block.height);
      }
    });
  }, [onJudge]); // C.DEFAULT_SPEEDを依存配列から削除（定数のため）
  
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

  // --- ▼広告を閉じる処理追加 ▼ ---
  const closeAd = useCallback(() => {
    setShowAd(false);
  }, []);
  // --- ▲広告を閉じる処理追加 ▲ ---

  // ゲーム開始
  const gameStart = useCallback(() => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    
    // --- ▼広告タイマーのクリア追加 ▼ ---
    if (adTimerRef.current) {
      clearTimeout(adTimerRef.current);
    }
    setShowAd(false);
    // --- ▲広告タイマーのクリア追加 ▲ ---

    blocksRef.current = [];
    setJudgeCounts(Object.keys(C.JUDGE_TYPES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
    setComboCount(0);
    setMaxComboCount(0);
    setJudgeResult('');
    setShowFinalResult(false);
    setIsPlaying(true);
    
    const baseSpeed = (60 * C.PLAY_TIME_SECONDS) / C.TOTAL_NOTES;
    for (let i = 0; i < C.TOTAL_NOTES; i++) {
      const laneNum = Math.floor(Math.random() * 4);
      blocksRef.current.push({
        laneNumber: laneNum, noteID: i, x: C.LANE_LEFTS[laneNum],
        y: -(baseSpeed * C.DEFAULT_SPEED * i) - C.NOTE_OFFSET_TIME_MS + C.BUTTONS_TOP,
        width: C.LANE_WIDTH, height: C.BLOCK_HEIGHT, isHit: false, isPoor: false,
      });
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // --- ▼5秒後に広告表示するタイマー追加 ▼ ---
    adTimerRef.current = setTimeout(() => {
      setShowAd(true);
    }, 5000);
    // --- ▲5秒後に広告表示するタイマー追加 ▲ ---

    setTimeout(() => {
      setIsPlaying(false);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
      setShowFinalResult(true);
    }, 1000 * C.PLAY_TIME_SECONDS + 2000);
  }, [gameLoop]); // C定数を依存配列から削除
  
  // --- useEffect フック ---

  // --- ▼ここから追加 ▼ ---
  // 初回レンダリング時にAudioオブジェクトを生成
  useEffect(() => {
    // Next.jsやVite/CRAの場合、publicフォルダに音声ファイルを配置します
    hitSoundRef.current = new Audio('/ghost.mp3');
  }, []);
  // --- ▲ここまで追加 ▲ ---

  // 初回レンダリング時にゲームを自動で開始
  useEffect(() => {
    gameStart();
  }, [gameStart]);

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

  // --- ▼クリーンアップ処理に広告タイマークリア追加 ▼ ---
  // クリーンアップ
  useEffect(() => {
    return () => { 
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (adTimerRef.current) clearTimeout(adTimerRef.current);
    };
  }, []);
  // --- ▲クリーンアップ処理に広告タイマークリア追加 ▲ ---

  // 結果テキストを動的生成
  const finalResultText = Object.entries(judgeCounts)
    .map(([key, count]) => `${C.JUDGE_TYPES[key as keyof typeof C.JUDGE_TYPES].name}: ${count}`)
    .join('\n    ') + `\n    MAXCOMBO: ${maxComboCount}`;

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

        {isPlaying && (
            <div>
              <Feedback comboCount={comboCount} judgeResult={judgeResult} />
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
            <Result finalResult={finalResultText} onPlayAgain={gameStart} />
        )}

        {/* --- ▼広告UI追加 ▼ --- */}
        {showAd && (
          <AppStore showAd={showAd} closeAd={closeAd} />
        )}
        {/* --- ▲広告UI追加 ▲ --- */}
      </div>
    </div>
  );
}
