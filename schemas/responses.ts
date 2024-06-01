import { z } from "zod";

const startSuccessSchema = z.object({
  type: z.string(),
  data: z.object({
    image: z.string(),
    message: z.string(),
    startEpoch: z.number(),
  }),
});

const startErrorSchema = z.object({
  type: z.string(),
  data: z.object({
    status: z.string(),
    message: z.string(),
  }),
});

const predictionErrorSchema = z.object({
  type: z.string(),
  data: z.object({
    status: z.string(),
    message: z.string(),
  }),
});

const predictionSuccessSchema = z.object({
  type: z.string(),
  data: z.object({
    status: z.string(),
    prediction: z.string(),
    probability: z.number(),
    isPredicted: z.boolean(),
    timeTaken: z.number(),
    gainedScore: z.number(),
    nextImage: z.string(),
  }),
});

const predictionFailureSchema = z.object({
  type: z.string(),
  data: z.object({
    status: z.string(),
    prediction: z.string(),
    probability: z.number(),
    isPredicted: z.boolean(),
  }),
});

const finishSchema = z.object({
  type: z.string(),
  data: z.object({
    message: z.string(),
    score: z.number(),
  }),
});

export {
  startSuccessSchema,
  startErrorSchema,
  predictionErrorSchema,
  predictionSuccessSchema,
  predictionFailureSchema,
  finishSchema,
};
