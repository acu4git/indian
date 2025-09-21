"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/Warning");
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-center min-h-screen font-sans text-4xl cursor-pointer select-none bg-white text-black"
    >
      オープニングのハリボテ
    </div>
  );
}
