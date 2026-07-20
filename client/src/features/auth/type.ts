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


export interface SignUpRequest {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: Role;
	language: Language;
}

export type SignUpVariables = SignUpRequest;

export interface SignUpResponse {
	message: string;
	user: SignInUser;
}
export interface LogoutResponse {
	message: string;
}

export interface CurrentUserResponse {
	id: string;
	username: string;
	email: string;
	role: Role;
	language: Language;
	hasOwnedPlant: boolean;
	created_at: string;
	updated_at: string;
}
