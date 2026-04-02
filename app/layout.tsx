<<<<<<< HEAD
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
=======
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepWise",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}

        <Toaster />
      </body>
    </html>
>>>>>>> e6c6a49 (Fix file structure and auth action paths)
  );
}