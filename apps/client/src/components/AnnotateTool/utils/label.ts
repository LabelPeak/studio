import { ImageClassifyAnnotation, Label } from "shared";

export function filterAnnotationByLabels(annotations: ImageClassifyAnnotation[], labels: Label[]) {
  if (!labels.length) {
    return [];
  }
  return annotations.filter((annotation) => {
    const label = labels.find((l) => l.name === annotation.value.labels[0]);
    return Boolean(label);
  });
}
