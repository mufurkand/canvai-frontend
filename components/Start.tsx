import { Play } from "lucide-react";
import { highscoreSchema } from "@/schemas/highscore";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Start({ start }: { start: () => void }) {
  const [leaderboard, setLeaderboard] = useState<
    z.infer<typeof highscoreSchema>[]
  >([]);

  useEffect(() => {
    async function getHighscores() {
      if (process.env.NEXT_PUBLIC_BACKEND_URL === undefined)
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined.");
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/leaderboard"
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      const result = highscoreSchema.array().safeParse(data.data.highscores);

      if (!result.success) {
        throw new Error("Failed to parse data");
      }
      setLeaderboard(result.data);
    }
    getHighscores();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center gap-10">
      <button
        className="border-2 border-secondary rounded-md p-2"
        onClick={start}
      >
        <Play size={50} />
      </button>
      <ul className="border-2 border-secondary rounded-md p-2">
        <p className="border-b-2 border-secondary text-center mb-2">
          Leaderboard
        </p>
        {leaderboard.map((highscore, index) => (
          <li key={highscore.id}>
            {index + 1}. {highscore.username} - {highscore.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
