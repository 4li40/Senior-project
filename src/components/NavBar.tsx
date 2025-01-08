import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold">Study Buddy</span>
        </Link>

        {/* Navigation Links - Centered */}
        <nav className="flex items-center mx-auto space-x-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/courses"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Courses
          </Link>
          <Link
            href="/schedule"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Schedule
          </Link>
          <Link
            href="/messages"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Messages
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost">
            <Link href="/login">Logout</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
