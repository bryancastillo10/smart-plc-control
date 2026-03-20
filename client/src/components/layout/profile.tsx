import useGetUser from "@/hooks/use-get-user";

const Profile = () => {
	const { authUser } = useGetUser();

	if (!authUser) {
		return null;
	}

	const avatarInitial = authUser.username.charAt(0).toUpperCase();

	return (
		<div className="mt-4 rounded-xl border border-border/60 bg-muted p-3">
			<div className="flex items-center gap-3">
				<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold ring-1 ring-cyan-400/30">
					{avatarInitial}
				</div>

				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-foreground">
						{authUser.username}
					</p>
					<p className="truncate text-xs text-muted-foreground">
						{authUser.email}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;
