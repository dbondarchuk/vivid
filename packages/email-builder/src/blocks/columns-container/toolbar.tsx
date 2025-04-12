import {
  ConfigurationProps,
  ToolbarColorMenu,
  ToolbarDropdownMenu,
} from "@vivid/builder";
import { PaintBucket } from "lucide-react";
import { ColumnsContainerProps, ColumnsContainerPropsDefaults } from "./schema";
import { ContentAlignmentDropdownMenu } from "../../toolbars/content-alignment";

const columnsItems = [
  {
    value: "2",
    label: "2 Columns",
  },
  {
    value: "3",
    label: "3 Columns",
  },
];

export const ColumnsContainerToolbar = (
  props: ConfigurationProps<ColumnsContainerProps>
) => (
  <>
    <ToolbarDropdownMenu
      icon={props.data?.props?.columnsCount === 2 ? "2 Columns" : "3 Columns"}
      items={columnsItems}
      defaultValue={ColumnsContainerPropsDefaults.props.columnsCount.toString()}
      property="props.columnsCount"
      tooltip="Columns"
      data={{
        ...props.data,
        props: {
          ...props.data?.props,
          columnsCount: props.data?.props?.columnsCount?.toString(),
        },
      }}
      setData={(data) => {
        props.setData({
          ...data,
          props: {
            ...data.props,
            columnsCount: data.props?.columnsCount?.toString() === "2" ? 2 : 3,
          },
        });
      }}
    />
    <ContentAlignmentDropdownMenu
      defaultValue={ColumnsContainerPropsDefaults.props.contentAlignment}
      {...props}
    />
    <ToolbarColorMenu
      icon={<PaintBucket />}
      property="style.backgroundColor"
      nullable
      tooltip="Background color"
      {...props}
    />
  </>
);
