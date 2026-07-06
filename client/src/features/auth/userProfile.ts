import type { CurrentUserResponse } from "@/features/auth/type";
import type { UserProfile } from "@/types/user";

export function toUserProfile(user: CurrentUserResponse): UserProfile {
	return {
		id: user.id,
		userName: user.username,
		email: user.email,
		role: user.role,
		language: user.language,
		hasOwnedPlant: user.hasOwnedPlant,
		createdAt: user.created_at,
		updatedAt: user.updated_at,
	};
}
