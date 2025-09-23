"use client";

import { useState } from "react";
import Typewriter from "./components/typewriter";
import AnxietyTimer from "./components/anxiety-timer";
import DeceptiveAdButton from "./components/deceptive-ad";

const QUESTIONS = [
  "利用者はSNSで猫の画像を見かけたら、3秒以内に「いいね」をしなければならないですか？",
  "利用者は毎日1回、ランダムな人に「こんにちは」と挨拶しなければならないですか？",
  "利用者は週に一度、近所の公園でラジオ体操をしなければならないですか？",
  "利用者は月に一度、見知らぬ人に「ありがとう」と感謝の言葉を伝えなければならないですか？",
  "利用者は毎朝、鏡の前で自分に向かって「今日も素晴らしい一日になる」と言わなければならないですか？",
  "利用者は毎晩、寝る前に今日あった良いことを3つ思い出さなければならないですか？",
  "利用者は週に一度、家族や友人に手紙を書いて感謝の気持ちを伝えなければならないですか？",
  "利用者は毎日、少なくとも5分間瞑想をしなければならないですか？",
  "利用者は月に一度、ボランティア活動に参加しなければならないですか？",
  "利用者は毎週、少なくとも1回新しいレシピを試して料理をしなければならないですか？",
];

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const currentQuestion = QUESTIONS[index];

  const handleClick = () => {
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
    } else {
      alert("クイズ終了！お疲れ様でした！");
    }
  };

  return (
    <div className="flex flex-col w-dvw">
      <div className="flex justify-center mt-10 space-x-10">
        {["はい", "いいえ"].map((option) => (
          <button
            key={option}
            className="mx-auto rounded-full bg-amber-300 text-xl font-semibold text-white shadow-md transition hover:bg-amber-500 active:scale-95"
            onClick={handleClick}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="border-2 m-4 py-10">
        <h1 className="text-3xl font-bold text-center mt-10">
          利用規約クイズタイム！
        </h1>
        <AnxietyTimer durationInSeconds={60} />
        <div className="mt-20 mx-auto text-center">
          <Typewriter text={currentQuestion} />
        </div>
        <div className="mt-20 mx-auto w-1/2">
          <DeceptiveAdButton text="Yes" />
        </div>
      </div>
    </div>
  );
}
