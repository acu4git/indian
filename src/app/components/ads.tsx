"use client";

"use client";

import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AnnoyingBannerAd({ adUrl }: { adUrl: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 5 * 1000);
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full animate-fade-up bg-yellow-200 text-center text-black overflow-scroll overscroll-contain">
      <div className="relative w-full h-20">
        <Link
          href={adUrl}
          className="w-full h-full relative inline-block"
          style={{
            backgroundImage: "url('/indian-curry.png')",
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          {/* 広告のコンテンツ */}
          <p className="absolute top-1 left-1 text-xs font-bold bg-yellow-400 px-1 rounded">
            広告 - クリックして動画を見る
          </p>

          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-red-500 px-1 rounded">
            かき氷カレー味再来！
          </p>

          {/* 閉じるボタン（ダミー） */}
          <button
            className="absolute -top-2 right-0 h-5 w-5 rounded-full bg-gray-600 text-xs font-bold text-white transition-transform hover:scale-110 active:scale-90"
            aria-label="広告を閉じる"
          >
            X
          </button>
          <button
            className="absolute -top-2 right-12 h-5 w-5 rounded-full bg-gray-600 text-xs font-bold text-white transition-transform hover:scale-110 active:scale-90"
            aria-label="広告を閉じる"
          >
            △
          </button>
        </Link>
        {/* 閉じるボタン（本物） */}
        <button
          onClick={handleClose}
          className="absolute -top-2 right-6 h-5 w-5 rounded-full bg-gray-600 text-xs font-bold text-white transition-transform hover:scale-110 active:scale-90"
          aria-label="広告を閉じる"
        >
          ✗
        </button>
      </div>
    </div>
  );
}

export function AnnoyingSlideInAd({ adUrl }: { adUrl: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 30 * 1000);
  };

  return (
    <div
      className={cn(
        "fixed bottom-12 left-0 z-50 w-full h-30 duration-[30000ms] rounded-lg bg-yellow-500 text-black shadow-2xl overflow-scroll overscroll-contain",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-80 opacity-50"
      )}
    >
      <div className="relative w-full h-32">
        <Link href={adUrl} className="p-6 flex">
          {/* ここに広告のコンテンツを配置 */}
          <Image
            src="/indian-kakigori.png"
            alt="広告画像"
            width={96}
            height={96}
            className="rounded-lg"
          />
          <div className="mr-4">
            <h3 className="mb-2 text-lg font-bold">あなたへのおすすめ！</h3>
            <p className="text-sm ">
              この素晴らしい商品を見逃さないでください！
            </p>
          </div>
        </Link>
        {/* 閉じるボタン (こちらも小さい) */}
        <button
          onClick={() => {
            handleClose();
          }}
          className="absolute top-4 right-4 h-6 w-6 rounded-full bg-black text-sm text-white font-bold shadow-lg"
          aria-label="広告を閉じる"
        >
          ○
        </button>
      </div>
    </div>
  );
}

export function AnnoyingOverlayAd({ adUrl }: { adUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(0); // 閉じるボタンが有効になるまでのカウントダウン

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      document.body.style.overflow = "hidden"; // 背景のスクロールを無効化
      setCountdown(5); // 広告が表示されたらカウントダウンをリセット
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (countdown === 0) {
      setIsOpen(false);
      document.body.style.overflow = "auto"; // 背景のスクロールを再度有効化
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center  bg-opacity-80 backdrop-blur-sm">
      <div className="relative w-11/12 max-w-2xl rounded-lg bg-white p-8 text-center">
        <Link href={adUrl}>
          {/* ここに広告のコンテンツを配置 */}
          <h2 className="mb-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            期間限定オファー！
          </h2>
          <p className="text-lg">今なら99%オフ！このチャンスを逃すな！</p>

          <Image
            src="/indian-curry.png"
            alt="広告画像"
            width={400}
            height={400}
            className="my-4 mx-auto rounded-lg"
          />
        </Link>
        {/* 閉じるボタン (カウントダウン付き) */}
        <button
          onClick={handleClose}
          disabled={countdown > 0}
          className="absolute -top-3 -right-3 rounded-full bg-white p-1 text-2xl shadow-lg transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          aria-label="広告を閉じる"
        >
          {countdown > 0 ? <span className="text-sm">{countdown}</span> : "×"}
        </button>
      </div>
    </div>
  );
}
