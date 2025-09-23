"use client";

import { useFaceLandmarker } from "@/hooks/useFaceLandmarker";
import { DrawingUtils, FaceLandmarker } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";

const CameraView = () => {
  const { videoRef, results, isLoading, error } = useFaceLandmarker();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 検出結果が変わるたびにcanvasに描画する
  useEffect(() => {
    if (canvasRef.current && results?.faceLandmarks) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawContext = new DrawingUtils(ctx);

      // 検出された各顔のランドマークを描画
      for (const landmarks of results.faceLandmarks) {
        drawContext.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS
        );
        // drawContext.drawLandmarks(landmarks, {
        //   color: "#00FF00",
        //   lineWidth: 5,
        // });
      }
    }
  }, [results]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">preparing camera...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 w-full justify-center">
      <video
        playsInline
        ref={videoRef}
        autoPlay
        muted
        className="fixed inset-0 z-10 transform -scale-x-100" // 左右反転
      />
      <button className="fixed top-25 left-25 z-50">完了</button>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="fixed top-0 left-0 z-10 transform -scale-x-100"
      />
    </div>
  );
};

export default CameraView;
