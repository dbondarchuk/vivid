import {
  EditorChildren,
  EditorChildrenChange,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ColumnsContainerProps } from "./schema";
import { BaseColumnsContainer } from "./base";

const EMPTY_COLUMNS = [{ children: [] }, { children: [] }, { children: [] }];

export default function ColumnsContainerEditor({
  style,
  props,
}: ColumnsContainerProps) {
  const currentBlock = useCurrentBlock<ColumnsContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const { columns, ...restProps } = currentBlock.data?.props ?? {};
  const columnsValue = columns ?? EMPTY_COLUMNS;

  const updateColumn = (
    columnIndex: 0 | 1 | 2,
    { block, blockId, children }: EditorChildrenChange
  ) => {
    const nColumns = [...columnsValue] as Exclude<typeof columns, undefined>;
    nColumns[columnIndex] = { children };

    dispatchAction({
      type: "set-block-data",
      value: {
        blockId: currentBlock.id,
        data: {
          ...currentBlock.data,
          props: {
            ...currentBlock.data?.props,
            columns: nColumns,
          },
        },
      },
    });

    setSelectedBlockId(blockId);
  };

  return (
    <BaseColumnsContainer
      props={restProps}
      style={style}
      columns={[
        <EditorChildren
          block={currentBlock}
          property="props.columns.0"
          children={columns?.[0]?.children}
          onChange={(change) => updateColumn(0, change)}
        />,
        <EditorChildren
          block={currentBlock}
          property="props.columns.1"
          children={columns?.[1]?.children}
          onChange={(change) => updateColumn(1, change)}
        />,
        <EditorChildren
          block={currentBlock}
          property="props.columns.2"
          children={columns?.[2]?.children}
          onChange={(change) => updateColumn(2, change)}
        />,
      ]}
    />
  );
}
