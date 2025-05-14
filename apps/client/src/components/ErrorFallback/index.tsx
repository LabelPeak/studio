import { FallbackProps } from "react-error-boundary";

import { CLIENT_ERROR_CODE, ClientError } from "@/utils/error";

export default function ErrorFallback({ error }: { error: FallbackProps }) {
  const errorMsg = error instanceof Error ? error.message : "Unknown error";

  if (error instanceof ClientError) {
    if (error.code === CLIENT_ERROR_CODE.NO_AUTHORIZATION) {
      window.location.href = "/login";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6 font-600">Oops, something went wrong</h1>
      <p className="text-4">{errorMsg}</p>
    </div>
  );
}
