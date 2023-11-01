export enum DataType {
  InfoExtract = "info-extract",
  TextClassify = "text-classify",
  ImageText = "image-text",
  ImageClassify = "image-classify"
}

export interface Dataset {
  id: number;
  /** 文件地址 */
  location: string;
  /** 所属项目的id */
  project: number;
  type: DataType;
}

export interface DataItem {
  id: number;
  /** JSON 格式的标注信息 */
  annotation: string;
  /** 所属的数据集id */
  dataset: number;
  /** 文件名称 */
  file: string;
}
