/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Klass, LexicalNode } from "lexical";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { OverflowNode } from "@lexical/overflow";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { EmojiNode } from "./EmojiNode";
import { EquationNode } from "./EquationNode";
import { ExcalidrawNode } from "./ExcalidrawNode";
import { ImageNode } from "./ImageNode";
import { InlineImageNode } from "./InlineImageNode/InlineImageNode";
import { KeywordNode } from "./KeywordNode";
import { LayoutContainerNode } from "./LayoutContainerNode";
import { LayoutItemNode } from "./LayoutItemNode";
import { MentionNode } from "./MentionNode";
import { PageBreakNode } from "./PageBreakNode";
import { TweetNode } from "./TweetNode";
import { YouTubeNode } from "./YouTubeNode";

const PlaygroundNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  ImageNode,
  InlineImageNode,
  MentionNode,
  EmojiNode,
  ExcalidrawNode,
  EquationNode,
  KeywordNode,
  HorizontalRuleNode,
  TweetNode,
  YouTubeNode,
  MarkNode,
  PageBreakNode,
  LayoutContainerNode,
  LayoutItemNode,
];

export default PlaygroundNodes;