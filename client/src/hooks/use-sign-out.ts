import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { signOut } from "@/api/auth-query";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/user";

const useSignOut = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { mutate, isPending, isError } = useMutation({
		mutationFn: signOut,
		onSuccess: async () => {
			useUserStore.getState().clearAuthUser();
			queryClient.setQueryData(["user"], null);
			await queryClient.invalidateQueries({
				queryKey: ["user"],
				refetchType: "none",
			});
			toast.success(t("signOutSuccess"));

			navigate({ to: "/" });
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : t("signOutError");
			toast.error(message);
		},
	});

	const handleSignout = () => {
		mutate();
	};

	return {
		loading: isPending,
		isError,
		handleSignout,
	};
};

export default useSignOut;
