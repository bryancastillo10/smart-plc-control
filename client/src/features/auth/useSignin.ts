import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { currentUser, signIn } from "@/features/auth/queries";
import type { SignInRequest } from "@/features/auth/type";
import { toUserProfile } from "@/features/auth/userProfile";
import { useToast } from "@/integrations/sonner";
import { useLanguageStore } from "@/store/language";
import { useUserStore } from "@/store/user";
import { getErrorMessage } from "@/utils/error";

const initialSignIn: SignInRequest = {
	email: "",
	password: "",
};

const useSignin = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const toast = useToast();

	const language = useLanguageStore((state) => state.language);
	const setLanguage = useLanguageStore((state) => state.setLanguage);

	const setUser = useUserStore((state) => state.setUser);
	const clearUser = useUserStore((state) => state.clearUser);

	const [signInData, setSignInData] = useState<SignInRequest>(initialSignIn);
	const [showPassword, setShowPassword] = useState(false);

	const signInMutation = useMutation({
		mutationFn: signIn,
		onSuccess: async () => {
			try {
				const user = await currentUser();

				setUser(toUserProfile(user));
				toast.success(t("success"));
				setSignInData(initialSignIn);
				setShowPassword(false);
				await navigate({ to: "/dashboard" });
			} catch (error) {
				clearUser();
				toast.error(getErrorMessage(error, t("failed")));
			}
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

	const handleRevealPassword = () => {
		setShowPassword((current) => !current);
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
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
		showPassword,
		onChange,
		handleRevealPassword,
		handleSubmit,
		signInLoading: signInMutation.isPending,
		signInResponse: signInMutation.data,
		signInError: signInMutation.error,
	};
};

export default useSignin;
