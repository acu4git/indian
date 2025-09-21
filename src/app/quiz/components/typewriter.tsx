"use client";

import { random } from "lodash";
import { useEffect, useRef, useState } from "react";

const JP_CHARS =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんー、。アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function useTypewriter(text: string) {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const mistakedRef = useRef(false);

  useEffect(() => {
    setDisplayedText("");
    indexRef.current = 0;
    mistakedRef.current = false;
    const timeoutIds: NodeJS.Timeout[] = [];

    const doType = () => {
      // 終了条件
      if (indexRef.current >= text.length) {
        return;
      }

      if (mistakedRef.current) {
        mistakedRef.current = false;
        setDisplayedText((prev) => prev.slice(0, -1));
        timeoutIds.push(setTimeout(doType, random(150, 250)));
        return;
      }

      if (Math.random() < 0.3) {
        const mistakeChar = JP_CHARS[random(0, JP_CHARS.length - 1)];
        setDisplayedText((prev) => prev + mistakeChar);

        mistakedRef.current = true;
        timeoutIds.push(setTimeout(doType, random(50, 150)));
      } else {
        console.log("type", text[indexRef.current]);
        const currentIndex = indexRef.current;
        setDisplayedText((prev) => prev + text[currentIndex]);
        indexRef.current += 1;
        timeoutIds.push(setTimeout(doType, random(50, 150)));
      }
    };

    const startTimeout = setTimeout(doType, 500);

    return () => {
      clearTimeout(startTimeout);
      timeoutIds.forEach(clearTimeout);
    };
  }, [text]);

  return displayedText;
}

export default function Typewriter({ text }: { text: string }) {
  const displayedText = useTypewriter(text);

  return (
    <div className="text-xl font-mono flex items-center justify-center">
      <p>
        {displayedText}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  );
}
