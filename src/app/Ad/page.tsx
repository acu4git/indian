'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SkipToAd } from './components/skipToAd';
import { MovieAd } from './components/movieAd';

function AdPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const videoId = searchParams.get('videoId');
  const returnUrl = searchParams.get('returnUrl') || '/'; // フォールバック先を設定

  const [skipTimer, setSkipTimer] = useState(10);
  // ▼▼▼ iframeを再マウント（リロード）させるためのキーを追加 ▼▼▼
  const [remountKey, setRemountKey] = useState(0);
  
  const [showReturnButton, setShowReturnButton] = useState(false);
  // ボタンの位置を動かすためのstate
  const [buttonPosition, setButtonPosition] = useState({ top: '2%', left: '2%' });

  // 広告スキップと「戻る」ボタン表示を兼ねる、1つのタイマー
  useEffect(() => {
    // 広告がリセットされたら、タイマーとボタンの状態を初期化
    setSkipTimer(10);
    setShowReturnButton(false);

    const timer = setInterval(() => {
      setSkipTimer(prev => {
        // カウントが1以下になったらタイマーを停止し、「戻る」ボタンを表示
        if (prev <= 1) {
          clearInterval(timer);
          setShowReturnButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // コンポーネントがアンマウントされる際にタイマーをクリア
    return () => clearInterval(timer);
  }, [remountKey]);

  // 押しにくいボタンを動かすためのuseEffect
  useEffect(() => {
    if (showReturnButton) {
      const interval = setInterval(() => {
        const top = 2 + Math.random() * 5;
        const left = 2 + Math.random() * 5;
        setButtonPosition({ top: `${top}%`, left: `${left}%` });
      }, 800); // 0.8秒ごとに位置がランダムに変わる
      return () => clearInterval(interval);
    }
  }, [showReturnButton]);


  // バックボタン制御
  useEffect(() => {
    // ページに入ったときに、履歴に現在のページをもう一つ追加する
    // これにより、ユーザーが最初に戻るボタンを押したときに、このダミーの履歴に移動する
    history.pushState(null, '', location.href);
    const handlePopState = (event: PopStateEvent) => {
      // ユーザーが「戻る」を押すと、履歴が一つ前に戻る
      // それを検知したら、すぐに「進む」ことで元のページに強制的に戻す
      history.go(1);
    };

    // popstateイベント（戻る/進むボタン）を監視
    window.addEventListener('popstate', handlePopState);

    // コンポーネントが不要になったら、イベント監視を解除
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 閉じるボタン制御
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // 標準的なブラウザでは、カスタムメッセージは表示されないが、
      // この設定により「このサイトを離れますか？」という確認ダイアログが表示される
      event.preventDefault();
    };

    // ユーザーがページを離れようとしたとき（タブを閉じる、リロードなど）にイベントを発火
    window.addEventListener('beforeunload', handleBeforeUnload);

    // スキップしてコンポーネントが不要になったら、イベント監視を解除
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!videoId) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        動画の読み込みに失敗しました。
      </div>
    );
  }

  const handleReturn = () => {
    router.push(returnUrl);
  };

  return (
    <main className="w-screen h-screen bg-black relative overflow-hidden cursor-none">
      <MovieAd
        remountKey={remountKey}
        videoId={videoId}
      />

      <SkipToAd
        skipTimer={skipTimer}
        setRemountKey={setRemountKey}
      />

      {/* 10秒経ったら表示される、非常に押しにくいボタン */}
      {showReturnButton && (
        <button
          onClick={handleReturn}
          className="absolute z-20 px-1 py-0 text-s bg-gray-900 text-gray-800 rounded-full hover:bg-gray-800 hover:text-gray-700 transition-all duration-300 ease-in-out"
          style={{ top: buttonPosition.top, left: buttonPosition.left, transition: 'top 0.5s, left 0.5s' }}
        >
          ×
        </button>
      )}

    </main>
  );
}

// Suspenseでラップして、useSearchParamsの読み込みを待ちます
export default function AdPage() {
    return (
        <Suspense fallback={<div className="w-screen h-screen bg-black"></div>}>
            <AdPageComponent />
        </Suspense>
    )
}
