import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signOut } from "@/api/auth-query";
import { useToast } from "@/hooks/use-toast";

const useSignOut = () => {
	const navigate = useNavigate();
	const toast = useToast();

	const queryClient = useQueryClient();

	const { mutate, isPending, isError } = useMutation({
		mutationFn: signOut,
		onSuccess: async () => {
			queryClient.setQueryData(["user"], null);
			await queryClient.invalidateQueries({
				queryKey: ["user"],
				refetchType: "none",
			});
			toast.success("You have signed out");

			navigate({ to: "/" });
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Invalid to sign out";
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
