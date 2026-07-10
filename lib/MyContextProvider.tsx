"use client";

import { createContext, useEffect, useState, ReactNode } from "react";

type TContextProvider = {
  windowWidth: number;
};

export const ContextProvider = createContext<TContextProvider | null>(null);

const MyContextProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initialization (no effect needed for initial width)
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (typeof window !== "undefined") return window.innerWidth;
    return 0; // fallback for SSR
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <ContextProvider.Provider value={{ windowWidth }}>
      {children}
    </ContextProvider.Provider>
  );
};

export default MyContextProvider;
