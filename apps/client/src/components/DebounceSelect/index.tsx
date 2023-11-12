import { Select, Spin } from "antd";
import type { SelectProps } from "antd/es/select";
import { useRequest } from "ahooks";
import { useState } from "react";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

export default function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
  const [options, setOptions] = useState<ValueType[]>([]);

  const { loading, run: debounceFetcher } = useRequest(fetchOptions, {
    manual: true,
    debounceWait: debounceTimeout,
    onSuccess: (newOptions) => {
      setOptions(newOptions);
    }
  });

  return (
    <Select
      labelInValue
      filterOption={false}
      showSearch
      onSearch={debounceFetcher}
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}