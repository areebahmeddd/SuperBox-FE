"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { showToast } from "@/lib/toast-utils";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  HelpCircle,
  LogOut,
  Menu,
  Server,
  Settings,
  User as UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthModal from "./auth-modal";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("https://api.github.com/repos/areebahmeddd/superbox.ai")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.stargazers_count === "number")
          setStars(d.stargazers_count);
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      showToast.error("Sign out failed. Please try again");
    }
  };

  const menuItems = [
    { label: "My Servers", icon: Server, href: "/my-servers" },
    { label: "Profile", icon: UserIcon, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Help & Support", icon: HelpCircle, href: "/faq" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/80 dark:bg-background/60 border-border border-b shadow-lg backdrop-blur-md"
          : "bg-background/40 dark:bg-background/20 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <Link href="/" className="flex items-center">
            <span className="text-foreground text-xl font-semibold tracking-tight">
              superbox.ai
            </span>
          </Link>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden items-center gap-2 md:flex"
        >
          <motion.a
            href="https://github.com/areebahmeddd/superbox.ai"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-muted text-foreground inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="bg-muted inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#fbbf24"
                aria-hidden
              >
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192z" />
              </svg>
              {stars ?? 0}
            </motion.span>
          </motion.a>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-foreground hover:text-primary px-4 py-2 pl-2 text-sm transition-colors"
          >
            <Link href="/playground">Playground</Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-foreground hover:text-primary px-4 py-2 pl-2 text-sm transition-colors"
          >
            <Link href="/explore">Explore</Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-foreground hover:text-primary px-4 py-2 pl-2 text-sm transition-colors"
          >
            <a
              href="https://acm-aa28ebf6.mintlify.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
          </motion.div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="border-border h-9 w-9 cursor-pointer rounded-full border p-0 outline-none" />
                }
              >
                <div className="bg-muted text-foreground pointer-events-none flex h-full w-full items-center justify-center rounded-full text-sm font-bold">
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div>
                      <p className="text-sm font-medium">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-muted-foreground text-xs font-normal">
                        {user.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.label}>
                    <Link
                      href={item.href}
                      className="flex w-full items-center gap-1.5"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setAuthOpen(true)} size="sm">
              Get started
            </Button>
          )}
        </motion.nav>

        <div ref={mobileMenuRef} className="relative md:hidden">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            className="text-foreground hover:text-primary flex h-9 w-9 items-center justify-center transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </motion.button>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-card border-border absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
              >
                <div>
                  <a
                    href="https://github.com/areebahmeddd/superbox.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground hover:bg-muted flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="flex-shrink-0"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <span>GitHub</span>
                    <span className="text-muted-foreground ml-auto text-xs">
                      {stars ?? 0} ⭐
                    </span>
                  </a>

                  <Link
                    href="/playground"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground hover:bg-muted flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                  >
                    <span>Playground</span>
                  </Link>

                  <a
                    href="https://acm-aa28ebf6.mintlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground hover:bg-muted flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                  >
                    <span>Docs</span>
                  </a>

                  {user ? (
                    <>
                      {menuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-foreground hover:bg-muted flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="text-destructive hover:bg-muted flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthOpen(true);
                      }}
                      className="text-primary-foreground bg-primary hover:bg-primary/90 w-full px-4 py-2.5 text-sm font-semibold transition-all"
                    >
                      Get started
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </motion.header>
  );
}
