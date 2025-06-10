import { Leafer } from "leafer-ui";
import { useMemo } from "react";

import ImageRectAnnotationShape from "../utils/image-rect-annotation-shape";

abstract class AnnotateOperation<P> {
  constructor(
    protected layer: Leafer,
    protected list: ImageRectAnnotationShape[],
    protected payload: P
  ) {}

  abstract undo(): void;
  abstract execute(): void;
}

class AddOperation extends AnnotateOperation<ImageRectAnnotationShape> {
  undo() {
    this.layer.remove(this.payload.rect);
    this.list.pop();
  }

  execute() {
    this.layer.add(this.payload.rect);
    this.list.push(this.payload);
  }
}

class RemoveOperation extends AnnotateOperation<ImageRectAnnotationShape> {
  undo() {
    this.layer.add(this.payload.rect);
    this.list.push(this.payload);
  }

  execute() {
    this.layer.remove(this.payload.rect);
    this.list.pop();
  }
}

class ResetOperation extends AnnotateOperation<ImageRectAnnotationShape[]> {
  private clonePayload: ImageRectAnnotationShape[];

  constructor(
    layer: Leafer,
    list: ImageRectAnnotationShape[],
    payload: ImageRectAnnotationShape[]
  ) {
    super(layer, list, payload);
    this.clonePayload = payload.slice();
  }

  undo() {
    this.clonePayload.forEach((item) => {
      this.layer.add(item.rect);
      this.list.push(item);
    });
  }

  execute() {
    this.clonePayload.forEach((item) => {
      this.layer.remove(item.rect);
    });
    this.clonePayload.forEach(() => {
      this.list.pop();
    });
  }
}

class OperationManager {
  private redoStack: AnnotateOperation<unknown>[] = [];
  private undoStack: AnnotateOperation<unknown>[] = [];

  constructor(
    protected layer: Leafer,
    protected list: ImageRectAnnotationShape[]
  ) {}

  execute(command: "add" | "remove" | "reset", payload: unknown) {
    let commandInstance: AnnotateOperation<unknown>;

    if (command === "add") {
      commandInstance = new AddOperation(
        this.layer,
        this.list,
        payload as ImageRectAnnotationShape
      );
    } else if (command === "remove") {
      commandInstance = new RemoveOperation(
        this.layer,
        this.list,
        payload as ImageRectAnnotationShape
      );
    } else {
      commandInstance = new ResetOperation(
        this.layer,
        this.list,
        payload as ImageRectAnnotationShape[]
      );
    }

    commandInstance.execute();
    this.undoStack.push(commandInstance);
    this.redoStack = [];
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }
}

export function useOperationManager(layer: Leafer | undefined, list: ImageRectAnnotationShape[]) {
  const instance = useMemo(() => {
    if (layer) {
      return new OperationManager(layer, list);
    }

    return null;
  }, [layer, list]);

  return {
    undo: instance?.undo.bind(instance),
    redo: instance?.redo.bind(instance),
    execute: instance?.execute.bind(instance)
  };
}
