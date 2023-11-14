interface IProps {
  checked: boolean | undefined;
}

export default function CheckStatusTag(props: IProps) {
  return (
    <span className="flex items-center gap-1 justify-center">
      { props.checked === true && (
        <>
          <div className="i-mdi-check-bold c-nord-aurora-3" />
          <span>已通过</span>
        </>
      )}
      { props.checked === false && (
        <>
          <div className="i-mdi-close-thick c-nord-aurora-0" />
          <span>未通过</span>
        </>
      )}
      { props.checked === undefined && (
        <>
          <div className="i-mdi-minus-thick c-nord-aurora-2" />
          <span>未审核</span>
        </>
      )}
    </span>
  );
}