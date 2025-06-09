import { Card, Descriptions, Space } from "antd";

import useUser from "@/hooks/use-user";

import { AccountSupportSection } from "./components/AccountSupportSection";
import { FaqSection } from "./components/FaqSection";
import { GuideSection } from "./components/GuideSection";

export function UserProfilePage() {
  const user = useUser();

  const handleLogout = () => {
    user.signout();
  };

  return (
    <section className="of-y-auto h-full">
      <div className="bg-white m-4 p-6">
        <h1 className="mt-0 text-5">User Profile</h1>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card title="基本信息">
            <Descriptions bordered={false} column={2} size="middle">
              <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{user.realname}</Descriptions.Item>
            </Descriptions>
          </Card>

          <AccountSupportSection onLogout={handleLogout} />
          <FaqSection />
          <GuideSection />
        </Space>
      </div>
    </section>
  );
}
