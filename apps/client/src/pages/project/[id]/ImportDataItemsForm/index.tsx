import { Descriptions, Modal, Upload } from "antd";
import { useState } from "react";
import { useIntl } from "react-intl";

import useAuth from "@/hooks/useAuth";
import { DataType } from "@/interfaces/dataset";
import { Project } from "@/interfaces/project";

interface IProps {
  isOpen: boolean;
  project: Project;
  handleClose: (count: number) => void;
}

const acceptTypeMapper: {
  [key in DataType]: string;
} = {
  "info-extract": ".doc, .docx, .pdf",
  "text-classify": ".txt",
  "image-text": ".png, .jpeg, .jpg, .bmp, .webp",
  "image-classify": ".png, .jpeg, .jpg, .bmp, .webp"
};

export default function ImportDataItemsForm(props: IProps) {
  const { isOpen, project, handleClose } = props;
  const token = useAuth((store) => store.token);
  const [countUploadedFiles, setCountUploadedFiles] = useState(0);
  const intl = useIntl();

  function handleUploadChange(info: any) {
    if (info.file.status === "done") {
      setCountUploadedFiles((count) => count + 1);
    }
  }

  function handleCloseModal() {
    handleClose(countUploadedFiles);
    setCountUploadedFiles(0);
  }

  return (
    <Modal
      title={intl.formatMessage({ id: "import" })}
      open={isOpen}
      footer={null}
      onCancel={handleCloseModal}
      width={700}
    >
      <Descriptions column={2}>
        <Descriptions.Item label={intl.formatMessage({ id: "project-name" })}>
          {project.name}
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: "dataset-type" })}>
          {intl.formatMessage({ id: project.dataset.type })}
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: "file-type-support" })}>
          {acceptTypeMapper[project.dataset.type]}
        </Descriptions.Item>
      </Descriptions>
      <Upload.Dragger
        name="file"
        multiple
        action={`/api/dataset/upload/${project.dataset.id}`}
        showUploadList={false}
        accept={acceptTypeMapper[project.dataset.type]}
        headers={{
          Authorization: token || ""
        }}
        onChange={handleUploadChange}
      >
        <div className="px-4">
          <p className="color-nord-frost-3">
            <div className="text-center i-mdi-file-upload-outline text-12 inline-block" />
          </p>
          <p>{intl.formatMessage({ id: "import-operation" })}</p>
          <p>{intl.formatMessage({ id: "import-desc" })}</p>
          {countUploadedFiles > 0 && (
            <div className="flex items-center justify-center">
              <div className="i-mdi-check-circle c-nord-aurora-3 text-5 mr-2" />
              <p className="text-4 c-nord-polar-2">
                {intl.formatMessage({ id: "import-count" }, { count: countUploadedFiles })}
              </p>
            </div>
          )}
        </div>
      </Upload.Dragger>
    </Modal>
  );
}
