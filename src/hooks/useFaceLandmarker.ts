import { createFaceLandmarker } from "@/lib/mediapipe/faceLandmarker";
import { FaceLandmarker, FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export const useFaceLandmarker = () => {
  const [results, setResults] = useState<FaceLandmarkerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker>(null);
  const animationFrameId = useRef<number>(-1);

  // const prepareVideoStream = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: false,
  //     video: true,
  //   });

  //   if (videoRef.current) {
  //     videoRef.current.srcObject = stream;
  //     videoRef.current.addEventListener("loadeddata", () => {
  //       process();
  //     });
  //   }
  // };

  // const process = async () => {
  //   const lastWebcamTime = -1;
  //   const faceLandmarker = await createFaceLandmarker();
  //   faceLandmarkerRef.current = faceLandmarker;

  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext("2d");
  //   const video = videoRef.current!;
  // };

  // Mediapipeとカメラの初期化
  useEffect(() => {
    const setup = async () => {
      try {
        const landmarker = await createFaceLandmarker();
        faceLandmarkerRef.current = landmarker;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        console.log(`videoRef.current: ${videoRef.current}`);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            videoRef.current?.play();
            predictWebcam();
          });
        }
      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    setup();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, [videoRef.current, faceLandmarkerRef.current]);

  // 毎フレームの検出処理
  const predictWebcam = () => {
    if (!videoRef.current || !faceLandmarkerRef.current) return;
    // ビデオが再生可能な状態になってから実行
    if (videoRef.current.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(predictWebcam);
      return;
    }
    const startTimeMs = performance.now();
    const newResults = faceLandmarkerRef.current.detectForVideo(
      videoRef.current,
      startTimeMs
    );
    setResults(newResults);
    animationFrameId.current = requestAnimationFrame(predictWebcam);
  };

  return { videoRef, results, isLoading, error };
};
