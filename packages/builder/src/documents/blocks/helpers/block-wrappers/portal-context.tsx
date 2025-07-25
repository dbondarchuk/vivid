"use client";
import React, { createContext, useContext, useState } from "react";

interface PortalContextType {
  document: Document;
  body: HTMLElement;
  setDocument: (document: Document) => void;
}

const PortalContext = createContext<PortalContextType>({
  document: typeof document !== "undefined" ? document : ({} as Document),
  body: typeof document !== "undefined" ? document.body : ({} as HTMLElement),
  setDocument: () => {},
});

export const usePortalContext = () =>
  useContext(PortalContext) ?? {
    document: typeof document !== "undefined" ? document : ({} as Document),
    body: typeof document !== "undefined" ? document.body : ({} as HTMLElement),
    setDocument: () => {},
  };

interface PortalProviderProps {
  children: React.ReactNode;
}

export const PortalProvider: React.FC<PortalProviderProps> = ({ children }) => {
  const [stateDocument, setDocument] = useState<Document>(document);

  const value: PortalContextType = {
    document: stateDocument,
    body: stateDocument.body || ({} as HTMLElement),
    setDocument,
  };

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
};
