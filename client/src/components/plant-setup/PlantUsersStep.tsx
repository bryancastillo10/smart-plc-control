import { Crown, Plus, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRolesList } from "@/constants/userRoles";
import useSignUp from "@/features/auth/useSignUp";
import { appButtonVariants } from "@/styles/recipes";
import type { UserRole } from "@/types/enum";

const userRoleLabelKeys = {
	ADMIN: "plantUsers.roles.admin",
	OPERATOR: "plantUsers.roles.operator",
	VIEWER: "plantUsers.roles.viewer",
} as const satisfies Record<UserRole, string>;

export function PlantUsersStep() {
	const { t } = useTranslation("plantSetup");
	const {
		handleChange,
		handleSubmit,
		isAdmin,
		ownerId,
		registerUserLoading,
		signUpData,
		updateUserRole,
		users,
		validationMessage,
	} = useSignUp();

	return (
		<div className="space-y-6">
			<div className="overflow-x-auto rounded-md border border-line-subtle">
				<table className="w-full min-w-180 border-collapse text-left text-sm">
					<thead className="bg-chip text-xs uppercase tracking-wider text-brand-muted">
						<tr>
							<th className="px-4 py-3 font-bold">
								{t("plantUsers.table.user")}
							</th>
							<th className="px-4 py-3 font-bold">
								{t("plantUsers.table.responsibility")}
							</th>
							<th className="px-4 py-3 font-bold">
								{t("plantUsers.table.role")}
							</th>
							<th className="px-4 py-3 font-bold">
								{t("plantUsers.table.language")}
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-line-subtle">
						{users.map((user) => {
							const isOwner = user.id === ownerId;

							return (
								<tr className="bg-white/60" key={user.id}>
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip text-brand-control">
												<UserRound className="size-4" />
											</div>
											<div>
												<p className="font-bold text-brand-ink">
													{user.username}
												</p>
												<p className="text-xs text-brand-muted">{user.email}</p>
											</div>
										</div>
									</td>
									<td className="px-4 py-3">
										{isOwner ? (
											<span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
												<Crown className="size-3.5" />
												{t("plantUsers.owner")}
											</span>
										) : (
											<span className="text-brand-muted">
												{t("plantUsers.teamMember")}
											</span>
										)}
									</td>
									<td className="px-4 py-3">
										<select
											aria-label={t("plantUsers.roleFor", {
												name: user.username,
											})}
											className="h-9 rounded-md border border-input bg-transparent px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
											disabled={!isAdmin || isOwner}
											onChange={(event) =>
												updateUserRole(user.id, event.target.value as UserRole)
											}
											value={user.role}
										>
											{UserRolesList.map((role) => (
												<option
													key={t(userRoleLabelKeys[role])}
													value={t(userRoleLabelKeys[role])}
												>
													{t(userRoleLabelKeys[role])}
												</option>
											))}
										</select>
									</td>
									<td className="px-4 py-3 text-brand-muted">
										{user.language === "ZH-TW"
											? t("plantUsers.languages.traditionalChinese")
											: t("plantUsers.languages.english")}
									</td>
								</tr>
							);
						})}
						{users.length === 0 ? (
							<tr>
								<td
									className="px-4 py-8 text-center text-brand-muted"
									colSpan={4}
								>
									{t("plantUsers.empty")}
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>

			{isAdmin ? (
				<form
					className="grid gap-4 rounded-md border border-line-subtle bg-white/60 p-4 md:grid-cols-2"
					onSubmit={handleSubmit}
				>
					<div className="md:col-span-2">
						<h4 className="font-bold text-brand-ink">
							{t("plantUsers.addMember.title")}
						</h4>
						<p className="mt-1 text-sm text-brand-muted">
							{t("plantUsers.addMember.description")}
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="username">{t("plantUsers.fields.username")}</Label>
						<Input
							autoComplete="off"
							id="username"
							onChange={handleChange}
							required
							value={signUpData.username}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">{t("plantUsers.fields.email")}</Label>
						<Input
							autoComplete="off"
							id="email"
							onChange={handleChange}
							required
							type="email"
							value={signUpData.email}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="role">{t("plantUsers.fields.role")}</Label>
						<select
							className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
							id="role"
							onChange={handleChange}
							value={signUpData.role}
						>
							{UserRolesList.map((role) => (
								<option
									key={t(userRoleLabelKeys[role])}
									value={t(userRoleLabelKeys[role])}
								>
									{t(userRoleLabelKeys[role])}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="language">{t("plantUsers.fields.language")}</Label>
						<select
							className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
							id="language"
							onChange={handleChange}
							value={signUpData.language}
						>
							<option value="EN">{t("plantUsers.languages.english")}</option>
							<option value="ZH-TW">
								{t("plantUsers.languages.traditionalChinese")}
							</option>
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">
							{t("plantUsers.fields.temporaryPassword")}
						</Label>
						<Input
							autoComplete="new-password"
							id="password"
							onChange={handleChange}
							required
							type="password"
							value={signUpData.password}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">
							{t("plantUsers.fields.confirmPassword")}
						</Label>
						<Input
							autoComplete="new-password"
							id="confirmPassword"
							onChange={handleChange}
							required
							type="password"
							value={signUpData.confirmPassword}
						/>
					</div>

					{validationMessage ? (
						<p className="text-sm font-semibold text-red-700 md:col-span-2">
							{t("plantUsers.validation")}
						</p>
					) : null}

					<div className="flex justify-end md:col-span-2">
						<Button
							className={appButtonVariants({ size: "form" })}
							disabled={registerUserLoading}
							type="submit"
						>
							<Plus className="size-4" />
							{registerUserLoading
								? t("plantUsers.creating")
								: t("plantUsers.add")}
						</Button>
					</div>
				</form>
			) : (
				<div className="rounded-md border border-line-subtle bg-white/60 p-4 text-sm text-brand-muted">
					{t("plantUsers.adminOnly")}
				</div>
			)}
		</div>
	);
}
