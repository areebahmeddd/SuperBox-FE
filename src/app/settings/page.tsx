"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { useTheme } from "@/lib/theme-provider";
import { showToast } from "@/lib/toast-utils";
import type { User } from "firebase/auth";
import {
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      showToast.error("Password should be at least 6 characters");
      return;
    }

    setIsUpdating(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      showToast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      document.getElementById("password-form")?.classList.add("hidden");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        showToast.error("Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        showToast.error("Password should be at least 6 characters");
      } else {
        showToast.error("Failed to update password");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !deletePassword) {
      showToast.error("Please enter your password");
      return;
    }

    setIsDeleting(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        deletePassword,
      );
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);

      showToast.success("Account deleted successfully");
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        showToast.error("Incorrect password");
      } else {
        showToast.error("Failed to delete account");
      }
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-foreground" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground text-sm">
              Configure your application preferences
            </p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">
                General Settings
              </h3>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    theme === "dark" ? "bg-primary" : "bg-muted"
                  }`}
                  aria-label="Toggle theme"
                >
                  <div
                    className={`w-5 h-5 bg-primary-foreground dark:bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${
                      theme === "dark" ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Security Settings
              </h3>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-foreground">
                      Change Password
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      const form = document.getElementById("password-form");
                      form?.classList.toggle("hidden");
                    }}
                  >
                    Change Password
                  </Button>
                </div>

                <form
                  id="password-form"
                  onSubmit={handleChangePassword}
                  className="hidden space-y-4 mt-4 pt-4 border-t border-border"
                >
                  <div>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        document
                          .getElementById("password-form")
                          ?.classList.add("hidden");
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="py-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Two-Factor Authentication (2FA)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                      Disabled
                    </span>
                    <Button
                      disabled
                      variant="secondary"
                      className="opacity-50 cursor-not-allowed"
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </div>

              <div className="py-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Delete Account
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-card border-destructive/30">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1">
            This action cannot be undone. All your data will be permanently
            deleted.
          </DialogDescription>
          <div className="space-y-4">
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                variant="destructive"
                className="flex-1"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeletePassword("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
