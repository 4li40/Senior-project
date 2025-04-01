
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { usePathname } from "next/navigation";
import ExploreDropdown from "@/components/ExploreDropdown";

const StudentNavBar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path
      ? "text-black font-semibold"
      : "text-foreground/60 hover:text-foreground/80";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-8 mx-4 my-1">
        {/* Logo */}
        <Link href="/student/dashboard" className="flex items-center">
          <span className="text-xl font-bold">Study Buddy</span>
        </Link>

        {/* Navigation Links, Search Bar, and Explore - Centered */}
        <div className="flex flex-1 items-center justify-between mx-auto max-w-6xl px-6">
          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link
              href="/student-dashboard"
              className={`${isActive("/student-dashboard")} transition-colors whitespace-nowrap`}
            >
              Dashboard
            </Link>
            <Link
              href="/MyCourses"
              className={`${isActive("/MyCourses")} transition-colors whitespace-nowrap`}
            >
              My Courses
            </Link>
            <Link
              href="/roadmap"
              className={`${isActive("/roadmap")} transition-colors whitespace-nowrap`}
            >
              Roadmap
            </Link>
            <Link
              href="/FindTutorPage"
              className={`${isActive("/FindTutorPage")} transition-colors whitespace-nowrap`}
            >
              Find Tutors
            </Link>
            <Link
              href="/Schedule"
              className={`${isActive("/Schedule")} transition-colors whitespace-nowrap`}
            >
              Schedule
            </Link>
            <Link
              href="/ratings-reviews"
              className={`${isActive("/ratings-reviews")} transition-colors whitespace-nowrap`}
            >
              Ratings/Reviews
            </Link>
            <Link
              href="/profile"
              className={`${isActive("/profile")} transition-colors whitespace-nowrap`}
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <SearchBar
              placeholder="Search courses..."
              className="w-[280px] lg:w-[320px]"
              onChange={(value) => {
                console.log("Searching:", value);
              }}
            />

            {/* 🔹 Explore Dropdown for Students */}
            <ExploreDropdown />
          </div>
        </div>

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

export default StudentNavBar;
