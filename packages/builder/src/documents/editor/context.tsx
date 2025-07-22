"use client";

import { create, StoreApi, UseBoundStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import z from "zod";

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { findBlock, findParentBlock, validateBlocks } from "../helpers/blocks";
import { BuilderSchema, EditorDocumentBlocksDictionary } from "../types";
import {
  BlockDisableOptions,
  TEditorBlock,
  TEditorConfiguration,
} from "./core";
import { EditorHistory, EditorHistoryEntry } from "./history";
import { editorHistoryReducer } from "./reducers";

export type ViewportSize =
  // | "original"
  | "desktop"
  | "largeDesktop"
  | "laptop"
  | "tablet"
  | "mobile"
  | "mobileLandscape";

type EditorState = {
  blocks: EditorDocumentBlocksDictionary<any>;
  rootBlock: TEditorBlock;
  schemas: BuilderSchema;

  errors: Record<
    string,
    {
      type: string;
      error: z.ZodError;
    }
  >;

  document: TEditorBlock;
  history: EditorHistory;
  onChange?: (document: TEditorConfiguration) => void;

  selectedBlockId: string | null;
  selectedSidebarTab: "block-configuration" | "styles";
  selectedScreenSize: ViewportSize;
  fullScreen: boolean;

  inspectorDrawerOpen: boolean;
  activeOverBlock: {
    blockId: string;
    property: string;
  } | null;
  activeDragBlock: {
    block: TEditorBlock;
    parentBlockId: string;
    parentProperty: string;
  } | null;
  blockDisableOptions: Record<string, BlockDisableOptions | undefined>;
};

const createEditorStateStore = ({
  blocks,
  rootBlock,
  document,
  schemas,
}: {
  blocks: EditorDocumentBlocksDictionary<any>;
  rootBlock: TEditorBlock;
  schemas: BuilderSchema;
  document?: TEditorConfiguration;
}) => {
  const defaultDocument = document || rootBlock;
  return create<EditorState>(() => ({
    document: defaultDocument,
    blocks,
    rootBlock,
    schemas,
    errors: {},
    history: {
      entries: [
        {
          type: "document",
          value: {
            document: defaultDocument,
          },
        },
      ],
      index: 0,
    },
    selectedBlockId: null,
    selectedSidebarTab: "styles",
    // selectedScreenSize: "original",
    selectedScreenSize: "laptop",
    fullScreen: false,

    inspectorDrawerOpen: true,
    activeDragBlock: null,
    activeOverBlock: null,
    blockDisableOptions: {},
  }));
};

export type EditorStateStore = ReturnType<typeof createEditorStateStore>;

const EditorStateContext = createContext<UseBoundStore<
  StoreApi<EditorState>
> | null>(null);

export const EditorStateProvider: FC<
  PropsWithChildren<{
    blocks: EditorDocumentBlocksDictionary<any>;
    rootBlock: TEditorBlock;
    document?: TEditorConfiguration;
    schemas: BuilderSchema;
  }>
> = ({ children, ...props }) => {
  const storeRef = useRef<EditorStateStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createEditorStateStore(props);
  }

  return (
    <EditorStateContext.Provider value={storeRef.current}>
      {children}
    </EditorStateContext.Provider>
  );
};

export const useEditorStateStore = <T,>(
  selector: (state: EditorState) => T
): T => {
  const store = useContext(EditorStateContext);
  if (!store)
    throw new Error("Missing EditorStateContext.Provider in the tree");

  return useStore(store, selector);
};

export function getEditorStateStore() {
  const store = useContext(EditorStateContext);
  if (!store)
    throw new Error("Missing EditorStateContext.Provider in the tree");

  return store;
}

// Optimized state setters with selective updates
const setEditorStateStore = (
  store: EditorStateStore,
  set: Partial<EditorState> | ((prev: EditorState) => Partial<EditorState>)
) => {
  store.setState(set);
};

// Memoized selectors to prevent unnecessary re-renders
export function useDocument() {
  return useEditorStateStore(useShallow((s) => s.document));
}

export function useBlocks() {
  return useEditorStateStore(useShallow((s) => s.blocks));
}

export function useRootBlock() {
  return useEditorStateStore(useShallow((s) => s.rootBlock));
}

