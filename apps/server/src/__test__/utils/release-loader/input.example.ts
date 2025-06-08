import type { DataItem, Dataset } from "@/utils/release-loader/basic.ts";

export const exampleLabels = ["葡萄", "香蕉", "苹果", "卷心菜"];

export const exampleDataItems: DataItem[] = [
  {
    id: 1000,
    annotation: [
      {
        originHeight: 992,
        originWidth: 2056,
        value: {
          x: 5.13763427734375,
          y: 1.898567065085057,
          width: 28.672027587890625,
          height: 2.7194191309130673,
          labels: ["葡萄"]
        },
        id: "6GAuRzCT8t",
        type: "labels"
      },
      {
        originHeight: 992,
        originWidth: 2056,
        value: {
          x: 19.771575927734375,
          y: 20.8750170179772,
          width: 18.26171875,
          height: 3.033151025835007,
          labels: ["香蕉"]
        },
        id: "f6P9V8au1Y",
        type: "labels"
      }
    ],
    file: "http://images.cocodataset.org/test2014/COCO_test2014_000000523573.jpg",
    dataset: 1,
    reannotation: [],
    feedback: "",
    approved: true,
    updateAt: new Date()
  },
  {
    id: 1002,
    annotation: [
      {
        originHeight: 992,
        originWidth: 2056,
        value: {
          x: 40.47393798828125,
          y: 12.833004671177095,
          width: 19.219207763671875,
          height: 2.0208000187845863,
          labels: ["卷心菜"]
        },
        id: "BV_hsj_jC7",
        type: "labels"
      },
      {
        originHeight: 992,
        originWidth: 2056,
        value: {
          x: 20.177459716796875,
          y: 27.55572003627218,
          width: 16.298675537109375,
          height: 3.2506050990442024,
          labels: ["苹果"]
        },
        id: "HObwCkpKOA",
        type: "labels"
      }
    ],
    file: "http://images.cocodataset.org/test2014/COCO_test2014_000000347527.jpg",
    dataset: 1,
    reannotation: [],
    feedback: "",
    approved: true,
    updateAt: new Date()
  },
  {
    id: 1003,
    annotation: [
      {
        originHeight: 992,
        originWidth: 2056,
        value: {
          x: 77.52227783203125,
          y: -0.13714464022789752,
          width: 23.288726806640625,
          height: 46.203629880846044,
          labels: ["卷心菜"]
        },
        id: "fJzcnn7WMy",
        type: "labels"
      },
      {
        originHeight: 992,
        originWidth: 2056,
        value: {
          x: 11.32049560546875,
          y: 37.5103039031628,
          width: 19.171905517578125,
          height: 3.591348492217899,
          labels: ["葡萄"]
        },
        id: "f0u8jic0TR",
        type: "labels"
      }
    ],
    file: "http://images.cocodataset.org/test2014/COCO_test2014_000000413171.jpg",
    dataset: 1,
    reannotation: [],
    feedback: "",
    approved: true,
    updateAt: new Date()
  }
];

export const exampleDataset: Dataset = {
  id: 123,
  type: "dataset",
  location: "test",
  project: null
};

export const exampleDate = new Date("2025-06-03T00:00:00.000Z");
