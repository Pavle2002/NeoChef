import { login } from "@/api/auth";
import { LoginInput } from "@/types/auth-inputs";
import { User } from "@/types/user";
import ApiError from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<User, Error | ApiError, LoginInput>({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (data) => queryClient.setQueryData(["currentUser"], data),
  });
}
