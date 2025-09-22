"use client";

import { useRouter } from "next/navigation";

export default function IgnoreButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/FlavorGame"); // FlavorGame に遷移
  };

  return (
    <button
      onClick={handleClick}
      className="ml-66 rounded-3xl bg-red-600 px-4 py-2 text-white text-sm font-semibold opacity-20 hover:opacity-100 transition-opacity"
    >
      無視する
    </button>
  );
}
