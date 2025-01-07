import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <>
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Study Buddy
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About Us
          </Link>
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
        </nav>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-4">
          <Button variant="outline">Login</Button>
          <Button>Sign Up</Button>
        </div>
      </header>
    </>
  );
};

export default NavBar;
