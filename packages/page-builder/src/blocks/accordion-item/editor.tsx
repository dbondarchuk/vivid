"use client";

import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { AccordionItemProps } from "./schema";
import { styles } from "./styles";
import { EditorBlock } from "@vivid/builder";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const AccordionItemEditor = ({
  props,
  style,
  ...additionalProps
}: AccordionItemProps & {
  animation?: "slide" | "fade" | "none";
  iconPosition?: "left" | "right";
  iconStyle?: "plus" | "arrow" | "chevron";
}) => {
  const currentBlock = useCurrentBlock<AccordionItemProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const title = currentBlock.data?.props?.title?.children?.[0];
  const content = currentBlock.data?.props?.content?.children || [];
  const className = generateClassName();
  const base = currentBlock.base;

  // Extract animation properties from additionalProps
  const animation = additionalProps.animation ?? "slide";
  const iconPosition = additionalProps.iconPosition ?? "right";
  const iconStyle = additionalProps.iconStyle ?? "chevron";

  // Use local state for accordion item open/close
  const [isOpen, setIsOpen] = useState(props.isOpen ?? false);

  // Get the appropriate icon based on iconStyle and state
  const getIcon = () => {
    if (iconStyle === "plus") {
      return isOpen ? (
        <Minus className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      );
    } else if (iconStyle === "arrow") {
      return isOpen ? (
        <ArrowDown className="w-4 h-4" />
      ) : (
        <ArrowRight className="w-4 h-4" />
      );
    } else {
      // chevron (default)
      return isOpen ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      );
    }
  };

  // Get animation classes based on animation type
  const getAnimationClasses = () => {
    if (animation === "fade") {
      return isOpen
        ? "opacity-100 max-h-screen transition-all duration-300 ease-in-out"
        : "opacity-0 max-h-0 overflow-hidden transition-all duration-300 ease-in-out";
    } else if (animation === "slide") {
      return isOpen
        ? "max-h-screen opacity-100 transition-all duration-300 ease-in-out"
        : "max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out";
    } else {
      // none
      return isOpen ? "block" : "hidden";
    }
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <div
        className={cn("border rounded-lg", className, base?.className)}
        id={base?.id}
      >
        <div
          className="p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center justify-between"
          onClick={toggleAccordion}
        >
          <div className="flex-1">
            {title && <EditorBlock block={title} {...disable} />}
          </div>
          <div
            className={cn(
              "flex items-center justify-center transition-transform duration-200",
              iconPosition === "left" ? "order-first mr-3" : "ml-3"
            )}
          >
            {getIcon()}
          </div>
        </div>
        <div className={getAnimationClasses()}>
          <div className="p-4">
            <EditorChildren
              block={currentBlock}
              property="props.content"
              children={content}
              onChange={({ block, blockId, children }) => {
                dispatchAction({
                  type: "set-block-data",
                  value: {
                    blockId: currentBlock.id,
                    data: {
                      ...currentBlock.data,
                      props: {
                        ...currentBlock.data?.props,
                        content: {
                          ...currentBlock.data?.props?.content,
                          children,
                        },
                      },
                    },
                  },
                });

                setSelectedBlockId(blockId);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
