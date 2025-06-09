import { useMount } from "ahooks";
import { App as LeaferApp, Leafer } from "leafer-ui";
import { useId, useState } from "react";

export function useEditor() {
  const domId = useId();
  const [editor, setEditor] = useState<LeaferApp>();
  const [annotationLayer, setAnnotationLayer] = useState<Leafer>();
  const [imageLayer, setImageLayer] = useState<Leafer>();

  useMount(() => {
    const app = new LeaferApp({
      view: domId,
      type: "draw"
    });

    const _imageLayer = app.addLeafer();
    _imageLayer.draggable = false;
    const _annotateLayer = app.addLeafer();
    setImageLayer(_imageLayer);
    setAnnotationLayer(_annotateLayer);
    setEditor(app);
  });

  return {
    editor,
    annotationLayer,
    imageLayer,
    domId
  };
}
