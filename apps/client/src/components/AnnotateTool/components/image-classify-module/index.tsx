import { message } from "antd";
import { App, DragEvent, ImageEvent, Rect } from "leafer-ui";
import {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { doNothing } from "remeda";
import { ImageClassifyAnnotation, Label } from "shared";

import { LabelTagColors } from "@/components/LabelTag";
import { DataItem } from "@/interfaces/dataset";

import AnnotateToolContext from "../../context";
import { AnnotateModuleRef, EditorState, IModuleProps } from "../../types";
import ImageRectAnnotationShape from "../../utils/image-rect-annotation-shape";
import { transformShapeToImageAnnotation } from "../../utils/transformer";
import AnnotationList from "../annotation-list";
import LabelSelect from "../label-select";

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
      reset: handleReset
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
        const shape = new ImageRectAnnotationShape(
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
        if (!annotatingLabel.current || !editorState.current.loadedImageMeta) {
          return;
        }
        const rect = state.annotationShapes.at(state.annotationShapes.length - 1);
        if (rect === undefined) {
          return;
        }
        const annotations = transformShapeToImageAnnotation(
          [rect],
          editorState.current.loadedImageMeta,
          editorState.current.size
        );
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
      state.loadedImageRect = image;
      state.imageLayer?.add(image);

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
    // 绘制矩形选区
    annotations.forEach((annotation) => {
      const label = labels?.find((item) => item.name === annotation.value.labels[0]);
      if (!label) {
        throw new Error("invalid label #" + annotation.value.labels[0]);
      }
      const color = LabelTagColors[label.index % LabelTagColors.length];

      const shape = new ImageRectAnnotationShape(
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
    if (!editorState.current.loadedImageMeta) {
      throw new Error("image not loaded");
    }

    const value = transformShapeToImageAnnotation(
      editorState.current.annotationShapes,
      editorState.current.loadedImageMeta,
      editorState.current.size
    );
    return JSON.stringify(value);
  }

  function handleReset() {
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
        <LabelSelect
          availableLabels={labels}
          selectedLabels={selectedLabels}
          onLabelSelect={handleLabelClick}
        />
        <AnnotationList annotationObjectList={annotationObjectList} labels={labels} />
      </div>
    </section>
  );
});

ImageClassifyModule.displayName = "ImageClassifyModule";

export default ImageClassifyModule;
