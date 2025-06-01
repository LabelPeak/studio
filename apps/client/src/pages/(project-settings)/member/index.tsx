import { useQuery } from "@tanstack/react-query";
import { Button, Table, TableColumnsType } from "antd";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import RoleTag from "@/components/RoleTag";
import { useProject } from "@/hooks/use-project";
import { User } from "@/interfaces/user";
import { Role } from "@/interfaces/user-project-relation";
import StaffService from "@/services/staff";

import AssignStaffFormDrawer from "./AssignStaffFormDrawer";

interface UserWithRole extends User {
  role: Role;
}

export default function ProjectSettingMember() {
  const { id: projectId = "" } = useParams();
  const { project } = useProject(parseInt(projectId));

  const intl = useIntl();
  const [staffsPage] = useState(1);
  const [openAssignForm, setOpenAssignForm] = useState(false);

  const {
    data: projectStaffsResp,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["projectStaffs", project.id, staffsPage] as const,
    queryFn: async ({ queryKey }) => {
      return StaffService.findAllInProject({
        project: queryKey[1],
        page: queryKey[2],
        size: 10
      });
    }
  });

  const { list: staffs = [], total: totalStaffs = 0 } = projectStaffsResp ?? {};

  const columns: TableColumnsType<UserWithRole> = [
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
        <Button type="link" danger>
          移除
        </Button>
      )
    }
  ];

  function handleClickAssign() {
    setOpenAssignForm(true);
  }

  function handleCloseAssignForm() {
    setOpenAssignForm(false);
    refetch();
  }

  return (
    <div id="member-setting" className="px-6">
      <div className="flex items-center">
        <h1>{intl.formatMessage({ id: "project-setting-member" })}</h1>
        <div className="flex-auto" />
        <Button type="primary" onClick={handleClickAssign}>
          {intl.formatMessage({ id: "project-assign-staff" })}
        </Button>
      </div>
      <Table<UserWithRole>
        columns={columns}
        rowKey="id"
        dataSource={staffs}
        loading={isFetching}
        pagination={{
          total: totalStaffs
        }}
      />
      <AssignStaffFormDrawer
        projectId={project.id}
        open={openAssignForm}
        onClose={handleCloseAssignForm}
      />
    </div>
  );
}
