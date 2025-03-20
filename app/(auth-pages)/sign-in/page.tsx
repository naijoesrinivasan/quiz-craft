import { signInAction, googleSignInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton, GoogleSubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign In</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>

      {/* Email/Password Login Form */}
      <form className="flex flex-col gap-2 [&>input]:mb-3 mt-8" action={signInAction}>
        <Label htmlFor="identifier">Email or Username</Label>
        <Input name="identifier" placeholder="you@example.com" required />
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
        <SubmitButton pendingText="Signing In...">
          Sign in
        </SubmitButton>
      </form>

      {/* Google OAuth Button */}
      <form className="mt-4 w-full" action={googleSignInAction}>
        <GoogleSubmitButton pendingText="Signing In with Google">
          Sign In with Google
        </GoogleSubmitButton>
      </form>

      {/* Display Form Messages */}
      <FormMessage message={searchParams} />
    </div>
  );
}