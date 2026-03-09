import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, useState } from "react";
import { signIn } from "@/api/auth-query";

import type { SignInRequest } from "@/types/auth";

const initialSignIn = {
	email: "",
	password: "",
};

const useSignIn = () => {
	const [signInData, setSignInData] = useState<SignInRequest>(initialSignIn);


	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSignInData({ ...signInData, [e.target.id]: e.target.value });
	};

	const { mutate, isPending, isError } = useMutation({
		mutationFn: signIn,
		onSuccess: async () => {
			// await queryClient.fetchQuery({
			// 	queryKey: ["auth", "user"],
			// 	queryFn: getCurrentUser,
			// });
			// showToast("You are logged in", "success");
			// setCloseDialog();
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Invalid sign in";
			// showToast(message, "error");
			console.log(message);
		},
	});

	const handleSubmit = (e: FormDataEvent) => {
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