export function useSelectedBlockId() {
  return useEditorStateStore(useShallow((s) => s.selectedBlockId));
}

export const useSelectedBlock = () => {
  const selectedBlockId = useSelectedBlockId();
  const document = useDocument();

  const block = useMemo(
    () => (selectedBlockId ? findBlock(document, selectedBlockId) : null),
    [document, selectedBlockId]
  );

  return block;
};

export function useSelectedScreenSize() {
  return useEditorStateStore(useShallow((s) => s.selectedScreenSize));
}

export function useSelectedSidebarTab() {
  return useEditorStateStore(useShallow((s) => s.selectedSidebarTab));
}

export function useFullScreen() {
  return useEditorStateStore(useShallow((s) => s.fullScreen));
}

export function useActiveDragBlock() {
  return useEditorStateStore(useShallow((s) => s.activeDragBlock));
}

export function useBlockDisableOptions(
  blockId: string | undefined
): BlockDisableOptions | undefined {
  return useEditorStateStore(
    useShallow((s) => (blockId ? s.blockDisableOptions[blockId] : undefined))
  );
}

// Stable function references to prevent re-renders
export function useSetBlockDisableOptions() {
  const store = getEditorStateStore();
  return useCallback(
    (blockId: string, options: BlockDisableOptions | undefined) => {
      setEditorStateStore(store, (prev) => ({
        ...prev,
        blockDisableOptions: {
          ...prev.blockDisableOptions,
          [blockId]: options,
        },
      }));
    },
    [store]
  );
}

export function useSetActiveDragBlock() {
  const store = getEditorStateStore();
  return useCallback(
    (
      active: {
        block: TEditorBlock;
        parentBlockId: string;
        parentProperty: string;
      } | null
    ) => {
      setEditorStateStore(store, {
        activeDragBlock: active,
      });
    },
    [store]
  );
}

export function useActiveOverBlock() {
  return useEditorStateStore(useShallow((s) => s.activeOverBlock));
}

export function useSetActiveOverBlock() {
  const store = getEditorStateStore();
  return useCallback(
    (activeOverBlock: { blockId: string; property: string } | null) => {
      setEditorStateStore(store, {
        activeOverBlock,
      });
    },
    [store]
  );
}

export function useSetSelectedBlockId() {
  const store = getEditorStateStore();
  return useCallback(
    (selectedBlockId: EditorState["selectedBlockId"]) => {
      const selectedSidebarTab =
        selectedBlockId === null ? "styles" : "block-configuration";
      const options: Partial<EditorState> = {};
      if (selectedBlockId !== null) {
        options.inspectorDrawerOpen = true;
      }

      setEditorStateStore(store, {
        selectedBlockId,
        selectedSidebarTab,
        ...options,
      });
    },
    [store]
  );
}

export function useSetSidebarTab() {
  const store = getEditorStateStore();
  return useCallback(
    (selectedSidebarTab: EditorState["selectedSidebarTab"]) => {
      setEditorStateStore(store, { selectedSidebarTab });
    },
    [store]
  );
}

export function useResetDocument() {
  const store = getEditorStateStore();
  return useCallback(
    (
      document?: EditorState["document"],
      onChange?: EditorState["onChange"]
    ) => {
      const newDocument = document || store.getState().rootBlock;

      setEditorStateStore(store, (prev) => ({
        document: newDocument,
        onChange,
        errors: {},
        history: {
          entries: [
            {
              type: "document",
              value: {
                document: newDocument,
              },
            },
          ],
          index: 0,
        },
        selectedSidebarTab: "styles",
        selectedBlockId: null,
      }));
    },
    [store]
  );
}

// Optimized action dispatcher with memoized state access
export function useDispatchAction() {
  const store = getEditorStateStore();

  return useCallback(
    (action: EditorHistoryEntry) => {
      const state = store.getState();
      const { history, document, selectedBlockId, schemas, onChange } = state;

      // Update history entry if needed
      if (
        history.entries.length > 0 &&
        history.index === 0 &&
        history.entries[0].type === "document" &&
        history.entries[0].value.document !== document
      ) {
        history.entries[0].value.document = document;
      }

      const result = editorHistoryReducer(document, selectedBlockId, action);

      const newHistoryEntries = [
        ...history.entries.slice(0, history.index + 1),
        action,
      ];

      // Selective update to prevent unnecessary re-renders
      setEditorStateStore(store, {
        document: result.document,
        selectedBlockId: result.selectedBlockId,
        history: {
          entries: newHistoryEntries,
          index: newHistoryEntries.length - 1,
        },
      });

      validateStoreState(result.document, schemas, store);
      onChange?.(result.document);
    },
    [store]
  );
}

