import { Button, Drawer, Dropdown, Input, MenuProps, Table, message } from "antd";
import { useRef, useState } from "react";
import { ColumnsType } from "antd/es/table";
import ProjectService from "@/services/project";
import { Role } from "@/interfaces/project";
import StaffService from "@/services/staff";
import { User } from "@/interfaces/user";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";
import useUser from "@/hooks/useUser";

interface IProps {
  projectId: number;
  open: boolean;
  onClose: () => void;
}

export default function AssignStaffFormDrawer(props: IProps) {
  const { open, onClose, projectId } = props;
  const [result, setResult] = useState<User[]>([]);
  const [resultCount, setResultCount] = useState(0);
  const myId = useUser(state => state.id);
  const tokenRef = useRef("");
  const intl = useIntl();

  const dropdownItems: MenuProps["items"] = [Role.annotator, Role.checker].map(role => ({
    key: role,
    label: intl.formatMessage({ id: `role-${role }`})
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
          disabled={(record.superadmin || false) || myId === record.id }
          menu={{
            items: dropdownItems,
            onClick: (e) => handleClickAssignMenu(record.id!, e.key as Role)
          }}
          trigger={["click"]}>
          <Button type="link">添加</Button>
        </Dropdown>
      )
    }
  ];

  async function handleClickAssignMenu(id: number, role: Role) {
    const res = await ProjectService.assignStaff({ project: projectId, user: id, role });
    if (res.code === 200) {
      message.success("成功添加员工到项目");
    } else {
      message.error("添加员工到项目失败: " + res.msg || "未知错误");
    }
  }

  async function handleSearch(token: string) {
    tokenRef.current = token;
    if (token.length > 0) {
      searchStaffs({ page: 1, size: 10, token });
    }
  }

  function handleChangePage(pagination: any) {
    searchStaffs({ page: pagination.current,
      size: pagination.pageSize,
      token: tokenRef.current
    });
  }

  const { loading, run: searchStaffs } = useRequest(StaffService.search, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200 && res.data) {
        setResult(res.data.list);
        setResultCount(res.data.total);
      }
    }
  });

  return (
    <Drawer
      title={intl.formatMessage({ id: "project-assign-staff"})}
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
      <div className="my-4"/>
      <Table<User>
        columns={columns}
        size="small"
        rowKey="id"
        loading={loading}
        dataSource={result}
        onChange={handleChangePage}
        pagination={{
          total: resultCount
        }}
      />
    </Drawer>
  );
}