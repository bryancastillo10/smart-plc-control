import { Link } from "@tanstack/react-router";
import { useId } from "react";

import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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

							<Button className="w-full" type="submit">
								{isSignUp ? "Sign up" : "Sign in"}
							</Button>
						</form>

						<p className="mt-4 text-center text-sm text-slate-300">
							{isSignUp ? "Already have an account?" : "Need an account?"}{" "}
							<Link
								className="font-medium text-sky-300 underline-offset-4 hover:underline"
								to={isSignUp ? "/sign-in" : "/sign-up"}
							>
								{isSignUp ? "Sign in" : "Sign up"}
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
};

export default AuthForm;
