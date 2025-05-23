import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { usePathname } from "next/navigation";
import ExploreDropdown from "@/components/ExploreDropdown";
import NotificationBell from "@/components/NotificationBell";

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
              className={`${isActive(
                "/student-dashboard"
              )} transition-colors whitespace-nowrap`}
            >
              Dashboard
            </Link>
            <Link
              href="/MyCourses"
              className={`${isActive(
                "/MyCourses"
              )} transition-colors whitespace-nowrap text-black`}
            >
              My Courses
            </Link>
            <Link
              href="/roadmap"
              className={`${isActive(
                "/roadmap"
              )} transition-colors whitespace-nowrap`}
            >
              Roadmap
            </Link>
            <Link
              href="/FindTutorPage"
              className={`${isActive(
                "/FindTutorPage"
              )} transition-colors whitespace-nowrap`}
            >
              Find Tutors
            </Link>

            <Link
              href="/Schedule"
              className={`${isActive(
                "/Schedule"
              )} transition-colors whitespace-nowrap`}
            >
              Schedule
            </Link>
            <Link
              href="/ratings-reviews"
              className={`${isActive(
                "/ratings-reviews"
              )} transition-colors whitespace-nowrap`}
            >
              Ratings/Reviews
            </Link>

            <Link
              href="/Profile"
              className={`${isActive(
                "/profile"
              )} transition-colors whitespace-nowrap`}
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <SearchBar
              placeholder="Search courses..."
              className="w-[280px] lg:w-[320px]"
              userRole="student"
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
          {/* 🔔 Notification Bell */}
          <NotificationBell />

          <Button
            variant="ghost"
            onClick={async () => {
              try {
                await fetch("http://localhost:5003/api/auth/logout", {
                  method: "POST",
                  credentials: "include",
                });

                // Option 1: reload everything to reset auth
                window.location.href = "/";

                // Option 2 (better if using useAuth context):
                // setIsLoggedIn(false);
                // router.push("/login");
              } catch (error) {
                console.error("Logout failed", error);
                alert("Failed to log out. Please try again.");
              }
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StudentNavBar;
