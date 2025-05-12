import { RegisterInput } from "@/types/auth-inputs";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth";
import ApiError from "@/utils/api-error";
import { User } from "@/types/user";

export default function useRegister() {
  return useMutation<User, Error | ApiError, RegisterInput>({
    mutationFn: (data: RegisterInput) => register(data),
  });
}
