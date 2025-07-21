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
import { BlockDisableOptions } from "../../../editor/core";

type Props = {
  blockId: string;
  disable?: BlockDisableOptions;
};

const MAX_DISPLAY_LAST_ELEMENTS = 3;

export const NavMenu: React.FC<Props> = ({ blockId, disable }) => {
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
        className="bg-background shadow p-1 w-max flex-wrap"
      >
        {!disable?.move && (
          <ToolbarGroup>
            <ToolbarButton
              tooltip={t("baseBuilder.navMenu.moveUp")}
              onClick={(e) => {
                e.stopPropagation();
                handleMoveClick("up");
              }}
            >
              <ArrowUp fontSize="small" />
            </ToolbarButton>
            <ToolbarButton
              onClick={(e) => {
                e.stopPropagation();
                handleMoveClick("down");
              }}
              tooltip={t("baseBuilder.navMenu.moveDown")}
            >
              <ArrowDown fontSize="small" />
            </ToolbarButton>
          </ToolbarGroup>
        )}
        {(!disable?.delete || !disable?.clone) && (
          <ToolbarGroup>
            {!disable?.clone && (
              <ToolbarButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloneClick();
                }}
                tooltip={t("baseBuilder.navMenu.clone")}
              >
                <Copy fontSize="small" />
              </ToolbarButton>
            )}
            {!disable?.delete && (
              <ToolbarButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick();
                }}
                tooltip={t("baseBuilder.navMenu.delete")}
              >
                <Trash fontSize="small" />
              </ToolbarButton>
            )}
          </ToolbarGroup>
        )}
        {/* <ToolbarGroup>
          {BlockToolbar && (
            <BlockToolbar data={block.data} setData={setBlockData} />
          )}
        </ToolbarGroup> */}
        <Breadcrumb aria-label="breadcrumb">
          <BreadcrumbList className="gap-0.5 sm:gap-0.5 text-xs text-foreground">
            {hierarchy?.map(({ id, displayName }, index) => {
              // Show first element, last two elements, and "..." for middle elements
              const shouldShow =
                index === 0 ||
                index >= hierarchy.length - MAX_DISPLAY_LAST_ELEMENTS;
              const isMiddleElement =
                !shouldShow &&
                index > 0 &&
                index < hierarchy.length - MAX_DISPLAY_LAST_ELEMENTS;
              const isLastMiddleElement =
                isMiddleElement &&
                index === hierarchy.length - (MAX_DISPLAY_LAST_ELEMENTS + 1);

              if (isMiddleElement && !isLastMiddleElement) {
                return null; // Skip middle elements except the last one
              }

              return (
                <React.Fragment key={index}>
                  {isLastMiddleElement ? (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <BreadcrumbSeparator className="hidden md:block [&>svg]:size-3">
                        <Slash />
                      </BreadcrumbSeparator>
                    </>
                  ) : (
                    <span
                      className="hover:underline cursor-pointer"
                      role="link"
                      onClick={(event) => handleBlockIdClick(event, id)}
                    >
                      {t(displayName)}
                    </span>
                  )}
                  {index < hierarchy.length - 1 && shouldShow && (
                    <BreadcrumbSeparator className="hidden md:block [&>svg]:size-3">
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
