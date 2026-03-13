import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, type SubmitEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn } from "@/api/auth-query";

import { getCurrentUserQueryOptions } from "@/hooks/use-get-user";
import { useToast } from "@/hooks/use-toast";
import type { SignInRequest } from "@/types/auth";

const initialSignIn = {
	email: "",
	password: "",
};

const useSignIn = () => {
	const [signInData, setSignInData] = useState<SignInRequest>(initialSignIn);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const toast = useToast();
	const { t } = useTranslation();

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSignInData({ ...signInData, [e.target.name]: e.target.value });
	};

	const { mutate, isPending, isError } = useMutation({
		mutationFn: signIn,
		onSuccess: async () => {
			await queryClient.fetchQuery(getCurrentUserQueryOptions());
			toast.success(t("signInSuccess"));

			navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			const message = error instanceof Error ? error.message : t("signInError");
			toast.error(message);
		},
	});

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		mutate(signInData);
	};

	return {
		signInData,
		loading: isPending,
		isError,
		onChange,
		handleSubmit,
	};
};

export default useSignIn;
