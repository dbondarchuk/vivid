"use client";
import React, { createContext, useContext } from "react";

interface PortalContextType {
  document: Document;
  body: HTMLElement;
}

const PortalContext = createContext<PortalContextType>({
  document: typeof document !== "undefined" ? document : ({} as Document),
  body: typeof document !== "undefined" ? document.body : ({} as HTMLElement),
});

export const usePortalContext = () => useContext(PortalContext);

interface PortalProviderProps {
  children: React.ReactNode;
  document?: Document;
}

export const PortalProvider: React.FC<PortalProviderProps> = ({
  children,
  document: customDocument,
}) => {
  const defaultDocument =
    typeof document !== "undefined" ? document : ({} as Document);
  const doc = customDocument || defaultDocument;

  const value: PortalContextType = {
    document: doc,
    body: doc.body || ({} as HTMLElement),
  };

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
};
