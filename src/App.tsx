import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [circleSize, setCircleSize] = useState(0);
  const [isCircleVisible, setIsCircleVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [imageSrc, setImageSrc] = useState("top.png");
  const [points, setPoints] = useState(0);
  const [borderColor, setBorderColor] = useState("blue");
  const [inputReceived, setInputReceived] = useState(false); // 入力が受け付けられたかどうか

  const handleStart = () => {
    setIsStarted(true);
  };

  useEffect(() => {
    if (isStarted) {
      const timings = [1000, 5000, 15000]; // 1秒、5秒、15秒
      const images = ["top.png", "bottom.png", "right.png", "left.png"];
      const timeouts: Array<number> = [];

      timings.forEach((timing) => {
        const timeoutId = setTimeout(() => {
          setBorderColor("blue");
          setInputReceived(false); // 新しい画像が表示された時にリセット
          // ランダムに画像を選択
          const randomImage = images[Math.floor(Math.random() * images.length)];
          setImageSrc(randomImage);

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

      return () => {
        timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      };
    }
  }, [isStarted]);

  // キー押下を検知し、条件に応じてポイントを加算
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCircleVisible && !inputReceived) {
        if (event.key === "ArrowRight" && imageSrc === "right.png") {
          // ポイント加算
          setPoints((prevPoints) => prevPoints + 1);
          setBorderColor("red");
          setInputReceived(true); // 入力が受け付けられたことを記録
        } else if (event.key === "ArrowDown" && imageSrc === "bottom.png") {
          // 下キーが押された場合の処理
          setPoints((prevPoints) => prevPoints + 1);
          setBorderColor("red");
          setInputReceived(true);
        } else if (event.key === "ArrowLeft" && imageSrc === "left.png") {
          // 左キーが押された場合の処理
          setPoints((prevPoints) => prevPoints + 1);
          setBorderColor("red");
          setInputReceived(true);
        } else if (event.key === "ArrowUp" && imageSrc === "top.png") {
          // 上キーが押された場合の処理
          setPoints((prevPoints) => prevPoints + 1);
          setBorderColor("red");
          setInputReceived(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // クリーンアップ
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageSrc, isCircleVisible, inputReceived]);

  return (
    <>
      <button
        onClick={handleStart}
        className="mb-4 bg-blue-500 text-white p-2 rounded"
      >
        Start
      </button>
      <div className="relative w-32 h-32">
        <div
          className={`absolute inset-0 border-4 border-${borderColor}-500 rounded-full`}
        >
          {isCircleVisible && (
            <img
              src={imageSrc}
              style={{
                transform: `scale(${circleSize / 100})`,
                transition: "transform 1s linear",
              }}
            />
          )}
        </div>
      </div>
      <div className="mt-4">Points: {points}</div>
    </>
  );
}

export default App;
