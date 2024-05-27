"use client";

import Canvas from "@/components/Canvas";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [changeTheme, setChangeTheme] = useState(false);
  const themes = useRef<string[]>([
    "dog",
    "bed",
    "bicycle",
    "house",
    "flower",
    "tree",
    "car",
  ]);

  useEffect(() => {
    // TODO: game over screen
    if (themes.current.length === 0) return;

    const randomIndex = Math.floor(Math.random() * themes.current.length);
    setTheme(themes.current[randomIndex]);
    themes.current.splice(randomIndex, 1);

    setChangeTheme(false);
  }, [changeTheme]);

  return <Canvas theme={theme} setChangeTheme={setChangeTheme} />;
}
