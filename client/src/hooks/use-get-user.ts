import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/user-query";

export const getCurrentUserQueryOptions = () => ({
	queryKey: ["user"],
	queryFn: getCurrentUser,
	retry: false,
});

const useGetUser = ({ enabled = false }: { enabled?: boolean } = {}) => {
	const {
		data: authUser,
		isPending,
		isFetched,
	} = useQuery({
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
