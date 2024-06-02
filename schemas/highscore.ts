import { z } from "zod";

const highscoreSchema = z.object({
  date: z.string(),
  id: z.string(),
  score: z.number(),
  username: z.string(),
});

export { highscoreSchema };
