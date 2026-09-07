import { getUserStage } from "@/lib/user-api";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";
import { useQuery } from "@tanstack/react-query";

type UseUserStageOptions = {
  enabled?: boolean;
};

export function useUserStage(options?: UseUserStageOptions) {
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: [REACT_QUERY_KEYS.USER_STAGE_WEB],
    queryFn: () => getUserStage({ device: "web" }),
    enabled,
    staleTime: 0,
    retry: 1,
  });

  return query;
}
