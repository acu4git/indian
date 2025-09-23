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
      className="block w-full rounded-lg bg-white border border-red-600 px-4 py-2 text-blue-500 font-semibold cursor-pointer"
    >
      セキュリティで保護されたページに戻る
    </button>
  );
}
