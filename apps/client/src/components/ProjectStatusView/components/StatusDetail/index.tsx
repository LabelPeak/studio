import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Empty } from "antd";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import { first } from "remeda";
import { ProjectStatusRecord } from "shared";

import StaffService from "@/services/staff";

import StatusLight from "../StatusLight";

interface StatusDetailProps {
  statusRecord: ProjectStatusRecord | null;
  statusHistory: ProjectStatusRecord[];
}

export default function StatusDetail({ statusRecord, statusHistory }: StatusDetailProps) {
  const intl = useIntl();
  const { data: user } = useQuery({
    queryKey: ["findStaffByUsername", statusRecord?.trigger ?? "_"] as const,
    queryFn: ({ queryKey }) => {
      return StaffService.search({
        token: queryKey[1],
        page: 1,
        size: 1
      });
    },
    enabled: Boolean(statusRecord?.trigger),
    select: (res) => first(res.list)
  });

  if (statusRecord === null) {
    return <Empty />;
  }

  return (
    <Card
      title={
        <div className="flex items-center">
          <StatusLight status={statusRecord.status} statusHistory={statusHistory} />
          <span className="ml-2">
            {intl.formatMessage({ id: `project-status-${statusRecord.status}` })}
          </span>
        </div>
      }
    >
      <Descriptions column={2} layout="vertical" size="middle">
        {statusRecord.trigger ? (
          <Descriptions.Item span={2} label="负责人">
            {user?.realname}
          </Descriptions.Item>
        ) : null}
        <Descriptions.Item label="开始时间">
          {statusRecord.startAt ? format(statusRecord.startAt, "yyyy-MM-dd HH:mm:ss") : "未开始"}
        </Descriptions.Item>
        {statusRecord.endAt ? (
          <Descriptions.Item label="结束时间">
            {format(statusRecord.endAt, "yyyy-MM-dd HH:mm:ss")}
          </Descriptions.Item>
        ) : null}
      </Descriptions>
    </Card>
  );
}
