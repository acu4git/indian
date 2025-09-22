"use client";

import { useState } from "react";
import { WARNING_MESSAGE } from "../consts/index";

type Props = {
  onToggleDetails: (show: boolean) => void;
};

export default function WarningMessage({ onToggleDetails }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    const newState = true; // 一度クリックしたら常に表示状態に
    setShowDetails(newState);
    onToggleDetails(newState); // 親に通知
  };

  return (
    <div className="text-left">
      {/* アイコン */}
      <div className="mb-4 relative w-20 h-20 bg-white [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)] flex items-center justify-center">
        {/* 赤バッテン */}
        <div className="absolute w-12 h-3 bg-red-600 rotate-45"></div>
        <div className="absolute w-12 h-3 bg-red-600 -rotate-45"></div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">危険なサイト</h1>
      <p className="text-white whitespace-pre-line">{WARNING_MESSAGE}</p>

      {/* 詳細リンク（表示前だけ出す） */}
      {
        <button
          onClick={handleClick}
          className={`underline mt-4 ${showDetails ? "text-red-600" : "text-white"}`}
        >
          この警告の詳細
        </button>
      }

      {/* 詳細エリア */}
      {
        <div className={`-mt-4 text-left text-sm ${showDetails ? "text-white" : "text-red-600"}`}>
          <p>
            - このサイトはフィッシングの可能性があります。<br />
            - 個人情報を入力しないでください。<br />
            - 不審な場合は直ちにブラウザを閉じてください。
          </p>
        </div>
      }
    </div>
  );
}
