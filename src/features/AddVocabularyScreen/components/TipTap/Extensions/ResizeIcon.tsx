import { NodeViewWrapper } from "@tiptap/react";
import { Resizable } from "re-resizable";
import { useEffect, useRef, useState } from "react";

interface ImageProps {
  updateAttributes: (attrs: { width: string; height: string }) => void;
  extension: {
    options: {
      useFigure: boolean; // Determines if the image is wrapped in a <figure> element
    };
  };
  node: {
    attrs: {
      src: string;
      alt: string;
      title?: string;
      width?: string;
      height?: string;
    };
  };
}

export default function Image(props: ImageProps) {
  const [initialWidth, setInitialWidth] = useState<number | undefined>(
    undefined,
  );
  const [initialHeight, setInitialHeight] = useState<number | undefined>(
    undefined,
  );

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      // Function to handle loading the image dimensions
      const handleLoad = () => {
        setInitialWidth(img.naturalWidth);
        setInitialHeight(img.naturalHeight);
      };

      if (img.complete) {
        // If the image is already loaded, retrieve dimensions immediately
        handleLoad();
      } else {
        // Add event listener to retrieve dimensions once the image loads
        img.addEventListener("load", handleLoad);

        // Cleanup event listener when the component is unmounted or image changes
        return () => img.removeEventListener("load", handleLoad);
      }
    }
  }, [imgRef]);

  return (
    <NodeViewWrapper>
      <Resizable
        // Set maximum resizing dimensions to the natural image dimensions
        maxWidth={initialWidth}
        maxHeight={initialHeight}
        // Set minimum resizing dimensions to 10% of the natural dimensions or a default
        minWidth={initialWidth ? Math.round(initialWidth * 0.1) : 50}
        minHeight={initialHeight ? Math.round(initialHeight * 0.1) : 50}
        // Handle when the resizing stops
        onResizeStop={(_e, _direction, ref) => {
          props.updateAttributes({
            width: ref.style.width,
            height: ref.style.height,
          });
        }}
      >
        <img
          {...props.node.attrs}
          ref={imgRef}
          className="postimage" // Add a custom class for styling
          style={{
            width: props.node.attrs.width,
            height: props.node.attrs.height,
          }}
        />
      </Resizable>
    </NodeViewWrapper>
  );
}
