import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from "@vivid/ui";
import { ArrowDown, ArrowUp, Copy, Slash, Trash } from "lucide-react";
import React from "react";
import {
  useBlocks,
  useDispatchAction,
  useDocument,
  useSetSelectedBlockId,
} from "../../../editor/context";
import { findBlockHierarchy } from "../../../helpers/blocks";
import { useI18n } from "@vivid/i18n";

type Props = {
  blockId: string;
};

export const NavMenu: React.FC<Props> = ({ blockId }) => {
  const document = useDocument();
  const setSelectedBlockId = useSetSelectedBlockId();
  const dispatchAction = useDispatchAction();
  const t = useI18n("builder");
  const blocks = useBlocks();

  // const block = findBlock(document, blockId);
  // const BlockToolbar = block?.type && blocks[block.type].Toolbar;
  // const∏ setBlockData = (data: any) => {
  //   dispatchAction({
  //     type: "set-block-data",
  //     value: { blockId: blockId, data },
  //   });
  // };

  const hierarchy = React.useMemo(
    () =>
      findBlockHierarchy(document, blockId)?.map((block) => ({
        ...block,
        displayName: blocks[block.type].displayName,
      })),
    [document, blockId]
  );

  const handleBlockIdClick = (ev: React.MouseEvent, id: string) => {
    setSelectedBlockId(id);
    ev.stopPropagation();
    ev.preventDefault();
  };

  const handleDeleteClick = () => {
    dispatchAction({
      type: "delete-block",
      value: {
        blockId: blockId,
      },
    });

    setSelectedBlockId(null);
  };

  const handleMoveClick = (direction: "up" | "down") => {
    dispatchAction({
      type: direction === "up" ? "move-block-up" : "move-block-down",
      value: {
        blockId: blockId,
      },
    });
  };

  const handleCloneClick = () => {
    dispatchAction({
      type: "clone-block",
      value: {
        blockId: blockId,
      },
    });
  };

  return (
    <>
      <Toolbar
        role="presentation"
        aria-label="breadcrumb"
        className="bg-background shadow p-1 absolute -top-9 -left-0.5 w-max flex-wrap"
      >
        <ToolbarGroup>
          <ToolbarButton
            tooltip={t("baseBuilder.navMenu.moveUp")}
            onClick={() => handleMoveClick("up")}
          >
            <ArrowUp fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleMoveClick("down")}
            tooltip={t("baseBuilder.navMenu.moveDown")}
          >
            <ArrowDown fontSize="small" />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            onClick={handleCloneClick}
            tooltip={t("baseBuilder.navMenu.clone")}
          >
            <Copy fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            onClick={handleDeleteClick}
            tooltip={t("baseBuilder.navMenu.delete")}
          >
            <Trash fontSize="small" />
          </ToolbarButton>
        </ToolbarGroup>
        {/* <ToolbarGroup>
          {BlockToolbar && (
            <BlockToolbar data={block.data} setData={setBlockData} />
          )}
        </ToolbarGroup> */}
        <Breadcrumb aria-label="breadcrumb">
          <BreadcrumbList className="gap-0.5 sm:gap-0.5 text-xs text-foreground">
            {hierarchy?.map(({ id, displayName }, index) => {
              return (
                <React.Fragment key={index}>
                  <span
                    className="hover:underline cursor-pointer "
                    role="link"
                    onClick={(event) => handleBlockIdClick(event, id)}
                    key={id}
                  >
                    {displayName}
                  </span>
                  {index < hierarchy.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block  [&>svg]:size-3">
                      <Slash />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </Toolbar>
    </>
  );
};
