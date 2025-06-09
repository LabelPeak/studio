import { ImageEvent, Leafer, Rect } from "leafer-ui";
import { useEffect, useMemo, useState } from "react";
import { pathOr } from "remeda";

interface ImageMeta {
  width: number;
  height: number;
}

interface UseAnnotationImageOptions {
  url: string;
  canvasSize: ImageMeta;
  imageLayer?: Leafer;
}

export function useAnnotationImage({ url, canvasSize, imageLayer }: UseAnnotationImageOptions) {
  const [imageMeta, setImageMeta] = useState<ImageMeta>();

  const imageRect = useMemo(() => {
    const rect = new Rect({
      height: canvasSize.height,
      width: canvasSize.width,
      fill: {
        type: "image",
        url,
        mode: "fit"
      }
    });

    return rect;
  }, [url, canvasSize]);

  useEffect(() => {
    if (!imageLayer) {
      return;
    }

    imageLayer.add(imageRect);

    return () => {
      imageLayer.remove(imageRect);
      imageRect.destroy();
    };
  }, [imageLayer, imageRect]);

  useEffect(() => {
    imageRect.once(ImageEvent.LOADED, (e) => {
      const meta = {
        width: pathOr(e, ["image", "width"], 0),
        height: pathOr(e, ["image", "height"], 0)
      };
      setImageMeta(meta);
    });
  }, [imageRect, imageLayer]);

  return {
    imageRect,
    imageMeta
  };
}
