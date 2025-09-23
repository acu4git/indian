"use client"; // ブラウザAPI（navigator）を使用するため、クライアントコンポーネントとして指定します

import { useRef, useEffect, useState } from "react";

/**
 * Webカメラの映像をリアルタイムで表示するコンポーネントです。
 */
export default function WebcamDisplay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // カメラを起動する関数
  const startCamera = async () => {
    // 既にストリームがあれば何もしない
    if (stream) return;

    // ブラウザがカメラAPIに対応しているかチェック
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("お使いのブラウザはWebカメラに対応していません。");
      return;
    }

    try {
      // カメラ映像のストリームを取得
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // 音声は不要なためfalseに
      });

      // video要素にストリームを接続
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStream(stream);
      setError(null); // エラーをクリア
    } catch (err) {
      console.error("カメラへのアクセス中にエラーが発生しました:", err);
      // エラーの種類に応じてメッセージを出し分ける
      if (err instanceof DOMException) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          setError(
            "Webカメラへのアクセスが拒否されました。ブラウザの設定からカメラの許可をお願いします。"
          );
        } else if (
          err.name === "NotFoundError" ||
          err.name === "DevicesNotFoundError"
        ) {
          setError("利用可能なWebカメラが見つかりませんでした。");
        } else {
          setError("Webカメラの起動中にエラーが発生しました。");
        }
      } else {
        setError("Webカメラの起動中に不明なエラーが発生しました。");
      }
    }
  };

  // カメラを停止する関数
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  // コンポーネントのマウント時に一度だけカメラを起動
  useEffect(() => {
    startCamera();

    // コンポーネントがアンマウントされるときにクリーンアップ処理を実行
    return () => {
      stopCamera();
    };
  }, []); // 空の依存配列でマウント時に一度だけ実行

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700">
        <h1 className="text-3xl font-bold text-center p-6 bg-gray-900">
          Webカメラ リアルタイムフィード
        </h1>
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted // 自動再生のためにミュートが必要
            className="w-full h-full object-cover"
          />
          {/* エラーメッセージか、カメラがオフの場合の表示 */}
          {(error || !stream) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 p-4">
              {error ? (
                <p className="text-red-400 text-center">{error}</p>
              ) : (
                <p className="text-gray-400 text-center">
                  カメラを起動しています...
                </p>
              )}
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-900 flex justify-center items-center space-x-4">
          <button
            onClick={startCamera}
            disabled={!!stream}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
          >
            カメラを起動
          </button>
          <button
            onClick={stopCamera}
            disabled={!stream}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
          >
            カメラを停止
          </button>
        </div>
      </div>
    </div>
  );
}
