import { useIntl } from "react-intl";

interface IProps {
  type: "disable" | "empty"
}

export default function StaffColumnPlaceholder(props: IProps) {
  const { type } = props;
  const intl = useIntl();

  if (type === "disable") {
    return (
      <div className="text-center absolute top-[40%] translate-y-[-50%] c-nord-polar-3 w-full px-2 box-border">
        <div className="inline-block text-8 i-mdi-account-box-multiple-outline" />
        <p>{ intl.formatMessage({ id: "dashboard-staff-column-disable-prompt" })}</p>
      </div>
    );
  }
  else if (type === "empty") {
    return (
      <div className="text-center absolute top-[40%] translate-y-[-50%] c-nord-polar-3 w-full px-2 box-border">
        <div className="inline-block text-8 i-mdi-account-box-multiple-outline" />
        <p>{ intl.formatMessage({ id: "dashboard-staff-column-empty-prompt" })}</p>
      </div>
    );
  } else {
    return null;
  }
}