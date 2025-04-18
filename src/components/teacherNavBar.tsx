import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import ExploreDropdown from "@/components/ExploreDropdown"; // ✅ Import reusable Explore dropdown
import NotificationBell from "@/components/NotificationBell"; // Add NotificationBell import

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
        </div>

        {/* Right Side Actions */}
        <div className="w-[180px] flex items-center space-x-4 justify-end">
          {/* Replace simple Bell icon with NotificationBell component */}
          <NotificationBell />
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                await fetch("http://localhost:5003/api/auth/logout", {
                  method: "POST",
                  credentials: "include",
                });

                // Redirect to login after logout
                window.location.href = "/";
              } catch (error) {
                console.error("Logout failed", error);
                alert("Logout failed. Please try again.");
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

export default TeacherNavBar;
