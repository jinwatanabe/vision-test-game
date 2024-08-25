import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [circleSize, setCircleSize] = useState(0);
  const [isCircleVisible, setIsCircleVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [imageSrc, setImageSrc] = useState("top.png");
  const [points, setPoints] = useState(0);
  const [borderColor, setBorderColor] = useState("blue");
  const [inputReceived, setInputReceived] = useState(false);
  const [selectedSize, setSelectedSize] = useState(100); // 視力検査のサイズ選択
  const [backgroundChanged, setBackgroundChanged] = useState(false); // 背景変更トリガー
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (isStarted) {
      const timings = [
        1200, 4400, 8800, 12000, 16800, 22400, 27200, 31200, 34000, 38000,
        42000, 46800, 49200,
      ];
      const images = ["top.png", "bottom.png", "right.png", "left.png"];
      const timeouts: Array<number> = [];

      timings.forEach((timing) => {
        const timeoutId = setTimeout(() => {
          setBorderColor("blue");
          setInputReceived(false);
          const randomImage = images[Math.floor(Math.random() * images.length)];
          setImageSrc(randomImage);

          setCircleSize(0);
          setIsCircleVisible(true);

          const startTime = performance.now();
          const animationId = requestAnimationFrame(function animate(time) {
            const progress = (time - startTime) / 1000;
            setCircleSize(progress * selectedSize);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setTimeout(() => {
                setIsCircleVisible(false);
              }, 1800);
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
  }, [isStarted, selectedSize]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCircleVisible && !inputReceived) {
        if (
          (event.key === "ArrowRight" && imageSrc === "right.png") ||
          (event.key === "ArrowDown" && imageSrc === "bottom.png") ||
          (event.key === "ArrowLeft" && imageSrc === "left.png") ||
          (event.key === "ArrowUp" && imageSrc === "top.png")
        ) {
          setPoints((prevPoints) => prevPoints + 1);
          setBorderColor("red");
          setInputReceived(true);

          // 背景変更ロジック
          if (points + 1 === 3 && !backgroundChanged) {
            setBackgroundChanged(true);
          }

          setTimeout(() => {
            setBorderColor("blue");
          }, 1000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageSrc, isCircleVisible, inputReceived, points, backgroundChanged]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white"
      style={{
        background: backgroundChanged
          ? "none"
          : "linear-gradient(to bottom right, #48c6ef, #6f86d6)",
      }}
    >
      {backgroundChanged && (
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src="background.mp4" type="video/mp4" />
        </video>
      )}
      <audio ref={audioRef} src="song.mp3" />
      <div
        className="relative flex items-center justify-center z-10"
        style={{
          width: `${selectedSize}px`,
          height: `${selectedSize}px`,
        }}
      >
        <div
          className={`absolute inset-0 border-4 rounded-full flex items-center justify-center border-${borderColor}-500`}
          style={{
            width: `${selectedSize}px`,
            height: `${selectedSize}px`,
          }}
        >
          {isCircleVisible && (
            <img
              src={imageSrc}
              alt="direction"
              style={{
                width: `${selectedSize * 0.9}px`,
                height: `${selectedSize * 0.9}px`,
                transform: `scale(${circleSize / selectedSize})`,
                transition: "transform 1s linear",
              }}
            />
          )}
        </div>
      </div>
      <div className="my-8 text-3xl font-bold z-10">Points: {points}</div>
      <div className="flex items-center space-x-4 mt-8 z-10">
        <select
          onChange={(e) => setSelectedSize(Number(e.target.value))}
          className="bg-gray-800 text-white p-2 rounded-lg"
        >
          <option value={100}>視力1.0</option>
          <option value={120}>視力0.9</option>
          <option value={140}>視力0.8</option>
          <option value={160}>視力0.7</option>
          <option value={180}>視力0.6</option>
          <option value={200}>視力0.5</option>
          <option value={220}>視力0.4</option>
          <option value={240}>視力0.3</option>
          <option value={260}>視力0.2</option>
          <option value={280}>視力0.1</option>
        </select>
        <button
          onClick={handleStart}
          className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default App;
