'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SkipToAd } from './components/skipToAd';

function AdPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const videoId = searchParams.get('videoId');
  const returnUrl = searchParams.get('returnUrl');

  const [skipTimer, setSkipTimer] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  // ▼▼▼ iframeを再マウント（リロード）させるためのキーを追加 ▼▼▼
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    setCanSkip(false); // タイマー開始時に必ずスキップ不可状態にする
    
    // 5秒間のカウントダウンタイマー
    const timer = setInterval(() => {
      setSkipTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // 5秒後にタイマーを停止し、スキップ可能にする
    const skipTimeout = setTimeout(() => {
      clearInterval(timer);
      setCanSkip(true);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimeout);
    };
  }, [remountKey]); // remountKeyが変わるたびにタイマーをリスタートする

  // バックボタンを押しても前の画面に戻れない
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

  // ▼▼▼ 閉じるボタン制御を追加 ▼▼▼
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // 標準的なブラウザでは、カスタムメッセージは表示されないが、
      // この設定により「このサイトを離れますか？」という確認ダイアログが表示される
      event.preventDefault();
      event.returnValue = ''; // 古いブラウザ用の設定
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

  return (
    <main className="w-screen h-screen bg-black relative overflow-hidden cursor-none">
      <div className="absolute inset-0">
        <iframe
          key={remountKey}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${videoId}`}
          title="Advertisement Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full pointer-events-none"
        ></iframe>
      </div>

      <SkipToAd
        skipTimer={skipTimer}
        setSkipTimer={setSkipTimer}
        canSkip={canSkip}
        setRemountKey={setRemountKey}
      />
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
