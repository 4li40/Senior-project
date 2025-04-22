"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import ExploreDropdown from "@/components/ExploreDropdown";
import { useEffect, useState } from "react";

const navItems = [
  { label: "About Us", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const MainNavBar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(document.cookie.includes("token"));
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10">
        {/* 🔹 Left: Logo */}
        <div className="w-[180px]">
          <Link href="/" className="text-xl font-bold text-black">
            Study Buddy
          </Link>
        </div>

        {/* 🔹 Center: Navigation & Optional Search */}
        <div className="flex-1 flex justify-center items-center gap-4 max-w-4xl">
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform ${
                    pathname === item.href
                      ? "bg-gray-200 text-black scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-200 hover:text-black hover:scale-105"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          {isLoggedIn && (
            <SearchBar
              placeholder="Search courses..."
              className="w-[250px] lg:w-[300px]"
              userRole="student"
              onChange={(val) => console.log("Searching:", val)}
            />
          )}

          <div className="hidden lg:block">
            <ExploreDropdown />
          </div>
        </div>

        {/* 🔹 Right: Auth Buttons */}
        <div className="w-[180px] flex items-center gap-3 justify-end">
          <Link href="/login">
            <Button
              variant="ghost"
              className="bg-white text-sm font-medium hover:bg-gray-200 hover:scale-105 transition-transform rounded-xl"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-white text-sm text-black hover:bg-gray-300 hover:scale-105 transition-transform rounded-xl">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainNavBar;
