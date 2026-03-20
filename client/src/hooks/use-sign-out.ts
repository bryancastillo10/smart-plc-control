import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { signOut } from "@/api/auth-query";
import { clearPersistedAuthUser } from "@/hooks/use-get-user";
import { useToast } from "@/hooks/use-toast";

const useSignOut = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { mutate, isPending, isError } = useMutation({
		mutationFn: signOut,
		onSuccess: async () => {
			clearPersistedAuthUser();
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
