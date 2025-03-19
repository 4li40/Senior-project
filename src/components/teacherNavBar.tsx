import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { SearchBar } from "@/components/SeachBar";
import { usePathname } from "next/navigation";
import ExploreDropdown from "@/components/ExploreDropdown"; // ✅ Import reusable Explore dropdown

const TeacherNavBar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-8 mx-4 my-1">
        {/* Logo */}
        <div className="w-[180px]">
          <Link href="/teacher/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Study Buddy</span>
          </Link>
        </div>

        {/* Navigation Links, Search Bar, and Explore - Centered */}
        <div className="flex flex-1 items-center justify-center gap-16 max-w-3xl mx-auto">
          <nav className="flex items-center gap-12 text-sm font-medium">
            <Link
              href="/tutor-dashboard"
              className={`transition-colors hover:text-foreground/80 whitespace-nowrap ${
                pathname === "/tutor-dashboard"
                  ? "text-foreground font-semibold"
                  : "text-foreground/60"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/mycourses"
              className={`transition-colors hover:text-foreground/80 whitespace-nowrap ${
                pathname === "/mycourses"
                  ? "text-foreground font-semibold"
                  : "text-foreground/60"
              }`}
            >
              Courses
            </Link>
            <Link
              href="/schedule"
              className={`transition-colors hover:text-foreground/80 whitespace-nowrap ${
                pathname === "/schedule"
                  ? "text-foreground font-semibold"
                  : "text-foreground/60"
              }`}
            >
              Schedule
            </Link>
            <Link
              href="/earnings"
              className={`transition-colors hover:text-foreground/80 whitespace-nowrap ${
                pathname === "/earnings"
                  ? "text-foreground font-semibold"
                  : "text-foreground/60"
              }`}
            >
              Earnings
            </Link>
            <Link
              href="/ratings"
              className={`transition-colors hover:text-foreground/80 whitespace-nowrap ${
                pathname === "/teacher/messages"
                  ? "text-foreground font-semibold"
                  : "text-foreground/60"
              }`}
            >
              Reviews
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

          {/* 🔹 Explore Dropdown for Teachers */}
          <ExploreDropdown />
        </div>

        {/* Right Side Actions */}
        <div className="w-[180px] flex items-center space-x-4 justify-end">
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

export default TeacherNavBar;
