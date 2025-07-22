"use client";

import { useI18n } from "@vivid/i18n";
import { cn, ScrollArea, ScrollBar } from "@vivid/ui";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePortalContext } from "../../documents/blocks/helpers/block-wrappers/portal-context";
import { ViewportSize } from "../../documents/editor/context";

interface ViewportEmulatorProps {
  children: React.ReactNode;
  viewportSize: ViewportSize;
  className?: string;
}

const VIEWPORT_SIZES = {
  original: { width: 1440, height: 900, name: "Original" },
  laptop: { width: 1280, height: 800, name: "Laptop" },
  desktop: { width: 1440, height: 900, name: "Desktop" },
  largeDesktop: { width: 1920, height: 1080, name: "Large Desktop" },
  tablet: { width: 768, height: 1024, name: "Tablet" },
  mobile: { width: 375, height: 667, name: "Mobile" },
  mobileLandscape: { width: 667, height: 375, name: "Mobile Landscape" },
} as const;

export const ViewportEmulator: React.FC<ViewportEmulatorProps> = ({
  children,
  viewportSize,
  className,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const prevViewportSizeRef = useRef<ViewportSize>(viewportSize);

  const currentSize = VIEWPORT_SIZES[viewportSize];

  const t = useI18n("builder");

  //   // Reset iframe ready state only when switching from original to other viewport sizes
  //   useEffect(() => {

  //   }, [viewportSize]);

  // Copy styles from parent window to iframe only when switching from original to other viewport sizes
  useEffect(() => {
    const copyStylesToIframe = () => {
      if (!iframeRef.current?.contentDocument) return;

      const iframeDoc = iframeRef.current.contentDocument;
      const iframeHead = iframeDoc.head;
      const iframeBody = iframeDoc.body;

      // Clear existing content
      iframeHead.innerHTML = "";
      iframeBody.innerHTML = "";

      // Copy all stylesheets from parent document
      const parentStylesheets = document.querySelectorAll(
        'link[rel="stylesheet"], style'
      );
      parentStylesheets.forEach((stylesheet) => {
        if (stylesheet.tagName === "LINK") {
          const link = iframeDoc.createElement("link");
          link.rel = "stylesheet";
          link.href = (stylesheet as HTMLLinkElement).href;
          iframeHead.appendChild(link);
        } else if (stylesheet.tagName === "STYLE") {
          const style = iframeDoc.createElement("style");
          style.textContent = (stylesheet as HTMLStyleElement).textContent;
          iframeHead.appendChild(style);
        }
      });

      // Copy computed styles for common elements
      const baseStyles = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          overflow-x: hidden;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #333;
          background: #fff;
        }
        
        #root {
          width: 100%;
          min-height: 100vh;
          position: relative;
        }
      `;

      const baseStyleElement = iframeDoc.createElement("style");
      baseStyleElement.textContent = baseStyles;
      iframeHead.appendChild(baseStyleElement);

      // Copy CSS custom properties from parent
      const parentComputedStyle = getComputedStyle(document.documentElement);
      const cssVars = [];
      for (let i = 0; i < parentComputedStyle.length; i++) {
        const property = parentComputedStyle[i];
        if (property.startsWith("--")) {
          const value = parentComputedStyle.getPropertyValue(property);
          cssVars.push(`${property}: ${value};`);
        }
      }

      if (cssVars.length > 0) {
        const cssVarsStyle = iframeDoc.createElement("style");
        cssVarsStyle.textContent = `
          :root {
            ${cssVars.join("\n")}
          }
        `;
        iframeHead.appendChild(cssVarsStyle);
      }

      // Copy Tailwind CSS if it exists in parent
      const tailwindScript = document.querySelector(
        'script[src*="tailwindcss"]'
      );
      if (tailwindScript) {
        const script = iframeDoc.createElement("script");
        script.src = (tailwindScript as HTMLScriptElement).src;
        iframeHead.appendChild(script);
      }

      // Create root element if it doesn't exist
      if (!iframeDoc.getElementById("root")) {
        const root = iframeDoc.createElement("div");
        root.id = "root";
        iframeBody.appendChild(root);
      }

      setIframeReady(true);
    };

    const prevSize = prevViewportSizeRef.current;

    // if (prevSize === "original" && viewportSize !== "original") {
    //   setIframeReady(false);
    //   // Use a timeout to ensure iframe is ready
    //   prevViewportSizeRef.current = viewportSize;

    //   const timer = setTimeout(copyStylesToIframe, 100);
    //   return () => clearTimeout(timer);
    // } else {
    //   prevViewportSizeRef.current = viewportSize;
    // }

    setIframeReady(false);
    // Use a timeout to ensure iframe is ready
    prevViewportSizeRef.current = viewportSize;

    const timer = setTimeout(copyStylesToIframe, 100);
    return () => clearTimeout(timer);
  }, []);

  // If viewport size is "original", render children directly without iframe
  // if (viewportSize === "original") {
  //   return <>{children}</>;
  // }

  return (
    <>
      <ScrollArea className={cn("viewport-emulator-scroll", className)}>
        <div className={cn("viewport-emulator")}>
          {/* Device frame */}
          <div className="device-frame">
            {/* <div className="device-header">
              <span className="device-name">
                {t(`baseBuilder.builderToolbar.view.${viewportSize}`)}
              </span>
              <span className="device-dimensions">
                {currentSize.width} × {currentSize.height}
              </span>
            </div> */}

            {/* Iframe container */}
            <div
              className="iframe-container"
              style={{
                width: currentSize.width,
                height: currentSize.height,
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            >
              <iframe
                ref={iframeRef}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  backgroundColor: "#fff",
                }}
                title={`${currentSize.name} Viewport`}
                onLoad={() => {
                  // Iframe loaded, styles will be copied via the effect
                }}
              />
              {iframeReady && iframeRef.current?.contentDocument?.body && (
                <IframePortal document={iframeRef.current.contentDocument}>
                  {children}
                </IframePortal>
              )}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <style>{`
        .viewport-emulator-scroll {
          width: 100%;
          overflow-x: auto;
          display: grid;
        }

        .viewport-emulator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          min-width: max-content;
        }

        .viewport-emulator-original {
          width: 100%;
          height: 100%;
        }

        .device-frame {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .device-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .device-name {
          font-weight: 600;
          color: #374151;
        }

        .device-dimensions {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
        }

        .iframe-container {
          position: relative;
        }
      `}</style>
    </>
  );
};

// Component to render React content into iframe
interface IframePortalProps {
  document: Document;
  children: React.ReactNode;
}

const IframePortal: React.FC<IframePortalProps> = ({ document, children }) => {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  const { setDocument } = usePortalContext();

  useEffect(() => {
    setDocument(document);
  }, [document]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      setRootElement(root);
    }
  }, [document]);

  if (!rootElement) {
    return null;
  }

  return createPortal(
    <>
      <style>{`
        #root {
          border: 2px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        :root {
          --font-primary: 'Inter', sans-serif;
        }

        body {
          background: #f8f9fa;
          padding: 2rem;
        }

      `}</style>
      {children}
    </>,
    rootElement
  );
};
