import { QueryCache, QueryClient, QueryClientConfig } from "@tanstack/react-query";
import { message } from "antd";

const ONE_SECOND = 1000;

const globalQueryClientConfig: QueryClientConfig = {
  queryCache: new QueryCache({
    onError: (err) => message.error(err.message)
  }),
  defaultOptions: {
    queries: {
      retry: 2,
      // 缓存生效时间
      staleTime: 30 * ONE_SECOND
    }
  }
};

export const globalQueryClient = new QueryClient(globalQueryClientConfig);
