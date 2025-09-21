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
      className="rounded-lg bg-white border border-red-600 px-4 py-2 text-red-600 font-semibold opacity-80 hover:opacity-100 cursor-pointer ml-3"
    >
      無視する
    </button>
  );
}
