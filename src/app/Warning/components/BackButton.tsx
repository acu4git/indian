"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/"); // トップレベルURLに戻る
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-lg bg-red-600 px-4 py-2 text-white font-semibold opacity-80 hover:opacity-100 transition-opacity"
    >
      セキュリティで保護されたページに戻る
    </button>
  );
}
