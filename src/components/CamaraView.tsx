"use client";

import { useFaceLandmarker } from "@/hooks/useFaceLandmarker";
import { DrawingUtils, FaceLandmarker } from "@mediapipe/tasks-vision";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import targetCurry from "./target_curry.png";

const IMG_WIDTH = 60;
const IMG_HEIGHT = 60;
const MOUTH_OPEN_THRESHOLD = 0.05; // 口が開いていると判定するしきい値

const CameraView = () => {
  const { videoRef, results, isLoading, error } = useFaceLandmarker();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [targetPosition, setTargetPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, [isLoading]);

  useEffect(() => {
    if (containerSize) {
      const top = Math.random() * (containerSize.height - IMG_HEIGHT);
      const left = Math.random() * (containerSize.width - IMG_WIDTH);
      setTargetPosition({ top, left });
    }
  }, [containerSize]);

  useEffect(() => {
    if (
      results?.faceLandmarks &&
      targetPosition &&
      containerSize &&
      // buttonRef.current
      imgRef.current
    ) {
      const landmarks = results.faceLandmarks[0];
      if (!landmarks) return;

      // 上唇と下唇の中心あたりのランドマーク
      const upperLip = landmarks[13];
      const lowerLip = landmarks[14];
      const lipDistance = Math.abs(upperLip.y - lowerLip.y);

      // 口が開いているか判定
      if (lipDistance > MOUTH_OPEN_THRESHOLD) {
        // console.log("mouth opening");
        const lipsLandmarks = landmarks.filter((_, index) =>
          FaceLandmarker.FACE_LANDMARKS_LIPS.flatMap((range) => {
            const indices = [];
            for (let i = range.start; i <= range.end; i++) {
              indices.push(i);
            }
            return indices;
          }).includes(index)
        );

        if (lipsLandmarks.length > 0) {
          const lipPointsX = lipsLandmarks.map(
            (lm) => (1 - lm.x) * containerSize.width
          );
          const lipPointsY = lipsLandmarks.map(
            (lm) => lm.y * containerSize.height
          );
          const minLipX = Math.min(...lipPointsX);
          const maxLipX = Math.max(...lipPointsX);
          const minLipY = Math.min(...lipPointsY);
          const maxLipY = Math.max(...lipPointsY);

          const buttonLeft = imgRef.current.offsetLeft;
          const buttonTop = imgRef.current.offsetTop;
          const buttonRight = buttonLeft + imgRef.current.offsetWidth;
          const buttonBottom = buttonTop + imgRef.current.offsetHeight;

          // 衝突判定
          if (
            maxLipX > buttonLeft &&
            minLipX < buttonRight &&
            maxLipY > buttonTop &&
            minLipY < buttonBottom
          ) {
            // router.push("/");
            // return;
            setIsMatched(true);
          }
        }
      }
    }
  }, [results, targetPosition, containerSize, router]);

  useEffect(() => {
    if (canvasRef.current && results?.faceLandmarks) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawContext = new DrawingUtils(ctx);

      for (const landmarks of results.faceLandmarks) {
        drawContext.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          {
            color: "red",
          }
        );
      }
    }
  }, [results]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">preparing camera...</div>;
  }

  if (isMatched) {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track: MediaStreamTrack) => track.stop());
    }
    router.push("/MusicGame");
    return;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 w-full justify-center">
      <div className="fixed top-5 left-5 p-5 bg-gray-300 rounded-lg">
        <p className="font-extrabold text-3xl">本人確認</p>
        <p>
          口を開いて<a>完了</a>ボタンを口の中に入れてください
        </p>
      </div>
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl aspect-video"
      >
        <video
          playsInline
          ref={videoRef}
          autoPlay
          muted
          className="absolute top-0 left-0 w-full h-full transform -scale-x-100"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full transform -scale-x-100"
        />
        {targetPosition && (
          <img
            ref={imgRef}
            src={targetCurry.src}
            className="absolute z-20"
            style={{
              top: `${targetPosition.top}px`,
              left: `${targetPosition.left}px`,
              width: `${IMG_WIDTH}px`,
              height: `${IMG_HEIGHT}px`,
            }}
          />
          // <button
          //   ref={buttonRef}
          //   className="absolute z-20 bg-white p-2 rounded"
          //   style={{
          //     top: `${targetPosition.top}px`,
          //     left: `${targetPosition.left}px`,
          //     width: `${IMG_WIDTH}px`,
          //     height: `${IMG_HEIGHT}px`,
          //   }}
          // >
          //   完了
          // </button>
        )}
      </div>
    </div>
  );
};

export default CameraView;
