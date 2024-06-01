import { Play } from "lucide-react";

export default function Start({ start }: { start: () => void }) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-5">
      <button
        className="border-2 border-secondary rounded-md p-2"
        onClick={start}
      >
        <Play size={50} />
      </button>
    </div>
  );
}
