import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/user-query";
import { useUserStore } from "@/store/user";

export const getCurrentUserQueryOptions = () => ({
	queryKey: ["user"],
	queryFn: async () => {
		try {
			const authUser = await getCurrentUser();
			useUserStore.getState().setAuthUser(authUser);
			return authUser;
		} catch (error) {
			useUserStore.getState().clearAuthUser();
			throw error;
		}
	},
	retry: false,
});

const useGetUser = ({ enabled = false }: { enabled?: boolean } = {}) => {
	const authUser = useUserStore((state) => state.authUser);
	const { isPending, isFetched } = useQuery({
		...getCurrentUserQueryOptions(),
		enabled,
	});

	return {
		authUser,
		isLoading: enabled && isPending,
		isFetched,
		isAuthenticated: Boolean(authUser),
	};
};

export default useGetUser;
