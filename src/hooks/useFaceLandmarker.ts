import { NOSE_TIP_INDEX } from "@/lib/mediapipe/const";
import { createFaceLandmarker } from "@/lib/mediapipe/faceLandmarker";
import { FaceLandmarker, FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export const useFaceLandmarker = () => {
  const [results, setResults] = useState<FaceLandmarkerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameId = useRef<number>(NOSE_TIP_INDEX);

  // Mediapipeとカメラの初期化
  useEffect(() => {
    let isMounted = true;
    const setup = async () => {
      try {
        const landmarker = await createFaceLandmarker();
        faceLandmarkerRef.current = landmarker;
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("This browser doesn't support access to camera device");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            videoRef.current?.play();
            predictWebcam();
          });
        }
      } catch (e: unknown) {
        if (isMounted && e instanceof Error) setError(e.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    setup();

    return () => {
      isMounted = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  // 毎フレームの検出処理
  const predictWebcam = () => {
    if (!videoRef.current || !faceLandmarkerRef.current) return;
    // ビデオが再生可能な状態になってから実行
    if (videoRef.current.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(predictWebcam);
      return;
    }
    const startTimeMs = performance.now();
    const newResults = faceLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
    setResults(newResults);
    animationFrameId.current = requestAnimationFrame(predictWebcam);
  };

  return { videoRef, results, isLoading, error };
};
