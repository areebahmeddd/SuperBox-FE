"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { showToast } from "@/lib/toast-utils";
import type { User } from "firebase/auth";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { Edit2, Github, Loader2, Mail } from "lucide-react";
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
      <div className="min-h-screen bg-black">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-400 text-sm">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white/[0.02] rounded-2xl border border-white/10 p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Profile"}
                      className="w-20 h-20 rounded-full border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-white text-3xl font-bold">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {user.displayName || "User"}
                    </h2>
                    <p className="text-gray-400/70 text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Sign-in Method Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  {user.providerData[0]?.providerId === "google.com" ? (
                    <Image
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  ) : user.providerData[0]?.providerId === "github.com" ? (
                    <Github className="w-4 h-4 text-white" />
                  ) : (
                    <Mail className="w-4 h-4 text-white" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {user.providerData[0]?.providerId === "google.com"
                      ? "Google"
                      : user.providerData[0]?.providerId === "github.com"
                        ? "GitHub"
                        : "Email"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white/[0.02] rounded-2xl border border-white/10 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Account Information
                </h3>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="ghost">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <Label className={isEditing ? "" : "text-gray-400/70"}>
                    Full Name
                  </Label>
                  {!isEditing ? (
                    <div className="mt-2 bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 h-[42px] flex items-center">
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
                  <Label className={isEditing ? "" : "text-gray-400/70"}>
                    Email Address
                  </Label>
                  {!isEditing ? (
                    <div className="mt-2 bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 h-[42px] flex items-center">
                      {user.email}
                    </div>
                  ) : (
                    <Input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="mt-2 opacity-50 cursor-not-allowed"
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 justify-end">
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
                        <Loader2 className="w-4 h-4 animate-spin" />
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
