"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MIN_SCROLL = 1950; //Startボタンが出現する終了位置
const MAX_SCROLL = 1850; //Startボタンが出現する開始位置

function MovingCamera({ scrollY }: { scrollY: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // スクロール量に応じてカメラ位置を更新
    camera.position.z = 0 + scrollY * 0.025;
    camera.position.x = scrollY * 0.005;
    camera.position.y = scrollY * 0.005;
    camera.lookAt(10, 0, 0); // 注視点は固定
  });

  return null;
}

function BackgroundPlane() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    new THREE.TextureLoader().load("indian.png", (tex) => {
      setTexture(tex);
    });
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -50]}>
      <planeGeometry args={[100, 50]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [scrollEnded, setScrollEnded] = useState(false);

  const handleClick = () => {
    router.push("/Warning");
  };

  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (event: WheelEvent) => {
      setScrollY((prev) => {
        const next = prev + event.deltaY;
        setScrollEnded(next >= MAX_SCROLL && next <= MIN_SCROLL);
        return Math.max(next, 0);
      });
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touchCurrentY = event.touches[0].clientY;
      const delta = touchCurrentY - touchStartY; // 下にスワイプしたら delta > 0
      setScrollY((prev) => {
        const next = prev + delta;
        setScrollEnded(next >= MAX_SCROLL && next <= MIN_SCROLL);
        return Math.max(next, 0);
      });
      touchStartY = touchCurrentY; // 更新
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false }); // preventDefault する場合 false

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        className="fixed top-0 left-0 w-full h-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} />

        <MovingCamera scrollY={scrollY} />
        <BackgroundPlane />

        <Text3D
          font="helvetiker_regular.typeface.json"
          size={1.2}
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.03}
          bevelSegments={5}
          position={[0, 0, 0]}
        >
          Welcome to Underground !
          <meshStandardMaterial color="yellow" />
        </Text3D>
      </Canvas>

      {scrollEnded && (
        <button
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-8 py-4 text-2xl font-bold bg-red-600 text-white rounded-2xl shadow-lg hover:bg-red-700 transition"
          onClick={handleClick}
        >
          Start
        </button>
      )}
    </div>
  );
}
