"use client";

import Canvas from "@/components/Canvas";
import { useRef, useState } from "react";
import {
  startSuccessSchema,
  startErrorSchema,
  predictionErrorSchema,
  predictionSuccessSchema,
  predictionFailureSchema,
  finishSchema,
} from "@/schemas/responses";
import Start from "@/components/Start";
import End from "@/components/End";

export default function Home() {
  const wsInstance = useRef<WebSocket | null>(null);
  const [theme, setTheme] = useState("");
  const [prediction, setPrediction] = useState("");
  const [isReady, setIsReady] = useState(true);
  const [score, setScore] = useState(-1);

  async function start() {
    wsInstance.current = await setupWebSocket();
    setIsReady(false);
  }

  function end() {
    setPrediction("");
    setTheme("");
    setIsReady(true);
    setScore(-1);
  }

  async function setupWebSocket() {
    if (process.env.NEXT_PUBLIC_BACKEND_WS_URL === undefined)
      throw new Error("NEXT_PUBLIC_BACKEND_WS_URL is not defined.");

    const ws = new WebSocket(process.env.NEXT_PUBLIC_BACKEND_WS_URL);

    ws.onopen = () => {
      const query = {
        type: "start",
        data: {
          duration: 60,
        },
      };
      console.log("WebSocket opened");
      ws.send(JSON.stringify(query));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      let schema;
      let result;

      // start success
      schema = startSuccessSchema;
      result = schema.safeParse(data);
      if (result.success) {
        setTheme(result.data.data.image);
        setIsReady(false);
        return;
      }

      // start error
      schema = startErrorSchema;
      result = schema.safeParse(data);
      if (result.success) {
        console.error(result.data.data.message);
        return;
      }

      // prediction success
      schema = predictionSuccessSchema;
      result = schema.safeParse(data);
      if (result.success) {
        setPrediction(result.data.data.prediction);
        setTheme(result.data.data.nextImage);
        return;
      }

      // prediction failure
      schema = predictionFailureSchema;
      result = schema.safeParse(data);
      if (result.success) {
        setPrediction(result.data.data.prediction);
        return;
      }

      // prediction error
      schema = predictionErrorSchema;
      result = schema.safeParse(data);
      if (result.success) {
        console.error(result.data.data.message);
        return;
      }

      // finish
      schema = finishSchema;
      result = schema.safeParse(data);
      if (result.success) {
        setScore(result.data.data.score);
        return;
      }

      console.error("Unknown message type");
    };

    ws.onclose = () => {
      wsInstance.current = null;
      console.log("WebSocket closed");
    };

    return ws;
  }

  if (score > -1) return <End score={score} end={end} />;
  if (isReady) return <Start start={start} />;

  return (
    <Canvas theme={theme} wsInstance={wsInstance} prediction={prediction} />
  );
}
