import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { signUp } from "@/features/auth/queries";
import type { SignUpVariables } from "@/features/auth/type";
import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { useUserStore } from "@/store/user";
import type { UserRole } from "@/types/enum";
import type { PlantSetupUser } from "@/types/plant-setup";

export function usePlantSetupUsers() {
	const { t } = useTranslation("toast");
	const currentUser = useUserStore((state) => state.user);
	const plant = usePlantSetupStore((state) => state.workflowState.plant);
	const users = usePlantSetupStore((state) => state.workflowState.users);
	const setUsers = usePlantSetupStore((state) => state.setUsers);
	const updatePlant = usePlantSetupStore((state) => state.updatePlant);
	const toast = useToast();

	useEffect(() => {
		if (!currentUser || users.some((user) => user.id === currentUser.id)) {
			return;
		}

		setUsers([
			{
				id: currentUser.id,
				username: currentUser.userName,
				email: currentUser.email,
				role: currentUser.role,
				language: currentUser.language,
			},
			...users,
		]);
	}, [currentUser, setUsers, users]);

	useEffect(() => {
		if (!plant || !currentUser) return;

		const accessibleBy = Array.from(
			new Set([currentUser.id, ...users.map((user) => user.id)]),
		);
		if (
			accessibleBy.length === plant.accessibleBy.length &&
			accessibleBy.every((id, index) => id === plant.accessibleBy[index])
		) {
			return;
		}

		updatePlant({ accessibleBy });
	}, [currentUser, plant, updatePlant, users]);

	const registerMutation = useMutation({
		mutationFn: (variables: SignUpVariables) => signUp(variables),
		onMutate: () => toast.loading(t("auth.register.loading")),
		onSuccess: (response, variables) => {
			const store = usePlantSetupStore.getState();
			const existingUsers = store.workflowState.users;
			if (existingUsers.some((user) => user.id === response.user.id)) return;

			const registeredUser: PlantSetupUser = {
				id: response.user.id,
				username: variables.username.trim(),
				email: variables.email.trim(),
				role: response.user.role,
				language: variables.language,
			};
			const nextUsers = [...existingUsers, registeredUser];
			store.setUsers(nextUsers);
			store.updatePlant({
				accessibleBy: Array.from(
					new Set([
						...(store.workflowState.plant?.accessibleBy ?? []),
						registeredUser.id,
					]),
				),
			});
			toast.success(t("auth.register.success"));
		},
		onError: (error) => toast.error(error, t("auth.register.failed")),
		onSettled: (_data, _error, _variables, toastId) =>
			toast.dismiss(toastId),
	});

	const updateUserRole = (userId: string, role: UserRole) => {
		if (currentUser?.role !== "ADMIN" || userId === currentUser.id) return;
		setUsers(
			users.map((user) => (user.id === userId ? { ...user, role } : user)),
		);
	};

	return {
		currentUser,
		isAdmin: currentUser?.role === "ADMIN",
		ownerId: currentUser?.id ?? null,
		registerUser: registerMutation.mutateAsync,
		registerUserError: registerMutation.error,
		registerUserLoading: registerMutation.isPending,
		updateUserRole,
		users,
	};
}

export default usePlantSetupUsers;
