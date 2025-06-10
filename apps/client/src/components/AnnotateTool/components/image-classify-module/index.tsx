import { message } from "antd";
import { DragEvent } from "leafer-ui";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { last } from "remeda";
import { ImageClassifyAnnotation, Label } from "shared";

import { LabelTagColors } from "@/components/LabelTag";

import AnnotateToolContext from "../../context";
import { useAnnotationImage } from "../../hooks/use-annotation-image";
import { useEditor } from "../../hooks/use-editor";
import { useOperationManager } from "../../hooks/use-operation-stack";
import { AnnotateModuleRef, IModuleProps } from "../../types";
import ImageRectAnnotationShape from "../../utils/image-rect-annotation-shape";
import { filterAnnotationByLabels } from "../../utils/label";
import { transformShapeToImageAnnotation } from "../../utils/transformer";
import AnnotationList from "../annotation-list";
import LabelSelect from "../label-select";

const CANVAS_SIZE = { height: 320, width: 512 };

const ImageClassifyModule = forwardRef<AnnotateModuleRef, IModuleProps>((props, ref) => {
  const { dataItem, onUpdate } = props;
  const { presets: labels } = useContext(AnnotateToolContext);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const annotatingLabel = useRef<Label | null>(null);
  const [annotationObjectList, setAnnotationObjectList] = useState<ImageClassifyAnnotation[]>([]);

  const shapesRef = useRef<ImageRectAnnotationShape[]>([]);
  const { editor, imageLayer, annotationLayer, domId } = useEditor();

  const { imageMeta } = useAnnotationImage({
    url: dataItem.file,
    canvasSize: CANVAS_SIZE,
    imageLayer
  });

  const operation = useOperationManager(annotationLayer, shapesRef.current);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const ids = [
      editor.on_(DragEvent.START, (e: DragEvent) => {
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
        operation.execute?.("add", shape);
      }),
      editor.on_(DragEvent.DRAG, (e) => {
        if (!annotatingLabel.current) {
          return;
        }
        const shape = last(shapesRef.current);
        shape?.shapeTo({ x: e.x, y: e.y });
      }),
      editor.on_(DragEvent.END, () => {
        if (!annotatingLabel.current || !imageMeta) {
          return;
        }
        const rect = last(shapesRef.current);
        if (rect === undefined) {
          return;
        }
        const annotations = transformShapeToImageAnnotation([rect], imageMeta, CANVAS_SIZE);
        setAnnotationObjectList((list) => list.concat(annotations));
        onUpdate(annotations);
        annotatingLabel.current = null;
        setSelectedLabels([]);
      })
    ];

    return () => {
      ids.forEach((id) => editor.off_(id));
    };
  }, [editor, onUpdate, operation, imageMeta]);

  const initialAnnotation = useCallback(() => {
    const annotations = filterAnnotationByLabels(
      dataItem.annotation as ImageClassifyAnnotation[],
      labels ?? []
    );
    shapesRef.current.forEach((shape) => shape.rect.destroy());
    shapesRef.current = [];
    if (!imageMeta) {
      return;
    }
    setAnnotationObjectList(annotations);
    const isFitHeight = CANVAS_SIZE.width / CANVAS_SIZE.height > imageMeta.width / imageMeta.height;
    const scale = isFitHeight
      ? CANVAS_SIZE.height / imageMeta.height
      : CANVAS_SIZE.width / imageMeta.width;
    const imageScaledSize = {
      height: isFitHeight ? CANVAS_SIZE.height : imageMeta.height * scale,
      width: isFitHeight ? imageMeta.width * scale : CANVAS_SIZE.width
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
              (CANVAS_SIZE.width - imageScaledSize.width) / 2
            : (CANVAS_SIZE.width * annotation.value.x) / 100,
          y: isFitHeight
            ? (CANVAS_SIZE.height * annotation.value.y) / 100
            : (annotation.value.y / 100) * imageScaledSize.height +
              (CANVAS_SIZE.height - imageScaledSize.height) / 2,
          height: (imageScaledSize.height * annotation.value.height) / 100,
          width: (imageScaledSize.width * annotation.value.width) / 100,
          fill: `${color}10`,
          stroke: color
        },
        label
      );
      shapesRef.current.push(shape);
      annotationLayer?.add(shape.rect);
    });
  }, [dataItem.annotation, labels, imageMeta, annotationLayer]);

  useEffect(() => {
    if (!imageLayer || !annotationLayer || !imageMeta) {
      return;
    }

    try {
      initialAnnotation();
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error("初始化标注工具失败: " + e.message || "未知错误");
      }
    }
  }, [dataItem, imageLayer, annotationLayer, initialAnnotation, labels, imageMeta]);

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
      annotatingLabel.current = value;
      setSelectedLabels([value]);
    }
  }

  const handleSave = useCallback(() => {
    if (!imageMeta) {
      throw new Error("image not loaded");
    }

    const value = transformShapeToImageAnnotation(shapesRef.current, imageMeta, CANVAS_SIZE);
    return JSON.stringify(value);
  }, [imageMeta]);

  const handleRedo = useCallback(() => {
    operation.redo?.();
  }, [operation]);

  const handleUndo = useCallback(() => {
    operation.undo?.();
  }, [operation]);

  const handleReset = useCallback(() => {
    operation.execute?.("reset", shapesRef.current);
    setAnnotationObjectList([]);
  }, [operation]);

  useImperativeHandle(
    ref,
    () => ({
      save: handleSave,
      undo: handleUndo,
      redo: handleRedo,
      reset: handleReset
    }),
    [handleRedo, handleSave, handleUndo, handleReset]
  );

  return (
    <section id="image-classify-module" className="h-full flex flex-col of-hidden">
      <div className="p-30px b-b-1 b-b-solid b-color-nord-snow-0 flex justify-center">
        <div id={domId} style={{ ...CANVAS_SIZE }} />
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
