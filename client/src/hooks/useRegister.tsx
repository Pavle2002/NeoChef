import { RegisterInput } from "@/types/auth-inputs";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth";

export default function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
  });
}
