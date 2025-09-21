"use client";

import { useState, useEffect } from "react";

// コンポーネントのPropsの型定義
interface AnxietyTimerProps {
  /** カウントダウンする秒数（デフォルトは15秒） */
  durationInSeconds?: number;
}

/**
 * ユーザーを焦らせるためだけの、見かけ上のタイマーコンポーネント
 */
export default function AnxietyTimer({
  durationInSeconds = 15,
}: AnxietyTimerProps) {
  // 時間の内部状態はミリ秒で管理
  const [timeLeft, setTimeLeft] = useState(durationInSeconds * 1000);

  useEffect(() => {
    // 時間が0以下ならタイマーを開始しない
    if (timeLeft <= 0) return;

    // 10ミリ秒ごとにタイマーを更新
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 10);
    }, 10);

    // 時間が0になったらタイマーを停止
    if (timeLeft <= 0) {
      clearInterval(timerId);
    }

    // コンポーネントがアンマウントされる時にタイマーをクリーンアップ
    return () => {
      clearInterval(timerId);
    };
  }, [timeLeft]); // timeLeftが変わるたびにeffectをチェック

  // ミリ秒を「秒.ミリ秒（2桁）」の形式にフォーマットする
  const seconds = Math.floor(timeLeft / 1000);
  const milliseconds = Math.floor((timeLeft % 1000) / 10); // 100分の1秒単位
  const formattedTime = `${String(seconds).padStart(2, "0")}.${String(
    milliseconds
  ).padStart(2, "0")}`;

  // 残り時間に応じてスタイルを動的に変更
  const isUrgent = timeLeft > 0 && timeLeft <= 5000; // 残り5秒で緊急モード

  return (
    <div className="w-lg mx-auto my-4 max-w-sm rounded-xl bg-amber-50 p-6 text-center shadow-lg ring-2 ring-amber-400 ring-offset-2">
      <p className="text-lg font-medium text-amber-800">
        {timeLeft > 0 ? "操作を完了してください" : "時間切れ"}
      </p>
      <p
        className={`my-2 text-7xl font-bold tracking-tighter transition-colors duration-500
          ${isUrgent ? "text-red-600 animate-pulse" : "text-gray-800"}
        `}
      >
        {formattedTime}
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-100 ease-linear 
            ${isUrgent ? "bg-red-500" : "bg-green-500"}
          `}
          style={{ width: `${(timeLeft / (durationInSeconds * 1000)) * 100}%` }}
        />
      </div>
    </div>
  );
}
