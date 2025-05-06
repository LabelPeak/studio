import { useQuery } from "@tanstack/react-query";
import { Button, message, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useIntl } from "react-intl";

import { User } from "@/interfaces/user";
import StaffService from "@/services/staff";

import CreateStaffFormDrawer from "./CreateStaffFormDrawer";
import UpdateStaffFormDrawer from "./UpdateStaffFormDrawer";

export default function StaffPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [staffToUpdate, setStaffToUpdate] = useState<User>();
  const intl = useIntl();
  const [staffPage, setStaffPage] = useState(1);

  const {
    data: queryStaffResp,
    refetch: refreshStaffs,
    isFetching: loading
  } = useQuery({
    queryKey: ["allStaffs", staffPage] as const,
    queryFn: async ({ queryKey }) =>
      StaffService.findAll({
        page: queryKey[1],
        size: 10
      })
  });

  const staffs = queryStaffResp?.list || [];
  const totalStaffs = queryStaffResp?.total || 0;

  function handleChangePage(pagination: any) {
    // TODO: 调试值
    console.log({ pagination });
    setStaffPage(pagination.current);
  }

  function handleUpdateStaff(staff: User) {
    setShowUpdateForm(true);
    setStaffToUpdate(staff);
  }

  function handleUpdateFormClose(shouldUpdate: boolean) {
    if (shouldUpdate) {
      refreshStaffs();
    }
    setShowUpdateForm(false);
  }

  async function handleDeleteStaff(staff: User) {
    if (!staff.id) {
      return null;
    }

    try {
      await StaffService.remove({ id: staff.id });
      message.success("删除成功");
      refreshStaffs();
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error("删除失败: " + e.message || "未知错误");
      }
    }
  }

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100
    },
    {
      title: "用户名",
      dataIndex: "username",
      width: 200
    },
    {
      title: "姓名",
      dataIndex: "realname"
    },
    {
      key: "operate",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleUpdateStaff(record)}>
            修改
          </Button>
          <Popconfirm title="确认删除" onConfirm={() => handleDeleteStaff(record)}>
            <Button type="link" danger disabled={record.superadmin || false}>
              移除
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 100
    }
  ];

  return (
    <section id="staff-page" className="bg-white m-4 p-6">
      <div className="flex">
        <h1 className="mt-0 text-5">{intl.formatMessage({ id: "page-title-staffs" })}</h1>
        <div className="flex-auto" />
        <Space>
          <Button type="primary" onClick={() => setShowCreateForm(true)}>
            录入员工
          </Button>
        </Space>
      </div>
      <Table<User>
        columns={columns}
        dataSource={staffs}
        size="small"
        loading={loading}
        pagination={{
          total: totalStaffs
        }}
        onChange={handleChangePage}
        rowKey="id"
      />
      <CreateStaffFormDrawer
        open={showCreateForm}
        onSuccess={refreshStaffs}
        onClose={() => setShowCreateForm(false)}
      />
      <UpdateStaffFormDrawer
        open={showUpdateForm}
        defaultValue={staffToUpdate}
        onClose={handleUpdateFormClose}
      />
    </section>
  );
}
