"use client";

import { useEffect, useRef } from "react";

export const usePrevious = <T>(value: T, initialValue: T): T => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
