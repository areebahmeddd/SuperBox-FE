"use client";

import { useToast } from "@/components/toast-provider";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

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
  const { addToast } = useToast();
  const [authStep, setAuthStep] = useState<
    "select" | "signin" | "signup" | "forgot"
  >("select");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleClose = () => {
    setAuthStep("select");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      username: email.split("@")[0],
      email: email,
    };
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userData", JSON.stringify(userData));
    if (onSuccess) onSuccess();
    handleClose();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast({
        title: "Passwords don't match",
        description: "Please re-enter your password.",
        variant: "error",
      });
      return;
    }
    const userData = {
      username: username,
      email: email,
    };
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userData", JSON.stringify(userData));
    if (onSuccess) onSuccess();
    handleClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: "Password reset sent",
      description: "Check your inbox for the link.",
      variant: "success",
    });
    setAuthStep("signin");
  };

  const handleSocialLogin = (provider: string) => {
    const userData = {
      username: `${provider}-user`,
      email: `user@${provider}.com`,
    };
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userData", JSON.stringify(userData));
    if (onSuccess) onSuccess();
    handleClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            key={authStep}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black/40 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden backdrop-blur-xl shadow-2xl z-10"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 transition-colors z-10 group"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-[var(--brand-red)] transition-colors" />
            </button>

            {authStep !== "select" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setAuthStep("select")}
                className="absolute top-3 left-3 p-1.5 transition-colors z-10 group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-[var(--brand-red)] transition-colors" />
              </motion.button>
            )}

            <div className="p-6">
              {authStep === "select" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                  >
                    <h2 className="text-xl font-bold text-white mb-1.5">
                      Welcome back!
                    </h2>
                    <p className="text-xs text-gray-400">
                      Sign in to continue to MCP Box Platform
                    </p>
                  </motion.div>

                  <div className="space-y-3">
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAuthStep("signin")}
                      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200 group"
                    >
                      <Mail className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                      <span>Continue with Email</span>
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin("github")}
                      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200 group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="20"
                        height="20"
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
                      <span>Continue with Google</span>
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSocialLogin("google")}
                      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200"
                    >
                      <Github className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                      <span>Continue with GitHub</span>
                    </motion.button>
                  </div>
                </>
              ) : authStep === "signin" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Sign in with Email
                    </h2>
                    <p className="text-sm text-gray-400">
                      Enter your credentials to continue
                    </p>
                  </motion.div>

                  <form onSubmit={handleSignInSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-left text-sm font-medium text-white mb-2">
                        Email or Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email or username"
                          className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-left text-sm font-medium text-white mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-[var(--brand-red)] transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => setAuthStep("forgot")}
                          className="text-xs text-[var(--brand-red)] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-black text-sm font-semibold transition-all duration-200"
                    >
                      Sign In
                    </motion.button>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center text-sm text-gray-400"
                    >
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthStep("signup")}
                        className="text-[var(--brand-red)] hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </motion.p>
                  </form>
                </>
              ) : authStep === "signup" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Create Account
                    </h2>
                    <p className="text-sm text-gray-400">
                      Join MCP Box community today
                    </p>
                  </motion.div>

                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-left text-sm font-medium text-white mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Choose a username"
                          className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-left text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-left text-sm font-medium text-white mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full pl-12 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-[var(--brand-red)] transition-colors"
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
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-left text-sm font-medium text-white mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full pl-12 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-[var(--brand-red)] transition-colors"
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
                      transition={{ delay: 0.35 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-black text-sm font-semibold transition-all duration-200"
                    >
                      Create Account
                    </motion.button>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center text-sm text-gray-400"
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
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Reset Password
                    </h2>
                    <p className="text-sm text-gray-400">
                      Enter your email to receive a reset link
                    </p>
                  </motion.div>

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-left text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
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
                      transition={{ delay: 0.25 }}
                      className="text-center text-sm text-gray-400"
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

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{" "}
                  <a
                    href="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-red)] hover:underline transition-all"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-red)] hover:underline transition-all"
                  >
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    typeof window !== "undefined" ? document.body : (null as any),
  );
}
