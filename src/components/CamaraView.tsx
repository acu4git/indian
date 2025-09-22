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
          FaceLandmarker.FACE_LANDMARKS_TESSELATION
        );
        drawContext.drawLandmarks(landmarks, {
          color: "#00FF00",
          lineWidth: 5,
        });
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
    <div className="relative w-full h-screen max-w-2xl mx-auto">
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute top-0 left-0 z-10"
      />
      <video
        playsInline
        ref={videoRef}
        width={640}
        height={480}
        autoPlay
        muted
        className="absolute top-0 left-0 w-full h-full object-cover transform -scale-x-100" // 左右反転
      />
    </div>
  );
};

export default CameraView;
