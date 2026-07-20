import {
	type ChangeEvent,
	type SubmitEvent,
	useState,
} from "react";

import type { SignUpVariables } from "@/features/auth/type";
import { usePlantSetupUsers } from "@/features/users/usePlantSetupUsers";
import { UserRolesList } from "@/constants/userRoles";

const initialSignUpData: SignUpVariables = {
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
	role: "VIEWER",
	language: "EN",
};

export function useSignUp() {
	const plantUsers = usePlantSetupUsers();
	const [signUpData, setSignUpData] = useState(initialSignUpData);
	const [validationMessage, setValidationMessage] = useState<string | null>(
		null,
	);

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { id, value } = event.target;

		setSignUpData((current) => {
			switch (id) {
				case "username":
				case "email":
				case "password":
				case "confirmPassword":
					return { ...current, [id]: value };
				case "role":
					return UserRolesList.includes(value as (typeof UserRolesList)[number])
						? { ...current, role: value as SignUpVariables["role"] }
						: current;
				case "language":
					return value === "EN" || value === "ZH-TW"
						? { ...current, language: value }
						: current;
				default:
					return current;
			}
		});
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		setValidationMessage(null);

		if (
			!signUpData.username.trim() ||
			!signUpData.email.trim() ||
			!signUpData.password ||
			signUpData.password !== signUpData.confirmPassword
		) {
			setValidationMessage(
				"Complete all required fields and confirm that both passwords match.",
			);
			return;
		}

		try {
			await plantUsers.registerUser({
				...signUpData,
				username: signUpData.username.trim(),
				email: signUpData.email.trim(),
			});
			setSignUpData(initialSignUpData);
		} catch {
			// The registration mutation reports server errors through the shared toast.
		}
	};

	return {
		...plantUsers,
		handleChange,
		handleSubmit,
		signUpData,
		validationMessage,
	};
}

export default useSignUp;
