import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { logout } from "@/features/auth/queries";
import { useToast } from "@/integrations/sonner";
import { useUserStore } from "@/store/user";

export function useLogout() {
	const { t } = useTranslation("toast");
	const navigate = useNavigate();
	const toast = useToast();
	const clearUser = useUserStore((state) => state.clearUser);

	const logoutMutation = useMutation({
		mutationFn: logout,
		onMutate: () => toast.loading(t("auth.signOut.loading")),
		onSuccess: async (response) => {
			clearUser();
			toast.success(response.message || t("auth.signOut.success"));
			await navigate({ to: "/" });
		},
		onError: (error) => {
			toast.error(error, t("auth.signOut.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	return {
		logout: logoutMutation.mutate,
		logoutAsync: logoutMutation.mutateAsync,
		logoutLoading: logoutMutation.isPending,
		logoutResponse: logoutMutation.data,
		logoutError: logoutMutation.error,
	};
}
