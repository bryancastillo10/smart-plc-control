import { useId } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type AuthFormMode = "sign-in" | "sign-up";

type AuthFormProps = {
	mode: AuthFormMode;
};

const AuthForm = ({ mode }: AuthFormProps) => {
	const emailId = useId();
	const passwordId = useId();
	const userNameId = useId();
	const confirmPasswordId = useId();
	const isSignUp = mode === "sign-up";

	return (
		<main className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
				<Card className="w-full max-w-md border-slate-700/80 bg-slate-900/80 text-slate-50 backdrop-blur">
					<CardHeader>
						<CardTitle>
							{isSignUp ? "Create your account" : "Welcome back"}
						</CardTitle>
						<CardDescription className="text-slate-300">
							{isSignUp
								? "Provide username, email, and matching passwords to sign up."
								: "Sign in with your email and password."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-4" noValidate>
							{isSignUp ? (
								<div className="space-y-2">
									<Label htmlFor={userNameId}>Username</Label>
									<Input
										id={userNameId}
										name="username"
										placeholder="yourname"
										required
									/>
								</div>
							) : null}

							<div className="space-y-2">
								<Label htmlFor={emailId}>Email</Label>
								<Input
									id={emailId}
									name="email"
									placeholder="you@example.com"
									required
									type="email"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor={passwordId}>Password</Label>
								<Input
									id={passwordId}
									name="password"
									required
									type="password"
								/>
							</div>

							{isSignUp ? (
								<div className="space-y-2">
									<Label htmlFor={confirmPasswordId}>Confirm password</Label>
									<Input
										id={confirmPasswordId}
										name="confirmPassword"
										required
										type="password"
									/>
								</div>
							) : null}

							<Button variant="secondary" className="w-full" type="submit">
								{isSignUp ? "Sign up" : "Sign in"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
};

export default AuthForm;
