import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  useIsMobile,
} from "@vivid/ui";
import { ArrowDown, ArrowUp, Copy, Slash, Trash } from "lucide-react";
import React, { memo, useCallback } from "react";
import {
  useBlocks,
  useDispatchAction,
  useDocument,
  useSetSelectedBlockId,
} from "../../../editor/context";
import { findBlockHierarchy } from "../../../helpers/blocks";
import { useI18n } from "@vivid/i18n";
import { BlockDisableOptions } from "../../../editor/core";
import { usePortalContext } from "./portal-context";

type Props = {
  blockId: string;
  disable?: BlockDisableOptions;
};

const MAX_DISPLAY_LAST_ELEMENTS = 3;
const MOBILE_DISPLAY_LAST_ELEMENTS = 2;

export const NavMenu: React.FC<Props> = memo(({ blockId, disable }) => {
  const document = useDocument();
  const setSelectedBlockId = useSetSelectedBlockId();
  const dispatchAction = useDispatchAction();
  const t = useI18n("builder");
  const blocks = useBlocks();

  const { document: documentElement } = usePortalContext();
  const isMobile = useIsMobile(documentElement?.defaultView);

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

  const handleBlockIdClick = useCallback(
    (ev: React.MouseEvent, id: string) => {
      setSelectedBlockId(id);
      ev.stopPropagation();
      ev.preventDefault();
    },
    [setSelectedBlockId]
  );

  const handleDeleteClick = useCallback(() => {
    dispatchAction({
      type: "delete-block",
      value: {
        blockId: blockId,
      },
    });

    setSelectedBlockId(null);
  }, [blockId, dispatchAction, setSelectedBlockId]);

  const handleMoveClick = useCallback(
    (direction: "up" | "down") => {
      dispatchAction({
        type: direction === "up" ? "move-block-up" : "move-block-down",
        value: {
          blockId: blockId,
        },
      });
    },
    [blockId, dispatchAction]
  );

  const handleCloneClick = useCallback(() => {
    dispatchAction({
      type: "clone-block",
      value: {
        blockId: blockId,
      },
    });
  }, [blockId, dispatchAction]);

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
              // On mobile: show only last elements with "..." at the beginning
              // On desktop: show first element, last elements, and "..." for middle elements
              const maxDisplayElements = isMobile
                ? MOBILE_DISPLAY_LAST_ELEMENTS
                : MAX_DISPLAY_LAST_ELEMENTS;
              const shouldShow = isMobile
                ? index >= hierarchy.length - maxDisplayElements
                : index === 0 || index >= hierarchy.length - maxDisplayElements;
              const isMiddleElement =
                !shouldShow &&
                index > 0 &&
                index < hierarchy.length - maxDisplayElements;
              const isLastMiddleElement =
                isMiddleElement &&
                !isMobile &&
                index === hierarchy.length - (maxDisplayElements + 1);

              // On mobile, show "..." at the beginning if there are more than 2 elements
              if (
                isMobile &&
                hierarchy.length > maxDisplayElements &&
                index === 0
              ) {
                return (
                  <React.Fragment key="mobile-ellipsis">
                    <span className="text-muted-foreground">...</span>
                    <BreadcrumbSeparator className="[&>svg]:size-3">
                      <Slash />
                    </BreadcrumbSeparator>
                  </React.Fragment>
                );
              }

              if (isMiddleElement && !isLastMiddleElement) {
                return null; // Skip middle elements except the last one
              }

              return (
                <React.Fragment key={index}>
                  {isLastMiddleElement ? (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <BreadcrumbSeparator className="[&>svg]:size-3">
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
                    <BreadcrumbSeparator className="[&>svg]:size-3">
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
});
