'use client';
import Script from "next/script";
import twConfig from "../../tailwind.config"

export const TwLoad = () => {
    return (
    <Script src="https://cdn.tailwindcss.com" onLoad={() => {
        // @ts-ignore
        tailwind.config = {
            theme: twConfig.theme
          }}}></Script>
    )
}