import { Card, Collapse } from "antd";

const { Panel } = Collapse;

export function FaqSection() {
  return (
    <Card title="常见问题 (FAQ)">
      <Collapse accordion ghost>
        <Panel header="如何修改我的个人信息？" key="faq-1">
          系统暂未提供修改个人信息功能，请专注数据标注。如果创建的个人账号信息设置错误，请联系系统管理员提供帮助。
        </Panel>
        <Panel header="忘记密码了怎么办？" key="faq-2">
          系统中未提供找回密码的功能，请联系系统管理员来重置密码。重置完成后您可以来个人中心修改密码。
        </Panel>
        <Panel header="如何联系技术支持？" key="faq-3">
          {/* 你可以在这里添加联系技术支持的具体方式 */}
          <p>请通过企业微信联系您的项目管理员或指定的对接人。</p>
        </Panel>
      </Collapse>
    </Card>
  );
}
