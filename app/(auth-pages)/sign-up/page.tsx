import { signUpAction, googleSignInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton, GoogleSubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign Up</h1>
      <p className="text-sm text-foreground">
        Already have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>

      {/* Email/Password Login Form */}
      <form className="flex flex-col gap-2 [&>input]:mb-3 mt-8" action={signUpAction}>
        <Label htmlFor="username">Username</Label>
        <Input name="username" placeholder="wizard_of_oz" />
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        {/* Display Form Messages */}
        <FormMessage message={searchParams} />
        <SubmitButton pendingText="Signing In...">
          Sign Up
        </SubmitButton>
      </form>

      {/* Google OAuth Button */}
      <form className="mt-4 w-full" action={googleSignInAction}>
        <GoogleSubmitButton pendingText="Signing In with Google">
          Sign In with Google
        </GoogleSubmitButton>
      </form>
    </div>
  );
}
