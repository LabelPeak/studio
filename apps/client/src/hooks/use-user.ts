import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import StaffService from "@/services/staff";

import useAuth from "./use-auth";

const ONE_DAY = 24 * 60 * 60 * 1000;

function useUser() {
  const { token, reset: resetToken } = useAuth();
  const queryClient = new QueryClient();
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery({
    queryKey: ["profile", token],
    queryFn: async () => {
      try {
        const profile = await StaffService.getProfile();
        return profile;
      } catch (e) {
        navigate("/login");
        throw e;
      }
    },
    refetchInterval: 5 * ONE_DAY
  });

  const signout = useCallback(() => {
    resetToken();
    queryClient.clear();
    navigate("/login");
  }, [queryClient, navigate, resetToken]);

  return {
    ...user,
    signout
  };
}

export default useUser;
