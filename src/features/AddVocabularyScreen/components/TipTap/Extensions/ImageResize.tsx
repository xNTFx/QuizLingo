import { mergeAttributes, nodeInputRule } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ImageResizeComponent from "./ResizeIcon";

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, number>;
  useFigure: boolean;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: {
        src: string | undefined;
        alt: string;
        title?: string;
        width?: string | number;
        height?: string | number;
        isDraggable?: boolean;
      }) => ReturnType;
    };
  }
}

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export const ImageResize = Image.extend<ImageOptions>({
  name: "imageResize",
  draggable: true, // Make the image draggable in the editor

  // Define default options for the extension
  addOptions() {
    return {
      inline: true,
      allowBase64: false,
      HTMLAttributes: {},
      useFigure: false,
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: null,
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: null,
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img", // Parse <img> tags as this node type
      },
    ];
  },

  // Specify how the editor node should render into HTML
  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  // Use a custom React component for the node view
  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent);
  },

  // Add input rules for automatic image insertion
  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex, // Use the defined regex to match input patterns
        type: this.type, // Node type to create
        getAttributes: (match) => {
          // Extract attributes from the matched input
          const [, , alt, src, title, height, width, isDraggable] = match;
          return { src, alt, title, height, width, isDraggable };
        },
      }),
    ];
  },
});
