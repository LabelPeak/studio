import { Button, Table } from "antd";
import { useRef, useState } from "react";
import AssignStaffFormDrawer from "./AssignStaffFormDrawer";
import { ColumnsType } from "antd/es/table";
import { Role } from "@/interfaces/project";
import RoleTag from "@/components/RoleTag";
import StaffService from "@/services/staff";
import { User } from "@/interfaces/user";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";
import useWorkingProject from "@/hooks/useWorkingProject";

interface UserWithRole extends User {
  role: Role
}

export default function ProjectSettingMember() {
  const intl = useIntl();
  const project = useWorkingProject(state => state.project);
  const [staffs, setStaffs] = useState<UserWithRole[]>([]);
  const paginationRef = useRef({ page: 1, size: 10 });
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [openAssignForm, setOpenAssignForm] = useState(false);

  const { loading, run: findAllInProject } = useRequest(StaffService.findAllInProject, {
    defaultParams: [{ project: project!.id, ...paginationRef.current }],
    onSuccess: (res) => {
      if (res.data && res.code === 200) {
        setStaffs(res.data.list);
        setTotalStaffs(res.data.total);
      }
    }
  });

  const columns: ColumnsType<UserWithRole> = [
    {
      title: intl.formatMessage({ id: "id-prompt" }),
      dataIndex: "id"
    },
    {
      title: intl.formatMessage({ id: "username-prompt" }),
      dataIndex: "username"
    },
    {
      title: intl.formatMessage({ id: "realname-prompt" }),
      dataIndex: "realname"
    },
    {
      title: intl.formatMessage({ id: "role-prompt" }),
      dataIndex: "role",
      render: (value) => <RoleTag role={value} />
    },
    {
      title: intl.formatMessage({ id: "operation-prompt" }),
      width: 80,
      align: "center",
      render: () => (
        <Button type="link" danger>移除</Button>
      )
    }
  ];

  function handleClickAssign() {
    setOpenAssignForm(true);
  }

  function handleCloseAssignForm() {
    setOpenAssignForm(false);
    findAllInProject({ project: project!.id, ...paginationRef.current });
  }

  return (
    <div id="member-setting" className="px-6">
      <div className="flex items-center">
        <h1>{ intl.formatMessage({ id: "project-setting-member" }) }</h1>
        <div className="flex-auto" />
        <Button type="primary" onClick={handleClickAssign}>
          { intl.formatMessage({ id: "project-assign-staff" })}
        </Button>
      </div>
      <Table<UserWithRole>
        columns={columns}
        rowKey="id"
        dataSource={staffs}
        loading={loading}
        pagination={{
          total: totalStaffs
        }}
      />
      <AssignStaffFormDrawer
        projectId={project!.id}
        open={openAssignForm}
        onClose={handleCloseAssignForm}
      />
    </div>
  );
}