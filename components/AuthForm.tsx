"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

<<<<<<< HEAD
// Check these paths carefully for case-sensitivity!
import { auth } from "@/firebase/client"; 
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Changed to relative path to resolve the Turbopack build error
import { signIn, signUp } from "../lib/actions/auth.action";
import FormField from "./FormField";
=======
// Corrected Imports based on your specific UI folder structure
import { auth } from "@/firebase/client"; 
import { Form } from "./ui/form"; // Same folder as AuthForm.tsx  
import { Button } from "./ui/button"; // Same folder as AuthForm.tsx
import FormField from "./FormField"; // Same folder as AuthForm.tsx

// Go UP two levels to reach the root lib folder
import { signIn, signUp } from "../lib/actions/auth.action";

type FormType = "sign-in" | "sign-up";
>>>>>>> e6c6a49 (Fix file structure and auth action paths)

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3, "Name is required") : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({ email, idToken });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
<<<<<<< HEAD
      toast.error(error.message || "An unexpected error occurred");
=======
      toast.error(error.message || "An error occurred");
>>>>>>> e6c6a49 (Fix file structure and auth action paths)
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px] w-full">
      <div className="flex flex-col gap-6 p-10 bg-white rounded-xl shadow-sm">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
<<<<<<< HEAD
          <h2 className="text-primary-100 text-2xl font-bold">PrepWise</h2>
        </div>

        <h3 className="text-xl font-semibold text-center">Practice job interviews with AI</h3>
=======
          <h2 className="text-2xl font-bold">PrepWise</h2>
        </div>

        <h3 className="text-lg font-medium text-center text-slate-600">Practice job interviews with AI</h3>
>>>>>>> e6c6a49 (Fix file structure and auth action paths)

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
<<<<<<< HEAD

            <Button className="btn w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Processing..." : isSignIn ? "Sign In" : "Create an Account"}
=======
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Processing..." : isSignIn ? "Sign In" : "Create Account"}
>>>>>>> e6c6a49 (Fix file structure and auth action paths)
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm">
          {isSignIn ? "No account yet?" : "Have an account already?"}
<<<<<<< HEAD
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-primary ml-1 hover:underline"
          >
=======
          <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-blue-600 ml-1">
>>>>>>> e6c6a49 (Fix file structure and auth action paths)
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
