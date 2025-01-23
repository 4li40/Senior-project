import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { SearchBar } from "@/components/SeachBar";

const StudentNavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-8 mx-4">
        {/* Logo */}
        <Link href="/student/dashboard" className="flex items-center">
          <span className="text-xl font-bold">Study Buddy</span>
        </Link>

        {/* Navigation Links and Search Bar - Centered */}
        <div className="flex flex-1 items-center justify-center mx-auto max-w-6xl px-6">
          <nav className="flex items-center gap-8 text-sm font-medium mr-16">
            <Link
              href="/student-dashboard"
              className="text-foreground/60 transition-colors hover:text-foreground/80 whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/MyCourses"
              className="text-foreground/60 transition-colors hover:text-foreground/80 whitespace-nowrap"
            >
              My Courses
            </Link>
            <Link
              href="/roadmap"
              className="text-foreground/60 transition-colors hover:text-foreground/80 whitespace-nowrap"
            >
              Roadmap
            </Link>
            <Link
              href="/FindTutorPage"
              className="text-foreground/60 transition-colors hover:text-foreground/80 whitespace-nowrap"
            >
              Find Tutors
            </Link>
            <Link
              href="/Schedule"
              className="text-foreground/60 transition-colors hover:text-foreground/80 whitespace-nowrap"
            >
              Schedule
            </Link>
            <Link
              href="/ratings-reviews"
              className="text-foreground/60 transition-colors hover:text-foreground/80 whitespace-nowrap"
            >
              Ratings/Reviews
            </Link>
          </nav>
          <SearchBar 
            placeholder="Search courses..." 
            className="w-[280px] lg:w-[320px]"
            onChange={(value) => {
              console.log('Searching:', value);
            }}
          />
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
