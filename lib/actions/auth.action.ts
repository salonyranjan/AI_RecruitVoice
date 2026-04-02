"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

/**
 * TYPE DEFINITIONS
 * These must be defined so TypeScript understands the parameters 
 * being passed from your AuthForm component.
 */
export interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password?: string;
}

export interface SignInParams {
  email: string;
  idToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileURL?: string;
  resumeURL?: string;
}

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

/**
 * SET SESSION COOKIE
 * Creates a Firebase session cookie and stores it in the browser.
 */
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie using Firebase Admin SDK
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

/**
 * SIGN UP
 * Saves the user's metadata to Firestore after they sign up on the client.
 */
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // Check if user exists in Firestore
    const userRef = db.collection("users").doc(uid);
    const userRecord = await userRef.get();
    
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // Save user to Firestore
    await userRef.set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account created successfully.",
    };
  } catch (error: any) {
    console.error("Error in signUp action:", error);
    return {
      success: false,
      message: error.message || "Failed to create account. Please try again.",
    };
  }
}

/**
 * SIGN IN
 * Verifies the user exists and sets the session cookie.
 */
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Please create an account.",
      };
    }

    await setSessionCookie(idToken);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in signIn action:", error);
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

/**
 * SIGN OUT
 * Clears the session cookie.
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * GET CURRENT USER
 * Decodes the session cookie and fetches the user from Firestore.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Get user info from Firestore
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
    
    if (!userRecord.exists) return null;

    const userData = userRecord.data();
    return {
      ...userData,
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

/**
 * IS AUTHENTICATED
 * Simple helper for middleware or layouts.
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}