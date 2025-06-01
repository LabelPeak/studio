import { useQuery } from "@tanstack/react-query";
import { Button, Drawer, Dropdown, Input, MenuProps, message, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useIntl } from "react-intl";

import useUser from "@/hooks/use-user";
import { User } from "@/interfaces/user";
import { Role } from "@/interfaces/user-project-relation";
import ProjectService from "@/services/project";
import StaffService from "@/services/staff";

interface IProps {
  projectId: number;
  open: boolean;
  onClose: () => void;
}

export default function AssignStaffFormDrawer(props: IProps) {
  const { open, onClose, projectId } = props;
  const { id: myId } = useUser();
  const [staffsPage, setStaffsPage] = useState(1);
  const [token, setToken] = useState("");
  const intl = useIntl();

  const dropdownItems: MenuProps["items"] = [Role.annotator, Role.checker].map((role) => ({
    key: role,
    label: intl.formatMessage({ id: `role-${role}` })
  }));

  const columns: ColumnsType<User> = [
    {
      title: intl.formatMessage({ id: "realname-prompt" }),
      dataIndex: "realname"
    },
    {
      title: intl.formatMessage({ id: "username-prompt" }),
      dataIndex: "username"
    },
    {
      title: "操作",
      align: "center",
      render: (_, record) => (
        <Dropdown
          disabled={record.superadmin || myId === record.id}
          menu={{
            items: dropdownItems,
            onClick: (e) => handleClickAssignMenu(record.id, e.key as Role)
          }}
          trigger={["click"]}
        >
          <Button type="link">添加</Button>
        </Dropdown>
      )
    }
  ];

  async function handleClickAssignMenu(id: number, role: Role) {
    try {
      await ProjectService.assignStaff({ project: projectId, user: id, role });
      message.success("成功添加员工到项目");
    } catch (err) {
      if (err instanceof Error) {
        message.error("添加员工到项目失败: " + err.message);
      }
    }
  }

  async function handleSearch(newVal: string) {
    setToken(newVal);
  }

  const { data: result, isFetching } = useQuery({
    queryKey: ["searchStaffs", token, staffsPage] as const,
    queryFn: async ({ queryKey }) => {
      if (queryKey[1] === "") {
        return {
          list: [],
          total: 0
        };
      }
      return StaffService.search({ token: queryKey[1], page: queryKey[2], size: 10 });
    }
  });

  return (
    <Drawer
      title={intl.formatMessage({ id: "project-assign-staff" })}
      width={600}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80
        }
      }}
    >
      <Input.Search
        placeholder={intl.formatMessage({ id: "staffs-search-prompt" })}
        allowClear
        enterButton={intl.formatMessage({ id: "search" })}
        size="large"
        onSearch={handleSearch}
      />
      <div className="my-4" />
      <Table<User>
        columns={columns}
        size="small"
        rowKey="id"
        loading={isFetching}
        dataSource={result?.list}
        onChange={(e) => setStaffsPage(e.current ?? 0)}
        pagination={{
          total: result?.total
        }}
      />
    </Drawer>
  );
}
