import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { signIn } from "@/features/auth/queries";
import type { SignInRequest } from "@/features/auth/type";
import { useToast } from "@/integrations/sonner";
import { useLanguageStore } from "@/store/language";
import { getErrorMessage } from "@/utils/error";

const initialSignIn: SignInRequest = {
	email: "",
	password: "",
};

const useSignin = () => {
	const { t } = useTranslation();
	const toast = useToast();
	const language = useLanguageStore((state) => state.language);
	const setLanguage = useLanguageStore((state) => state.setLanguage);
	const [signInData, setSignInData] = useState<SignInRequest>(initialSignIn);

	const signInMutation = useMutation({
		mutationFn: signIn,
		onSuccess: () => {
			toast.success(t("success"));
			setSignInData(initialSignIn);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error, t("failed")));
		},
	});

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSignInData((currentData) => ({
			...currentData,
			[event.target.id]: event.target.value,
		}));
	};

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();

		if (!signInData.email.trim() || !signInData.password) {
			toast.error(null, t("required"));
			return;
		}

		signInMutation.mutate({
			...signInData,
			email: signInData.email.trim(),
			language,
		});
	};

	return {
		language,
		setLanguage,
		signInData,
		onChange,
		handleSubmit,
		signInLoading: signInMutation.isPending,
		signInResponse: signInMutation.data,
		signInError: signInMutation.error,
	};
};

export default useSignin;
