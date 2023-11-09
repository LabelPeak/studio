import { AnnotateModuleRef, IModuleProps } from "../tool-proto";
import type { Annotation, Label } from "@/interfaces/annotation";
import { App, DragEvent, ImageEvent, Leafer, Rect } from "leafer-ui";
import LabelTag, { LabelTagColors } from "@/components/LabelTag";
import { forwardRef, useContext, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import AnnotateToolContext from "../context";
import { DataItem } from "@/interfaces/dataset";
import { IEventListenerId } from "@leafer/interface";
import Shape from "./Shape";
import { message } from "antd";
import { nanoid } from "nanoid";

interface EditorState {
  imageLayer?: Leafer;
  annotationLayer?: Leafer;
  loadedImageRect?: Rect;
  loadedImageMeta?: { width: number, height: number };
  annotatingEvents: IEventListenerId[];
  annotationShapes: Shape[];
  mode: "annotate" | "filter";
}

export interface ImageClassifyAnnotation extends Annotation<{
  x: number;
  y: number;
  width: number;
  height: number;
  labels: string[]
}> {
  originWidth: number;
  originHeight: number;
}

const ImageClassifyModule = forwardRef<AnnotateModuleRef, IModuleProps>((props, ref) => {
  const { dataItem } = props;
  const { dataset, presets } = useContext(AnnotateToolContext);
  const editorId = useId();
  const editorRef = useRef<App>();
  const editorState = useRef<EditorState>({
    annotatingEvents: [],
    annotationShapes: [],
    mode: "annotate"
  });
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const annotatingLabel = useRef<Label | null>(null);

  const labels = useMemo<Label[]>(() => {
    return JSON.parse(presets!);
  }, [presets]);

  useEffect(() => {
    try {
      initialEditor();
      initialCanvas(`${dataset?.location}/${dataItem.file}`, dataItem);
    } catch (e: any) {
      message.error(e.message);
    }
  }, [dataItem]);

  useImperativeHandle(ref, () => ({
    export: handleExport,
    undo: () => {},
    redo: () => {}
  }), []);

  function initialEditor() {
    if (editorRef.current !== undefined) return;
    editorRef.current = new App({
      view: editorId,
      type: "draw",
    });
    const state = editorState.current;
    state.imageLayer = editorRef.current.addLeafer();
    state.imageLayer.draggable = false;
    state.annotationLayer = editorRef.current.addLeafer();

    state.annotatingEvents.push(
      editorRef.current.on_(DragEvent.START, (e: DragEvent) => {
        if (!annotatingLabel.current) return;
        console.log("start from: ", { x: e.x, y: e.y });
        const color = LabelTagColors[annotatingLabel.current!.index % LabelTagColors.length];
        const shape = new Shape({
          x: e.x,
          y: e.y,
          width: 0,
          height: 0,
          fill: `${color}10`,
          stroke: color
        }, annotatingLabel.current);
        shape.onCreate({ startX: e.x, startY: e.y });
        state.annotationShapes.push(shape);
        state.annotationLayer?.add(shape.rect);
      }),
      editorRef.current.on_(DragEvent.DRAG, (e) => {
        if (!annotatingLabel.current) return;
        const shape = state.annotationShapes[state.annotationShapes.length - 1];
        if (shape === undefined) return;
        shape.shapeTo({ x: e.x, y: e.y });
      }),
      editorRef.current.on_(DragEvent.END, (e) => {
        if (!annotatingLabel.current) return;
        const rect = state.annotationShapes[state.annotationShapes.length - 1];
        if (rect === undefined) return;
        if (editorState.current.mode === "annotate") {
          annotatingLabel.current = null;
          setSelectedLabels([]);
        }
        console.log("end with", { x: e.x, y: e.y });
      })
    );
  }

  function initialCanvas(url: string, dataItem: DataItem) {
    if (editorRef.current) {
      if (editorState.current.loadedImageRect) {
        editorState.current.loadedImageRect.destroy();
        editorState.current.loadedImageMeta = undefined;
      }
      const image = new Rect({
        height: 400,
        width: 640,
        fill: { type: "image", url, mode: "fit" }
      });
      image.once(ImageEvent.LOADED, (e) => {
        editorState.current.loadedImageMeta = { width: e.image.width, height: e.image.height };
        initialAnnotation(dataItem);
      });
      editorState.current.loadedImageRect = image;
      editorState.current.imageLayer!.add(image);
    }
  }

  function initialAnnotation(dataItem: DataItem) {
    editorState.current.annotationShapes.forEach(shape => shape.rect.destroy());
    editorState.current.annotationShapes = [];
    const imageMeta = editorState.current.loadedImageMeta;
    if (!imageMeta) throw new Error("no image loaded!");
    // TODO: Optimize by reducing parse times
    const data = JSON.parse(dataItem.annotation) as ImageClassifyAnnotation[];
    const isFitHeight = 640 / 400 > imageMeta.width / imageMeta.height;
    const scale = isFitHeight ? 400 / imageMeta.height : 640 / imageMeta.width;
    const imageScaledSize = {
      height: isFitHeight ? 400 : imageMeta.height * scale,
      width: isFitHeight ? imageMeta.width * scale : 640
    };
    data.forEach(annotation => {
      const label = labels.find(item => item.name === annotation.value.labels[0]);
      if (!label) throw new Error("invalid label #" + annotation.value.labels[0]);
      const color = LabelTagColors[label.index % LabelTagColors.length];

      const shape = new Shape({
        x: isFitHeight
          ? annotation.value.x / 100 * imageScaledSize.width + (640 - imageScaledSize.width) / 2
          : 640 * annotation.value.x / 100,
        y: isFitHeight
          ? 400 * annotation.value.y / 100
          : annotation.value.y / 100 * imageScaledSize.height + (400 - imageScaledSize.height) / 2,
        height: imageScaledSize.height * annotation.value.height / 100,
        width: imageScaledSize.width * annotation.value.width / 100,
        fill: `${color}10`,
        stroke: color
      }, label);
      editorState.current.annotationShapes.push(shape);
      editorState.current.annotationLayer?.add(shape.rect);
    });
  }

  function handleLabelClick(value: Label) {
    const targetIndex = selectedLabels.findIndex(
      label => label.index === value.index
    );
    if (targetIndex !== -1) {
      // click the selected one
      setSelectedLabels(
        selectedLabels.slice(0, targetIndex).concat(selectedLabels.slice(targetIndex + 1))
      );
    } else {
      // click new item
      if (editorState.current.mode === "filter") {
        annotatingLabel.current = value;
        setSelectedLabels(selectedLabels.concat([value]));
      } else if (editorState.current.mode === "annotate") {
        annotatingLabel.current = value;
        setSelectedLabels([value]);
      }
    }
  }

  function handleExport(): string {
    const image = editorState.current.loadedImageMeta;
    if (!image) throw new Error("no image loaded");
    const isFitHeight = 640 / 400 > image.width / image.height;
    const scale = isFitHeight ? 400 / image.height : 640 / image.width;
    const bounds = isFitHeight
      ? { x: 640 / 2 - image.width * scale / 2, y: 0, width: image.width * scale, height: 400 }
      : { x: 0, y: 400 / 2 - image.height * scale / 2, width: image.width * scale, height: 400 };
    const value: Array<ImageClassifyAnnotation> =
      editorState.current.annotationShapes.map(item => {
        return {
          originHeight: image.height,
          originWidth: image.width,
          value: item.exportToValue(bounds),
          id: nanoid(10),
          type: "labels"
        };
      });

    return JSON.stringify(value);
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
});

ImageClassifyModule.displayName = "ImageClassifyModule";

export default ImageClassifyModule;