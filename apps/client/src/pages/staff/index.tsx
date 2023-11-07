import { Button, Popconfirm, Space, Table, message } from "antd";
import { useRef, useState } from "react";
import AdminService from "@/services/admin";
import { ColumnsType } from "antd/es/table";
import CreateStaffFormDrawer from "./CreateStaffFormDrawer";
import UpdateStaffFormDrawer from "./UpdateStaffFormDrawer";
import { User } from "@/interfaces/user";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";

export default function StaffPage() {
  const [staffs, setStaffs] = useState<User[]>([]);
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [staffToUpdate, setStaffToUpdate] = useState<User>();
  const intl = useIntl();
  const paginationRef = useRef({ page: 1, size: 10 });

  const { loading, run: findAllStaff } = useRequest(AdminService.staff.findAll, {
    defaultParams: [{ ...paginationRef.current }],
    onSuccess: (res) => {
      if (res.data !== undefined && res.code === 200) {
        setStaffs(res.data.list);
        setTotalStaffs(res.data.total);
      }
    }
  });

  function handleChangePage(pagination: any) {
    paginationRef.current.page = pagination.current;
    findAllStaff(paginationRef.current);
  }

  function handleUpdateStaff(staff: User) {
    setShowUpdateForm(true);
    setStaffToUpdate(staff);
  }

  function handleUpdateFormClose(shouldUpdate: boolean) {
    if (shouldUpdate) findAllStaff(paginationRef.current);
    setShowUpdateForm(false);
  }

  async function handleDeleteStaff(staff: User) {
    const res = await AdminService.staff.remove({ id: staff.id! });
    if (res.code == 200) {
      message.success("删除成功");
      findAllStaff(paginationRef.current);
    } else {
      message.error("删除失败: " + res.msg || "未知错误");
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
      render: (_, record) => <Space>
        <Button
          type="link"
          onClick={() => handleUpdateStaff(record)}>
            修改
        </Button>
        <Popconfirm
          title="确认删除"
          onConfirm={() => handleDeleteStaff(record)}
        >
          <Button type="link" danger disabled={record.superadmin || false}>
            移除
          </Button>
        </Popconfirm>
      </Space>,
      width: 100
    }
  ];

  return (
    <section id="staff-page" className="bg-white m-4 p-6">
      <div className="flex">
        <h1 className="mt-0 text-5">{ intl.formatMessage({ id: "page-title-staffs" })}</h1>
        <div className="flex-auto" />
        <Space>
          <Button type="primary" onClick={() => setShowCreateForm(true)}>录入员工</Button>
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