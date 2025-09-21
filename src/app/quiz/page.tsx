"use client";

import { useState } from "react";
import Typewriter from "./components/typewriter";
import AnxietyTimer from "./components/anxiety-timer";
import DeceptiveAdButton from "./components/deceptive-ad";

const QUESTIONS = [
  "えーと、利用者はSNSで猫の画像を見かけたら、あ、3秒以内に「いいね」をしなければならないですか？",
  "カレー味のかき氷を注文しますか？",
];

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const currentQuestion = QUESTIONS[index];

  return (
    <div className="flex flex-col w-dvw">
      <div className="flex justify-center mt-10 space-x-10">
        {["はい", "いいえ"].map((option) => (
          <button
            key={option}
            className="mx-auto  rounded-full bg-amber-300  text-xl font-semibold text-white shadow-md transition hover:bg-amber-500 active:scale-95"
            onClick={() => setIndex((prev) => (prev + 1) % QUESTIONS.length)}
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
