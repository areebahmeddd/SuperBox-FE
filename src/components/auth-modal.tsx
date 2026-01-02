"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, githubProvider, googleProvider } from "@/lib/firebase";
import { showToast } from "@/lib/toast-utils";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Github, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [authStep, setAuthStep] = useState<
    "select" | "signin" | "signup" | "forgot"
  >("select");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setAuthStep("select");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
    onClose();
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: any) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        showToast.error("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        showToast.error("Too many attempts. Please try again later");
      } else {
        showToast.error("Login failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast.error("Passwords don't match. Please re-enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        showToast.error("Email already in use");
      } else if (error.code === "auth/weak-password") {
        showToast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        showToast.error("Invalid email address");
      } else {
        showToast.error("Registration failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      showToast.success("Password reset email sent. Check your inbox.");
      setAuthStep("signin");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        showToast.error("No account found with this email");
      } else if (error.code === "auth/invalid-email") {
        showToast.error("Invalid email address");
      } else {
        showToast.error("Failed to send reset email. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: any) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        setIsLoading(false);
        return;
      }

      if (error.code === "auth/popup-blocked") {
        showToast.error("Pop-up blocked. Please allow pop-ups and try again.");
      } else {
        showToast.error("Google sign-in failed. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: any) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        setIsLoading(false);
        return;
      }

      if (error.code === "auth/popup-blocked") {
        showToast.error("Pop-up blocked. Please allow pop-ups and try again.");
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        showToast.error(
          "An account already exists with this email using a different sign-in method.",
        );
      } else {
        showToast.error("GitHub sign-in failed. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in, sign up, or recover your account.
        </DialogDescription>
        {authStep !== "select" && (
          <button
            onClick={() => setAuthStep("select")}
            className="absolute top-4 left-4 p-1.5 transition-colors z-10 group rounded-sm opacity-70 hover:opacity-100"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        )}
        <div className="pt-2">
          {authStep === "select" ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.05,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{ willChange: "transform, opacity" }}
                className="mb-6 text-center"
              >
                <h2 className="text-xl font-bold text-foreground mb-1.5">
                  Welcome back!
                </h2>
                <p className="text-xs text-muted-foreground">
                  Sign in to continue to SuperBox Platform
                </p>
              </motion.div>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setAuthStep("signin")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4" />
                    Continue with Email
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.15,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="16"
                      height="16"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.191-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.022C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.095,5.571c0.001-0.001,0.003-0.002,0.004-0.003l6.191,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Button
                    variant="outline"
                    onClick={handleGithubLogin}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Github className="w-4 h-4" />
                    Continue with GitHub
                  </Button>
                </motion.div>
              </div>
            </>
          ) : authStep === "signin" ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="mb-8 text-center"
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Sign in with Email
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to continue
                </p>
              </motion.div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.15,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Label htmlFor="email" className="mb-2 block">
                    Email or Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email or username"
                      className="pl-12"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Label htmlFor="password" className="mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setAuthStep("forgot")}
                      className="h-auto p-0 text-xs"
                    >
                      Forgot password?
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setAuthStep("signup")}
                    className="h-auto p-0 font-medium"
                  >
                    Sign up
                  </Button>
                </motion.p>
              </form>
            </>
          ) : authStep === "signup" ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="mb-8 text-center"
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Create Account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Join SuperBox community today
                </p>
              </motion.div>

              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.15,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <label className="block text-left text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full pl-12 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <label className="block text-left text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <label className="block text-left text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-12 pr-12 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <label className="block text-left text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-12 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.35,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-full bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-black text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthStep("signin")}
                    className="text-[var(--brand-red)] hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </motion.p>
              </form>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="mb-8 text-center"
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Reset Password
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive a reset link
                </p>
              </motion.div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.15,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <label className="block text-left text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                    />
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-black text-sm font-semibold transition-all duration-200"
                >
                  Send Reset Link
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthStep("signin")}
                    className="text-[var(--brand-red)] hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </motion.p>
              </form>
            </>
          )}

          {authStep !== "forgot" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand-red)] underline hover:underline transition-all"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand-red)] underline hover:underline transition-all"
                >
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
