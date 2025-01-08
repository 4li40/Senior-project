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
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            About Us
          </Link>
          <Link
            href="/features"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MainNavBar;
