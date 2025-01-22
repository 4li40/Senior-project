import { Button } from "@/components/ui/button";
import Link from "next/link";

const MainNavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">Study Buddy</span>
        </Link>

        {/* Navigation Links - Centered */}
        <nav className="flex items-center mx-auto space-x-6 text-sm font-medium">
  <Link
    href="/about"
    className="text-foreground/60 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:text-foreground/80 hover:ring-2 hover:ring-gray-300 rounded"
  >
    About Us
  </Link>
  <Link
    href="/features"
    className="text-foreground/60 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:text-foreground/80 hover:ring-2 hover:ring-gray-300 rounded"
  >
    Features
  </Link>
  <Link
    href="/pricing"
    className="text-foreground/60 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:text-foreground/80 hover:ring-2 hover:ring-gray-300 rounded"
  >
    Pricing
  </Link>
  <Link
    href="/contact"
    className="text-foreground/60 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:text-foreground/80 hover:ring-2 hover:ring-gray-300 rounded"
  >
    Contact
  </Link>
</nav>


        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="bg-gray-100/20 text-foreground/60 hover:bg-gray-100/40 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:ring-2 hover:ring-gray-300"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-800 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:ring-2 hover:ring-gray-300"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MainNavBar;
