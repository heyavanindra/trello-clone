"use client"
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-neutral-200/60 bg-neutral-50/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2 font-semibold text-neutral-800">
          <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-neutral-50" />
          </div>
          Mini-Trello
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
          <Link
            href="#features"
            className="hover:text-neutral-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="hover:text-neutral-900 transition-colors"
          >
            Pricing
          </Link>
          <a href="#about" className="hover:text-neutral-900 transition-colors">
            About
          </a>
        </div>
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                href={"/auth/login"}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 transition-colors"
              >
                Log in
              </Link>
              <Link
                href={"/auth/signup"}
                className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 hover:translate-y-px transition-all active:shadow-none"
              >
                Get Started
              </Link>
            </>
          )}
          {user && logout && (
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-neutral-600">Welcome{user.name}</p>
              <button
                onClick={() => {
                  logout();
                }}
                className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 hover:translate-y-px transition-all active:shadow-none"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
