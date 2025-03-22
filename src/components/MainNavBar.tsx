"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import ExploreDropdown from "@/components/ExploreDropdown"; // ✅ Import the reusable Explore dropdown

const MainNavBar = () => {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <div className="w-[180px]">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Study Buddy</span>
            </Link>
          </div>

          {/* Center Section with Nav, Search, and Explore */}
          <div className="flex flex-1 items-center justify-center gap-4 max-w-3xl">
            <nav className="hidden md:flex items-center gap-8 whitespace-nowrap">
              <Link
                href="/about"
                className="text-sm font-medium text-foreground/60 hover:text-foreground/80"
              >
                About Us
              </Link>
              <Link
                href="/features"
                className="text-sm font-medium text-foreground/60 hover:text-foreground/80"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-foreground/60 hover:text-foreground/80"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground/60 hover:text-foreground/80"
              >
                Contact
              </Link>
            </nav>

            {/* Search Bar */}
            <SearchBar
              placeholder="Search courses..."
              className="w-[280px] lg:w-[320px]"
              onChange={(value) => {
                console.log("Searching:", value);
              }}
            />

            {/* 🔹 Explore Dropdown Component */}
            <ExploreDropdown />
          </div>

          {/* Right Side Actions */}
          <div className="w-[180px] flex items-center gap-4 justify-end">
            <Button variant="ghost" className="text-sm font-medium">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainNavBar;
