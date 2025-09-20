"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { useState } from "react";

export default function AgreementCard() {
  // 利用規約：実は同意しなくても進める
  // 私は人間ではありません：逆に同意すると進めない
  const [isNotHumanChecked, setIsNotHumanChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  return (
    <div className="flex flex-col bg-gray-50 mx-auto rounded-sm px-8 py-4 shadow-xl">
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="agreement"
          checked={isAgreementChecked}
          onChange={(e) => setIsAgreementChecked(e.target.checked)}
        />
        <label htmlFor="agreement" className="ml-2 text-yellow-300">
          利用規約に同意します
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="not-a-human"
          checked={isNotHumanChecked}
          onChange={(e) => setIsNotHumanChecked(e.target.checked)}
        />
        <label htmlFor="not-a-human" className="ml-2 text-yellow-300">
          私は人間ではありません
        </label>
      </div>
      {!isNotHumanChecked && (
        <div
          className="mt-4 max-w-sm rounded-md border border-red-400 bg-red-100 p-3 text-center text-sm text-red-700"
          role="alert"
        >
          🤖人間ではない訪問者は、当サイトの利用規約によりアクセスが制限されています。
        </div>
      )}
      <div className="flex flex-row">
        <Link
          href="/terms"
          // className={
          //   "px-4 py-2 text-white rounded-md w-10" +
          //   (isChecked ? " bg-green-600 " : " cursor-not-allowed bg-gray-400")
          // }
          className={cn("px-4 py-2 text-white rounded-md w-10", {
            "bg-green-600 ": isNotHumanChecked && isAgreementChecked,
            "cursor-not-allowed bg-gray-400":
              !isNotHumanChecked || !isAgreementChecked,
          })}
        >
          同意する
        </Link>
        <Link
          // TODO: storeId, orderIdを動的に変更する
          href={isNotHumanChecked ? "/" : "/Order/abc/1"}
          className={cn("px-4 py-2 text-white rounded-md w-10", {
            "bg-red-500 ": isNotHumanChecked && isAgreementChecked,
            "cursor-not-allowed bg-gray-400":
              !isNotHumanChecked || !isAgreementChecked,
          })}
        >
          同意しない
        </Link>
      </div>
    </div>
  );
}
