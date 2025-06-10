import { Button, Card, Space } from "antd";
import { useState } from "react";

import { ChangePasswordModal } from "./ChangePasswordModal";

interface AccountSupportSectionProps {
  onLogout: () => void;
}

export function AccountSupportSection({ onLogout }: AccountSupportSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showPasswordModal = () => {
    setIsModalOpen(true);
  };

  const handlePasswordModalOk = async (values: {
    oldPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }) => {
    // TODO: await onChangePassword(values);
    console.log(values);
    // 如果 onChangePassword 成功解析 (没有抛出错误), 我们关闭 Modal
    setIsModalOpen(false);
    // ChangePasswordModal 内部的 onOk 逻辑会在成功后清空表单
  };

  const handlePasswordModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Card title="账号与支持">
      <Space align="start" style={{ width: "100%" }}>
        <Button onClick={showPasswordModal}>修改密码</Button>
        <Button danger onClick={onLogout} block>
          退出登录
        </Button>
      </Space>
      <ChangePasswordModal
        open={isModalOpen}
        onOk={handlePasswordModalOk}
        onCancel={handlePasswordModalCancel}
      />
    </Card>
  );
}
