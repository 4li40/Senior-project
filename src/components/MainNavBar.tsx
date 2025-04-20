"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import ExploreDropdown from "@/components/ExploreDropdown";
import { useEffect, useState } from "react";
import { Info, Rocket, DollarSign, Mail } from "lucide-react";

const navItems = [
  { label: "About Us", href: "/about", icon: <Info size={16} /> },
  { label: "Features", href: "/features", icon: <Rocket size={16} /> },
  { label: "Pricing", href: "/pricing", icon: <DollarSign size={16} /> },
  { label: "Contact", href: "/contact", icon: <Mail size={16} /> },
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
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-black font-semibold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {item.icon}
                {item.label}
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
            <Button variant="ghost" className="text-sm font-medium">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-black text-white hover:bg-gray-800 text-sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainNavBar;
