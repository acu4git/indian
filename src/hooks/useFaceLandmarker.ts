import { createFaceLandmarker } from "@/lib/mediapipe/faceLandmarker";
import { FaceLandmarker, FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export const useFaceLandmarker = () => {
  const [results, setResults] = useState<FaceLandmarkerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameId = useRef<number>(0);

  // Mediapipeとカメラの初期化
  useEffect(() => {
    const isMounted = true;
    const setup = async () => {
      try {
        const landmarker = await createFaceLandmarker();
        faceLandmarkerRef.current = landmarker;
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("This browser doesn't support access to camera device");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
          },
        });
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      } catch (e: unknown) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
  }, []);

  // 毎フレームの検出処理
  const predictWebcam = () => {
    if (!videoRef.current || faceLandmarkerRef.current) return;
    // ビデオが再生可能な状態になってから実行
    if (videoRef.current.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(predictWebcam);
    }
    const startTimeMs = performance.now();
  };
};
