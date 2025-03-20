"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const googleSignUpAction = async () => {};

export const googleSignInAction = async (formData: FormData) => {
  // e.preventDefault();
  console.log("Inside google sign in action");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });
  console.log("Data: ", data);
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};

//  check for new username and create if it does not exist in database
export const checkUsername = async (username: string) => {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from("users")
    .select("username");

  if (error) {
    console.log("Something went wrong when checking username ", error);
  } else {
    console.log("Username data: ", users);
  }

  return false;
};

export const signUpAction = async (formData: FormData) => {
  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !username) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email, username, and password are required"
    );
  }

  const usernameExists: Boolean = await checkUsername(username);

  if (usernameExists) {
    console.log("Username already exists");
    return encodedRedirect(
      "error",
      "/sign-up",
      "Username already exists. Please choose another one"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    // add code to add newly created user to public.users table with required fields....
    const { data, error } = await supabase
      .from("users")
      .insert([{ username: username, email: email, provider: "supabase" }])
      .select();

    console.log("Data after adding user in users table: ", data);
    console.log("Error after adding user in users table: ", error);

    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }

  return encodedRedirect(
    "error",
    "/sign-up",
    "Wait a bit please. still coding. YOU WILL BE IN SOON"
  );
};

export const signInAction = async (formData: FormData) => {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  let email = identifier;

  if (!identifier.includes("@")) {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("username", identifier)
      .single();

    if (!data || error) {
      return encodedRedirect("error", "/sign-in", "Invalid username or email");
    }

    email = data.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
