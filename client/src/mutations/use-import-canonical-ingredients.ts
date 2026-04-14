import { apiClient } from "@/lib/api-client";
import { getFormatedDate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useImportCanonicalIngredients() {
  return useMutation({
    mutationFn: () => apiClient.post<null>("/ingredients/import-canonical"),

    onMutate: () => {
      const toastId = toast.loading("Importing canonical ingredients... ⏳");
      return { toastId };
    },

    onSuccess: () => {
      toast.success("Canonical ingredients imported successfully! 🎉", {
        description: getFormatedDate() + " 📆",
      });
    },

    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },
  });
}
