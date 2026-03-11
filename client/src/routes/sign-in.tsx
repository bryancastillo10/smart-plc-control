import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useSignIn from "@/hooks/use-sign-in";

export const Route = createFileRoute("/sign-in")({
	component: SignIn,
});

function SignIn() {
	const { signInData, loading, onChange, handleSubmit } = useSignIn();
	const emailId = useId();
	const passwordId = useId();

	return (
		<main className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
				<Card className="w-full max-w-md border-slate border-slate-700/80 bg-slate-900/80 text-slate-50 backdrop-blur">
					<CardHeader className="">
						<CardTitle>Welcome Back</CardTitle>
						<CardDescription>
							Sign in with your email and password
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<div className="flex flex-col gap-3">
								<Label htmlFor={emailId}>Email</Label>
								<Input
									id={emailId}
									name="email"
									value={signInData.email}
									onChange={onChange}
									required
									type="email"
								/>
							</div>

							<div className="flex flex-col gap-3">
								<Label htmlFor={passwordId}>Password</Label>
								<Input
									id={passwordId}
									name="password"
									value={signInData.password}
									onChange={onChange}
									required
									type="password"
								/>
							</div>

							<Button
								disabled={loading}
								variant="secondary"
								className="w-full"
								type="submit"
							>
								{loading ? "Signing In..." : "Sign In"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
