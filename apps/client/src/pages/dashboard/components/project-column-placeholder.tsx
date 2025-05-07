import { useIntl } from "react-intl";

interface IProps {
  type: "empty";
}

export default function ProjectColumnPlaceholder(props: IProps) {
  const { type } = props;
  const intl = useIntl();

  if (type === "empty") {
    return (
      <div className="text-center absolute top-[40%] translate-y-[-50%] c-nord-polar-3 w-full px-2 box-border">
        <div className="inline-block text-8 i-mdi-folder-multiple-outline" />
        <p>{intl.formatMessage({ id: "dashboard-project-column-empty-prompt" })}</p>
      </div>
    );
  }
  return null;
}
