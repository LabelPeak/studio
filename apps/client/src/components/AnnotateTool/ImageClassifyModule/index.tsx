import { App, Leafer, Rect } from "leafer-ui";
import { useContext, useEffect, useId, useMemo, useRef } from "react";
import AnnotateToolContext from "../context";
import { IModuleProps } from "../tool-proto";
import { Tag } from "antd";

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
  const labels = useMemo<string[]>(() => {
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

  return (
    <section id="image-classify-module" className="h-full flex flex-col">
      <div className="p-30px b-b-1 b-b-solid b-color-nord-snow-0">
        <div id={editorId} className="h-400px"></div>
      </div>
      <div className="flex-auto">
        { labels.map(label => (
          <Tag>{ label }</Tag>
        ))}
      </div>
    </section>
  );
}