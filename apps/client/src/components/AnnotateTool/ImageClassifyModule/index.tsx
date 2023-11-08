import { App, Leafer, Rect } from "leafer-ui";
import { useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import AnnotateToolContext from "../context";
import { IModuleProps } from "../tool-proto";
import type { Label } from "@/interfaces/annotation";
import LabelTag from "@/components/LabelTag";

interface EditorState {
  imageLayer?: Leafer;
  annotationLayer?: Leafer;
  loadedImage?: Rect;
}

export default function ImageClassifyModule(props: IModuleProps) {
  const { dataItem } = props;
  const { dataset, presets } = useContext(AnnotateToolContext);
  const editorId = useId();
  const editorRef = useRef<App>();
  const editorState = useRef<EditorState>({});
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const labels = useMemo<Label[]>(() => {
    return JSON.parse(presets!);
  }, [presets]);

  useEffect(() => {
    initialEditor();
    initialImage(`${dataset?.location}/${dataItem.file}`);
  }, [dataItem]);

  function initialEditor() {
    if (editorRef.current !== undefined) return;
    editorRef.current = new App({
      view: editorId,
      type: "draw",
    });
    editorState.current.imageLayer = editorRef.current.addLeafer();
    editorState.current.imageLayer.draggable = false;
    editorState.current.annotationLayer = editorRef.current.addLeafer();
    console.log(editorRef.current);
  }

  function initialImage(url: string) {
    if (editorRef.current) {
      if (editorState.current.loadedImage) {
        editorState.current.loadedImage.destroy();
      }
      const image = new Rect({
        height: 400,
        width: 640,
        fill: {
          type: "image",
          url, mode: "fit"
        }
      });
      editorState.current.loadedImage = image;
      editorState.current.imageLayer!.add(image);
    }
  }
  function handleLabelClick(value: Label) {
    const targetIndex = selectedLabels.findIndex(
      label => label.index === value.index
    );
    if (targetIndex !== -1) {
      setSelectedLabels(
        selectedLabels.slice(0, targetIndex)
          .concat(selectedLabels.slice(targetIndex + 1))
      );
    } else {
      setSelectedLabels(selectedLabels.concat([value]));
    }
  }

  return (
    <section id="image-classify-module" className="h-full flex flex-col">
      <div className="p-30px b-b-1 b-b-solid b-color-nord-snow-0">
        <div id={editorId} className="h-400px"></div>
      </div>
      <div className="flex-auto">
        <div id="labels" className="flex gap-2 mt-2 px-2">
          { labels.map(label => (
            <LabelTag
              key={label.index}
              index={label.index}
              name={label.name}
              onClick={handleLabelClick}
              selected={Boolean(selectedLabels.find(l => l.index === label.index))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}