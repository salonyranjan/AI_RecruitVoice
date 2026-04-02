import { ReactNode } from "react";
// Change the alias to a relative path to fix the Turbopack resolution error
import { isAuthenticated } from "../../lib/actions/auth.action"; 
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Check if the user is already logged in
  const isUserAuthenticated = await isAuthenticated();

  // If they are logged in, don't let them see the Sign Up page
  if (isUserAuthenticated) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
}