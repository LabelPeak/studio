import { IEventListenerId } from "@leafer/interface";
import { message } from "antd";
import { App, DragEvent, ImageEvent, Leafer, Rect } from "leafer-ui";
import { nanoid } from "nanoid";
import {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { useIntl } from "react-intl";
import { doNothing } from "remeda";

import LabelTag, { LabelTagColors } from "@/components/LabelTag";
import type { Annotation, Label } from "@/interfaces/annotation";
import { DataItem } from "@/interfaces/dataset";

import AnnotateToolContext from "../context";
import { AnnotateModuleRef, IModuleProps } from "../tool-proto";
import Shape from "./Shape";

interface EditorState {
  imageLayer?: Leafer;
  annotationLayer?: Leafer;
  loadedImageRect?: Rect;
  loadedImageMeta?: { width: number; height: number };
  annotatingEvents: IEventListenerId[];
  annotationShapes: Shape[];
  mode: "annotate" | "filter";
  size: { height: number; width: number };
}

/**
 * @deprecated
 */
export interface ImageClassifyAnnotation
  extends Annotation<{
    x: number;
    y: number;
    width: number;
    height: number;
    labels: string[];
  }> {
  originWidth: number;
  originHeight: number;
}

const ImageClassifyModule = forwardRef<AnnotateModuleRef, IModuleProps>((props, ref) => {
  const { dataItem, onUpdate } = props;
  const { presets: labels } = useContext(AnnotateToolContext);
  const editorId = useId();
  const editorRef = useRef<App>();
  const editorState = useRef<EditorState>({
    annotatingEvents: [],
    annotationShapes: [],
    mode: "annotate",
    size: { height: 320, width: 512 }
  });
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const annotatingLabel = useRef<Label | null>(null);
  const originAnnotation = useRef<ImageClassifyAnnotation[] | null>(null);
  const [annotationObjectList, setAnnotationObjectList] = useState<ImageClassifyAnnotation[]>([]);
  const intl = useIntl();

  useEffect(() => {
    try {
      initialEditor();
      initialCanvas(dataItem.file, dataItem);
      // TODO: use zod valid shape
      originAnnotation.current = filterAnnotationByLabels(
        dataItem.annotation as ImageClassifyAnnotation[]
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error("初始化标注工具失败: " + e.message || "未知错误");
      }
    }
  }, [dataItem]);

  useImperativeHandle(
    ref,
    () => ({
      save: handleSave,
      // TODO: add undo/redo
      undo: doNothing(),
      redo: doNothing(),
      reset: handleRest
    }),
    []
  );

  function initialEditor() {
    if (editorRef.current !== undefined || annotatingLabel.current !== null) {
      return;
    }
    editorRef.current = new App({
      view: editorId,
      type: "draw"
    });
    const state = editorState.current;
    state.imageLayer = editorRef.current.addLeafer();
    state.imageLayer.draggable = false;
    state.annotationLayer = editorRef.current.addLeafer();

    // FIXME: remove listener when unmount
    state.annotatingEvents.push(
      editorRef.current.on_(DragEvent.START, (e: DragEvent) => {
        if (!annotatingLabel.current) {
          return;
        }
        const color = LabelTagColors[annotatingLabel.current.index % LabelTagColors.length];
        const shape = new Shape(
          {
            x: e.x,
            y: e.y,
            width: 0,
            height: 0,
            fill: `${color}10`,
            stroke: color
          },
          annotatingLabel.current
        );
        shape.onCreate({ startX: e.x, startY: e.y });
        state.annotationShapes.push(shape);
        state.annotationLayer?.add(shape.rect);
      }),
      editorRef.current.on_(DragEvent.DRAG, (e) => {
        if (!annotatingLabel.current) {
          return;
        }
        const shape = state.annotationShapes.at(state.annotationShapes.length - 1);
        if (shape === undefined) {
          return;
        }
        shape.shapeTo({ x: e.x, y: e.y });
      }),
      editorRef.current.on_(DragEvent.END, () => {
        if (!annotatingLabel.current) {
          return;
        }
        const rect = state.annotationShapes.at(state.annotationShapes.length - 1);
        if (rect === undefined) {
          return;
        }
        const annotations = transformAnnotationFormShape([rect]);
        setAnnotationObjectList((list) => list.concat(annotations));
        onUpdate(annotations);
        if (editorState.current.mode === "annotate") {
          annotatingLabel.current = null;
          setSelectedLabels([]);
        }
      })
    );
  }

  function initialCanvas(url: string, _dataItem: DataItem) {
    const state = editorState.current;
    if (editorRef.current) {
      if (state.loadedImageRect) {
        initialAnnotation([]);
        state.loadedImageRect.destroy();
        state.loadedImageMeta = undefined;
      }
      const image = new Rect({
        height: state.size.height,
        width: state.size.width,
        fill: { type: "image", url, mode: "fit" }
      });
      image.once(ImageEvent.LOADED, (e) => {
        state.loadedImageMeta = {
          width: e.image.width,
          height: e.image.height
        };
        const annotations = filterAnnotationByLabels(
          _dataItem.annotation as ImageClassifyAnnotation[]
        );
        initialAnnotation(annotations);
      });
      state.loadedImageRect = image;
      state.imageLayer?.add(image);
    }
  }

  function initialAnnotation(annotations: ImageClassifyAnnotation[]) {
    const state = editorState.current;
    state.annotationShapes.forEach((shape) => shape.rect.destroy());
    state.annotationShapes = [];
    const imageMeta = editorState.current.loadedImageMeta;
    if (!imageMeta) {
      return;
    }
    setAnnotationObjectList(annotations);
    const isFitHeight = state.size.width / state.size.height > imageMeta.width / imageMeta.height;
    const scale = isFitHeight
      ? state.size.height / imageMeta.height
      : state.size.width / imageMeta.width;
    const imageScaledSize = {
      height: isFitHeight ? state.size.height : imageMeta.height * scale,
      width: isFitHeight ? imageMeta.width * scale : state.size.width
    };
    annotations.forEach((annotation) => {
      const label = labels?.find((item) => item.name === annotation.value.labels[0]);
      if (!label) {
        throw new Error("invalid label #" + annotation.value.labels[0]);
      }
      const color = LabelTagColors[label.index % LabelTagColors.length];

      const shape = new Shape(
        {
          x: isFitHeight
            ? (annotation.value.x / 100) * imageScaledSize.width +
              (state.size.width - imageScaledSize.width) / 2
            : (state.size.width * annotation.value.x) / 100,
          y: isFitHeight
            ? (state.size.height * annotation.value.y) / 100
            : (annotation.value.y / 100) * imageScaledSize.height +
              (state.size.height - imageScaledSize.height) / 2,
          height: (imageScaledSize.height * annotation.value.height) / 100,
          width: (imageScaledSize.width * annotation.value.width) / 100,
          fill: `${color}10`,
          stroke: color
        },
        label
      );
      state.annotationShapes.push(shape);
      state.annotationLayer?.add(shape.rect);
    });
  }

  function handleLabelClick(value: Label) {
    const targetIndex = selectedLabels.findIndex((label) => label.index === value.index);
    if (targetIndex !== -1) {
      // click the selected one
      setSelectedLabels(
        selectedLabels.slice(0, targetIndex).concat(selectedLabels.slice(targetIndex + 1))
      );
      annotatingLabel.current = null;
    } else {
      // click new item
      if (editorState.current.mode === "filter") {
        annotatingLabel.current = value;
        setSelectedLabels(selectedLabels.concat([value]));
      } else {
        annotatingLabel.current = value;
        setSelectedLabels([value]);
      }
    }
  }

  function transformAnnotationFormShape(shapes: Shape[]): ImageClassifyAnnotation[] {
    const state = editorState.current;
    const image = editorState.current.loadedImageMeta;
    if (!image) {
      throw new Error("no image loaded");
    }
    const isFitHeight = state.size.width / state.size.height > image.width / image.height;
    const scale = isFitHeight ? state.size.height / image.height : state.size.width / image.width;
    const bounds = isFitHeight
      ? {
          x: state.size.width / 2 - (image.width * scale) / 2,
          y: 0,
          width: image.width * scale,
          height: state.size.height
        }
      : {
          x: 0,
          y: state.size.height / 2 - (image.height * scale) / 2,
          width: image.width * scale,
          height: state.size.height
        };
    const value: Array<ImageClassifyAnnotation> = shapes.map((item) => {
      return {
        originHeight: image.height,
        originWidth: image.width,
        value: item.exportToValue(bounds),
        id: nanoid(10),
        type: "labels"
      };
    });
    return value;
  }

  function filterAnnotationByLabels(data: ImageClassifyAnnotation[]): ImageClassifyAnnotation[] {
    if (!labels?.length) {
      return [];
    }

    return data.filter((annotation) => {
      const label = labels.find((l) => l.name === annotation.value.labels[0]);
      return Boolean(label);
    });
  }

  function handleSave(): string {
    const value = transformAnnotationFormShape(editorState.current.annotationShapes);
    return JSON.stringify(value);
  }

  function handleRest() {
    if (originAnnotation.current) {
      setAnnotationObjectList(originAnnotation.current);
      initialAnnotation(originAnnotation.current);
    }
  }

  return (
    <section id="image-classify-module" className="h-full flex flex-col of-hidden">
      <div className="p-30px b-b-1 b-b-solid b-color-nord-snow-0 flex justify-center">
        <div id={editorId} style={{ ...editorState.current.size }} />
      </div>
      <div className="flex-auto flex of-hidden">
        <section id="presets" className="w-40% px-2 box-border">
          <h2 className="text-14px my-0 py-3 b-b-1 b-b-dashed b-color-nord-snow-0">
            {intl.formatMessage({ id: "presets" })}
          </h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            {labels?.map((label) => (
              <LabelTag
                key={label.index}
                index={label.index}
                name={label.name}
                onClick={handleLabelClick}
                selected={Boolean(selectedLabels.find((l) => l.index === label.index))}
              />
            ))}
          </div>
        </section>
        <section
          id="annotations"
          className="w-60% px-2 box-border b-l-1 b-l-solid b-color-nord-snow-0 flex flex-col"
        >
          <h2 className="text-14px my-0 py-3 b-b-1 b-b-dashed b-color-nord-snow-0">
            {intl.formatMessage({ id: "annotations" })} ({annotationObjectList.length})
          </h2>
          <div className="of-auto flex-auto">
            {annotationObjectList.map((annotation, index) => (
              <p
                className="m-0 py-2 cursor-pointer flex hover:bg-nord-snow-1 b-rd-1 items-center"
                key={annotation.id}
              >
                <span className="c-nord-polar-3 w-36px">#{index + 1}</span>
                <LabelTag
                  index={
                    labels?.findIndex((label) => label.name === annotation.value.labels[0]) ?? 0
                  }
                  name={annotation.value.labels[0]}
                />
                <span className="flex-auto"></span>
                <span className="font-mono text-14px">
                  <span> x: {annotation.value.x.toFixed(2)}% </span>
                  <span> y: {annotation.value.y.toFixed(2)}% </span>
                </span>
              </p>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
});

ImageClassifyModule.displayName = "ImageClassifyModule";

export default ImageClassifyModule;
