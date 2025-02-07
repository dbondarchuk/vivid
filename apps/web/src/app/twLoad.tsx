"use client";
import Script from "next/script";
import twConfig from "../../tailwind.config";

export const TwLoad = () => {
  return (
    <Script
      strategy="afterInteractive"
      src="https://cdn.tailwindcss.com"
      id="dynamic-tailwind"
      onLoad={() => {
        //@ts-ignore
        window.tailwind.config = twConfig;
      }}
    />
  );
};