export function canUndoHistory(history: EditorState["history"]) {
  return history.index > 0;
}

export function canRedoHistory(history: EditorState["history"]) {
  return history.index < history.entries.length - 1;
}

export function useUndoHistory() {
  const store = getEditorStateStore();

  return useCallback(() => {
    const state = store.getState();
    let { document, history, selectedBlockId, schemas, onChange } = state;

    if (!canUndoHistory(history)) return;

    for (let i = 0; i < history.index; i++) {
      const result = editorHistoryReducer(
        document,
        selectedBlockId,
        history.entries[i]
      );
      document = result.document;
      selectedBlockId = result.selectedBlockId;
    }

    setEditorStateStore(store, {
      document,
      selectedBlockId,
      history: {
        ...history,
        index: history.index - 1,
      },
    });

    validateStoreState(document, schemas, store);
    onChange?.(document);
  }, [store]);
}

export function useRedoHistory() {
  const store = getEditorStateStore();

  return useCallback(() => {
    const state = store.getState();
    const { document, history, selectedBlockId, schemas, onChange } = state;

    if (!canRedoHistory(history)) return;

    const result = editorHistoryReducer(
      document,
      selectedBlockId,
      history.entries[history.index + 1]
    );

    setEditorStateStore(store, {
      document: result.document,
      selectedBlockId: result.selectedBlockId,
      history: {
        ...history,
        index: history.index + 1,
      },
    });

    validateStoreState(result.document, schemas, store);
    onChange?.(result.document);
  }, [store]);
}

function validateStoreState(
  document: EditorState["document"],
  schemas: BuilderSchema,
  store: EditorStateStore
) {
  const errors = validateBlocks(document, schemas);

  setEditorStateStore(store, {
    errors,
  });
}

export function useEditorStateErrors() {
  return useEditorStateStore(useShallow((s) => s.errors));
}

export function useToggleInspectorDrawerOpen() {
  const store = getEditorStateStore();
  return useCallback(() => {
    const inspectorDrawerOpen = !store.getState().inspectorDrawerOpen;
    setEditorStateStore(store, { inspectorDrawerOpen });
  }, [store]);
}

export function useSetSelectedScreenSize() {
  const store = getEditorStateStore();
  return useCallback(
    (selectedScreenSize: EditorState["selectedScreenSize"]) => {
      setEditorStateStore(store, { selectedScreenSize });
    },
    [store]
  );
}

export function useToggleFullScreen() {
  const store = getEditorStateStore();
  return useCallback(() => {
    const fullScreen = !store.getState().fullScreen;
    setEditorStateStore(store, { fullScreen });
  }, [store]);
}

// Optimized block selection hook
export function useBlock(blockId: string | null) {
  return useEditorStateStore(
    useShallow((s) => {
      if (!blockId) return null;
      return findBlock(s.document, blockId);
    })
  );
}

// Optimized block parent hook
export function useBlockParent(blockId: string | null) {
  return useEditorStateStore(
    useShallow((s) => {
      if (!blockId) return null;
      return findParentBlock(s.document, blockId);
    })
  );
}

// Optimized block children hook
export function useBlockChildren(blockId: string | null) {
  return useEditorStateStore(
    useShallow((s) => {
      if (!blockId) return null;
      const block = findBlock(s.document, blockId);
      if (!block) return null;

      // Extract children from block data
      const children: TEditorBlock[] = [];
      const extractChildren = (obj: any) => {
        if (!obj || typeof obj !== "object") return;
        for (const prop of Object.keys(obj)) {
          if (prop === "children" && Array.isArray(obj[prop])) {
            children.push(
              ...obj[prop].filter((child: any) => child && "id" in child)
            );
          } else {
            extractChildren(obj[prop]);
          }
        }
      };

      extractChildren(block.data);
      return children;
    })
  );
}

export const EditorArgsContext = createContext<Record<string, any>>({});
export function useEditorArgs() {
  return useContext(EditorArgsContext);
}
