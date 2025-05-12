import { logout } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.removeQueries({ queryKey: ["currentUser"] }),
  });
}
