import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [circleSize, setCircleSize] = useState(0);
  const [isCircleVisible, setIsCircleVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
  };

  useEffect(() => {
    if (isStarted) {
      const timings = [1000, 5000, 15000]; // 1秒、5秒、15秒
      // 'timeouts' は再代入されないため const を使用
      const timeouts: Array<number> = [];

      timings.forEach((timing) => {
        const timeoutId = setTimeout(() => {
          setCircleSize(0);
          setIsCircleVisible(true);

          const startTime = performance.now();
          const animationId = requestAnimationFrame(function animate(time) {
            const progress = (time - startTime) / 1000;
            setCircleSize(progress * 100);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setTimeout(() => {
                setIsCircleVisible(false);
              }, 2000);
            }
          });

          return () => {
            cancelAnimationFrame(animationId);
          };
        }, timing);

        timeouts.push(timeoutId);
      });

      // クリーンアップ関数
      return () => {
        timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      };
    }
  }, [isStarted]);

  return (
    <>
      <button
        onClick={handleStart}
        className="mb-4 bg-blue-500 text-white p-2 rounded"
      >
        Start
      </button>
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full">
          {isCircleVisible && (
            <img
              src="top.png"
              style={{
                transform: `scale(${circleSize / 100})`,
                transition: "transform 1s linear",
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
