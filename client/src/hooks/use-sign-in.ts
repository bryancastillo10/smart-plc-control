import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, SubmitEvent, useState } from "react";
import { signIn } from "@/api/auth-query";
import { useToast } from "@/hooks/use-toast";

import type { SignInRequest } from "@/types/auth";

const initialSignIn = {
	email: "",
	password: "",
};

const useSignIn = () => {
	const [signInData, setSignInData] = useState<SignInRequest>(initialSignIn);
	const queryClient = useQueryClient();
	const toast = useToast();

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSignInData({ ...signInData, [e.target.name]: e.target.value });
	};

	const { mutate, isPending, isError } = useMutation({
		mutationFn: signIn,
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: ["user"]});
			toast.success("You are logged in.");
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Invalid sign in";
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
