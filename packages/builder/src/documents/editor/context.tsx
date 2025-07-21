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
} from "react";
import { findBlock, validateBlocks } from "../helpers/blocks";
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

const setEditorStateStore = (
  store: EditorStateStore,
  set: Partial<EditorState> | ((prev: EditorState) => Partial<EditorState>)
) => {
  store.setState(set);
};

export function useDocument() {
  return useEditorStateStore((s) => s.document);
}

export function useBlocks() {
  return useEditorStateStore((s) => s.blocks);
}

export function useRootBlock() {
  return useEditorStateStore((s) => s.rootBlock);
}

export function useSelectedBlockId() {
  return useEditorStateStore((s) => s.selectedBlockId);
}

export const useSelectedBlock = () => {
  const selectedBlockId = useSelectedBlockId()!;
  const document = useDocument();

  const block = useMemo(
    () => findBlock(document, selectedBlockId)!,
    [document, selectedBlockId]
  );

  return block;
};

export function useSelectedScreenSize() {
  return useEditorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedSidebarTab() {
  return useEditorStateStore((s) => s.selectedSidebarTab);
}

export function useFullScreen() {
  return useEditorStateStore((s) => s.fullScreen);
}

export function useActiveDragBlock() {
  return useEditorStateStore((s) => s.activeDragBlock);
}

export function useBlockDisableOptions(
  blockId: string | undefined
): BlockDisableOptions | undefined {
  return useEditorStateStore(
    useShallow((s) => (blockId ? s.blockDisableOptions[blockId] : undefined))
  );
}

export function useSetBlockDisableOptions() {
  const store = getEditorStateStore();
  return (blockId: string, options: BlockDisableOptions | undefined) =>
    setEditorStateStore(store, (prev) => ({
      ...prev,
      blockDisableOptions: {
        ...prev.blockDisableOptions,
        [blockId]: options,
      },
    }));
}

export function useSetActiveDragBlock() {
  const store = getEditorStateStore();
  return (
    active: {
      block: TEditorBlock;
      parentBlockId: string;
      parentProperty: string;
    } | null
  ) =>
    setEditorStateStore(store, {
      activeDragBlock: active,
    });
}

export function useActiveOverBlock() {
  return useEditorStateStore((s) => s.activeOverBlock);
}

export function useSetActiveOverBlock() {
  const store = getEditorStateStore();
  return (activeOverBlock: { blockId: string; property: string } | null) =>
    setEditorStateStore(store, {
      activeOverBlock,
    });
}

export function useSetSelectedBlockId() {
  const store = getEditorStateStore();
  return (selectedBlockId: EditorState["selectedBlockId"]) => {
    const selectedSidebarTab =
      selectedBlockId === null ? "styles" : "block-configuration";
    const options: Partial<EditorState> = {};
    if (selectedBlockId !== null) {
      options.inspectorDrawerOpen = true;
    }

    return setEditorStateStore(store, {
      selectedBlockId,
      selectedSidebarTab,
      ...options,
    });
  };
}

export function useSetSidebarTab() {
  const store = getEditorStateStore();
  return (selectedSidebarTab: EditorState["selectedSidebarTab"]) =>
    setEditorStateStore(store, { selectedSidebarTab });
}

export function useResetDocument() {
  const store = getEditorStateStore();
  return (
    document?: EditorState["document"],
    onChange?: EditorState["onChange"]
  ) =>
    setEditorStateStore(store, (prev) => ({
      document: document || prev.rootBlock,
      onChange,
      errors: {},
      history: {
        entries: [
          {
            type: "document",
            value: {
              document,
            },
          },
        ],
        index: 0,
      },
      selectedSidebarTab: "styles",
      selectedBlockId: null,
    }));
}

export function useDispatchAction() {
  const store = getEditorStateStore();
  const { history, document, selectedBlockId, schemas, onChange } = store(
    (s) => s
  );

  if (
    history.entries.length > 0 &&
    history.index === 0 &&
    history.entries[0].type === "document" &&
    history.entries[0].value.document !== document
  ) {
    history.entries[0].value.document = document;
  }

  return (action: EditorHistoryEntry) => {
    const result = editorHistoryReducer(document, selectedBlockId, action);

    const newHistoryEntries = [
      ...history.entries.slice(0, history.index + 1),
      action,
    ];

    setEditorStateStore(store, {
      ...result,
      history: {
        entries: newHistoryEntries,
        index: newHistoryEntries.length - 1,
      },
    });

    validateStoreState(result.document, schemas, store);
    onChange?.(result.document);
  };
}

export function canUndoHistory(history: EditorState["history"]) {
  return history.index > 0;
}

export function canRedoHistory(history: EditorState["history"]) {
  return history.index < history.entries.length - 1;
}

export function useUndoHistory() {
  const store = getEditorStateStore();
  let { document, history, selectedBlockId, schemas, onChange } = store(
    (s) => s
  );

  return () => {
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
  };
}

export function useRedoHistory() {
  const store = getEditorStateStore();
  const { document, history, selectedBlockId, schemas, onChange } = store(
    (s) => s
  );

  return () => {
    if (!canRedoHistory(history)) return;

    const result = editorHistoryReducer(
      document,
      selectedBlockId,
      history.entries[history.index + 1]
    );

    setEditorStateStore(store, {
      ...result,
      history: {
        ...history,
        index: history.index + 1,
      },
    });

    validateStoreState(result.document, schemas, store);
    onChange?.(document);
  };
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
  return useEditorStateStore((s) => s.errors);
}

export function useToggleInspectorDrawerOpen() {
  const store = getEditorStateStore();
  const inspectorDrawerOpen = !store((s) => s.inspectorDrawerOpen);
  return () => {
    return setEditorStateStore(store, { inspectorDrawerOpen });
  };
}

export function useSetSelectedScreenSize() {
  const store = getEditorStateStore();
  return (selectedScreenSize: EditorState["selectedScreenSize"]) =>
    setEditorStateStore(store, { selectedScreenSize });
}

export function useToggleFullScreen() {
  const store = getEditorStateStore();
  const fullScreen = !store((s) => s.fullScreen);
  return () => setEditorStateStore(store, { fullScreen });
}

export const EditorArgsContext = createContext<Record<string, any>>({});
export function useEditorArgs() {
  return useContext(EditorArgsContext);
}
