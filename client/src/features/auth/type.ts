import type { Language, Role } from "@/types/enum";

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignInUser {
	id: string;
	role: Role;
}

export interface SignInResponse {
	message: string;
	user: SignInUser;
}

export interface SignInVariables extends SignInRequest {
	language: Language;
}

export interface LogoutResponse {
	message: string;
}

export interface CurrentUserResponse {
	username: string;
	email: string;
	role: Role;
	language: Language;
	created_at: string;
	updated_at: string;
}
