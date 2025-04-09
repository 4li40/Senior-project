"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
  category: string;
}

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search for anything",
  onChange,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5003/api/courses", {
          credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses([]);
      setShowDropdown(false);
      return;
    }

    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, courses]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onChange?.(value);
  };

  const handleCourseSelect = (course: Course) => {
    setSearchTerm("");
    setShowDropdown(false);
    router.push(`/mycourses/${course.id}`);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        onFocus={() => searchTerm && setShowDropdown(true)}
        className={`
          pl-11 
          h-12 
          rounded-full 
          border-2 
          border-input
          bg-background 
          hover:border-muted-foreground/20
          focus:border-primary
          focus:ring-1
          focus:ring-primary/20
          transition-colors
          text-base
          ${className}
        `}
      />
      
      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredCourses.length > 0 ? (
            <ul className="py-2">
              {filteredCourses.map((course) => (
                <li
                  key={course.id}
                  onClick={() => handleCourseSelect(course)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>{course.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No courses found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;