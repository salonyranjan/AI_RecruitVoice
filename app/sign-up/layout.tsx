import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Use a relative path to ensure Turbopack finds the file
import { isAuthenticated } from "../../lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  // Check authentication status
  const isUserAuthenticated = await isAuthenticated();
  
  // Redirect if already logged in
  if (isUserAuthenticated) {
    redirect("/");
  }

  return (
    <div className="auth-layout min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
