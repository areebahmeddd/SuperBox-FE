"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { showToast } from "@/lib/toast-utils";
import type { User } from "firebase/auth";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { Edit2, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
        return;
      }
      setUser(currentUser);
      setDisplayName(currentUser.displayName || "");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);

    try {
      if (displayName && displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        showToast.success("Profile updated successfully");
      }

      setIsEditing(false);
    } catch (error: any) {
      showToast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="text-foreground h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="px-4 pt-32 pb-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 text-center"
          >
            <h1 className="text-foreground mb-2 text-4xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card border-border rounded-2xl border p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Profile"}
                      className="border-border h-20 w-20 rounded-full border-2"
                    />
                  ) : (
                    <div className="bg-muted border-border text-foreground flex h-20 w-20 items-center justify-center rounded-full border-2 text-3xl font-bold">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-foreground text-2xl font-bold">
                      {user.displayName || "User"}
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="bg-muted border-border flex items-center gap-2 rounded-full border px-4 py-2">
                  {user.providerData[0]?.providerId === "google.com" ? (
                    <Image
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  ) : user.providerData[0]?.providerId === "github.com" ? (
                    <GithubIcon className="text-foreground h-4 w-4" />
                  ) : (
                    <Mail className="text-foreground h-4 w-4" />
                  )}
                  <span className="text-foreground text-sm font-medium">
                    {user.providerData[0]?.providerId === "google.com"
                      ? "Google"
                      : user.providerData[0]?.providerId === "github.com"
                        ? "GitHub"
                        : "Email"}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-card border-border rounded-2xl border p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-foreground text-xl font-semibold">
                  Account Information
                </h3>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="ghost">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <Label className={isEditing ? "" : "text-muted-foreground"}>
                    Full Name
                  </Label>
                  {!isEditing ? (
                    <div className="bg-muted text-foreground border-border mt-2 flex h-[42px] items-center rounded-xl border px-4 py-3">
                      {user.displayName || "Not set"}
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <Label className={isEditing ? "" : "text-muted-foreground"}>
                    Email Address
                  </Label>
                  {!isEditing ? (
                    <div className="bg-muted text-foreground border-border mt-2 flex h-[42px] items-center rounded-xl border px-4 py-3">
                      {user.email}
                    </div>
                  ) : (
                    <Input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="mt-2 cursor-not-allowed opacity-50"
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(user.displayName || "");
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
