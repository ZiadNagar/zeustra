import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import type { TiptapDocument } from "./strapi/blog";

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Image,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TextStyle,
  Color,
  Highlight,
];

export function renderTiptapToHtml(
  content: TiptapDocument | JSONContent,
): string {
  try {
    return generateHTML(content, extensions);
  } catch (error) {
    console.error("[tiptap] Failed to render content:", error);
    return "";
  }
}

export function isTiptapDocument(value: unknown): value is TiptapDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as Record<string, unknown>).type === "doc" &&
    "content" in value &&
    Array.isArray((value as Record<string, unknown>).content)
  );
}
