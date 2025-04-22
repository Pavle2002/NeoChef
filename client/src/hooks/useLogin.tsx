import { login } from "@/api/auth";
import { LoginInput } from "@/types/auth-inputs";
import { useMutation } from "@tanstack/react-query";

export default function useLogin() {
  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
  });
}
