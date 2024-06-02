import { RotateCw } from "lucide-react";

export default function Start({
  end,
  score,
}: {
  end: () => void;
  score: number;
}) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl">Game Over</h1>
      <p>Score: {score}</p>
      <button
        className="border-2 border-secondary rounded-md p-2"
        onClick={end}
      >
        <RotateCw size={50} />
      </button>
    </div>
  );
}
