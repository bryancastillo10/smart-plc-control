import type { UserRole } from "@/types/enum";

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignUpRequest {
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
}

export interface AuthResponse {
	message: string;
	user: {
		userId: string;
		role: UserRole;
	}
}

export interface SignOutResponse {
	message: string;
}