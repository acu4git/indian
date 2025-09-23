import Link from "next/link";

// components/DeceptiveAdButton.tsx
interface DeceptiveAdButtonProps {
  text: string;
  adUrl?: string;
}

export default function DeceptiveAdButton({
  text,
  adUrl = "/Ad?videoId=aLpcjQDiBDM&returnUrl=%2Fquiz",
}: DeceptiveAdButtonProps) {
  return (
    <Link
      href={adUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full rounded-lg bg-white p-4 text-center text-lg font-semibold text-gray-700 shadow-md ring-1 ring-gray-200 transition-all hover:bg-gray-50 active:scale-[0.98] active:shadow-sm"
    >
      {/* 小さな広告ラベル */}
      <span className="absolute top-1 right-1 rounded-sm bg-gray-200 px-1 py-0.5 text-[10px] font-bold text-gray-400 opacity-30 transition-opacity group-hover:opacity-100">
        AD
      </span>

      {text}
    </Link>
  );
}
