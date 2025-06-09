import { Card, Collapse, Typography } from "antd";

const { Panel } = Collapse;

export function GuideSection() {
  return (
    <Card title="功能指南">
      <Collapse accordion ghost>
        <Panel header="如何导入项目数据" key="guide-1">
          <Typography.Paragraph>
            先确认你是项目的管理员，并且项目未进入标注或者预标注阶段
          </Typography.Paragraph>
          <Typography.Paragraph>进入项目列表，选择一个项目进入项目详情</Typography.Paragraph>
          <Typography.Paragraph>
            在右上角区域点击“导入数据”，选择单个或者多个文件即可导入，也可以拖拽文件导入
          </Typography.Paragraph>
          <Typography.Paragraph>
            图片分类标注仅支持导入常见的图片格式，请确认本地磁盘的图片格式是否正确
          </Typography.Paragraph>
        </Panel>
        <Panel header="如何查看项目进度" key="guide-2">
          <Typography.Paragraph>
            先确认你是系统管理员或者项目管理员，标注员或者审核员才能访问项目进度
          </Typography.Paragraph>
          <Typography.Paragraph>进入项目详情页，点击右上角的项目进展</Typography.Paragraph>
          <Typography.Paragraph>
            里面可以看到项目运行的流水线状态，点击单个节点后能查看推进时间和负责人
          </Typography.Paragraph>
        </Panel>
      </Collapse>
    </Card>
  );
}
