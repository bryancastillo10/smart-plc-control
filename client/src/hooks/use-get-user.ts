import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/user-query";
import type { User } from "@/types/user";

const AUTH_USER_STORAGE_KEY = "authUser";

const getPersistedAuthUser = (): User | undefined => {
	if (typeof window === "undefined") {
		return undefined;
	}

	const storedAuthUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

	if (!storedAuthUser) {
		return undefined;
	}

	try {
		return JSON.parse(storedAuthUser) as User;
	} catch {
		window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
		return undefined;
	}
};

export const persistAuthUser = (authUser: User) => {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authUser));
};

export const clearPersistedAuthUser = () => {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export const getCurrentUserQueryOptions = () => ({
	queryKey: ["user"],
	queryFn: async () => {
		try {
			const authUser = await getCurrentUser();
			persistAuthUser(authUser);
			return authUser;
		} catch (error) {
			clearPersistedAuthUser();
			throw error;
		}
	},
	retry: false,
});

const useGetUser = ({ enabled = false }: { enabled?: boolean } = {}) => {
	const { data, isPending, isFetched } = useQuery({
		...getCurrentUserQueryOptions(),
		enabled,
	});

	const authUser = data ?? (!enabled ? getPersistedAuthUser() : undefined);

	return {
		authUser,
		isLoading: enabled && isPending,
		isFetched,
		isAuthenticated: Boolean(authUser),
	};
};

export default useGetUser;
