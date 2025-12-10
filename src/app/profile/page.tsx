"use client";

import Header from "@/components/header";
import { useToast } from "@/components/toast-provider";
import { Edit2, Loader2, Lock, LogOut, Mail, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  localId: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  emailVerified: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("idToken");
      if (!token) {
        router.push("/");
        return;
      }

      const firebaseApiKey =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKey";
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: token }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();
      if (data.users && data.users.length > 0) {
        const user = data.users[0];
        setProfile({
          localId: user.localId,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoUrl,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        });
        setDisplayName(user.displayName || "");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to load profile",
        variant: "error",
      });
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = localStorage.getItem("idToken");
      const updateData: any = {
        idToken: token,
        returnSecureToken: true,
      };

      if (displayName && displayName !== profile?.displayName) {
        updateData.displayName = displayName;
      }
      if (newPassword) {
        updateData.password = newPassword;
      }

      const firebaseApiKey =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKey";
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      if (profile) {
        setProfile({
          ...profile,
          displayName: data.displayName || displayName,
        });
      }
      setIsEditing(false);
      setNewPassword("");

      if (data.idToken) {
        localStorage.setItem("idToken", data.idToken);
      }

      addToast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to update profile",
        variant: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("idToken");
      const firebaseApiKey =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKey";
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${firebaseApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: token }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userData");

      addToast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully",
        variant: "success",
      });

      router.push("/");
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to delete account",
        variant: "error",
      });
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
    router.push("/");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff5252]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-20 px-4 relative overflow-hidden">
        {/* Red Misty Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff5252]/20 rounded-full blur-[120px]" />

        <div className="max-w-2xl mx-auto relative z-10 py-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff5252] to-[#ffbaba] bg-clip-text text-transparent mb-8">
            My Profile
          </h1>

          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 backdrop-blur-sm p-6 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff5252]/20 to-[#ffbaba]/20 flex items-center justify-center border border-[#ff5252]/30">
                <User className="w-10 h-10 text-[#ff5252]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white">
                  {profile?.displayName || "User"}
                </h2>
                <p className="text-gray-400">{profile?.email}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg hover:bg-[#ff5252]/20 transition-colors"
                >
                  <Edit2 className="w-5 h-5 text-[#ff5252]" />
                </button>
              )}
            </div>

            {!isEditing ? (
              <>
                {/* Profile Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-[#ff5252]" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <User className="w-5 h-5 text-[#ff5252]" />
                    <span>{profile?.displayName || "No display name set"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        profile?.emailVerified
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {profile?.emailVerified ? "Verified" : "Not Verified"}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-white/5 text-white pl-10 pr-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#ff5252]/50"
                      placeholder="Enter display name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    New Password (optional)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 text-white pl-10 pr-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#ff5252]/50"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#ff5252] to-[#ff5252]/80 hover:from-[#ffbaba] hover:to-[#ff5252] disabled:opacity-50 transition-all"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setDisplayName(profile?.displayName || "");
                      setNewPassword("");
                    }}
                    className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-red-500/30 p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-2">
                Delete Account?
              </h3>
              <p className="text-gray-400 mb-6">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
