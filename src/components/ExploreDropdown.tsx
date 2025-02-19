"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
  { name: "All Courses", slug: "all" },
  { name: "Web Development", slug: "web-development" },
  { name: "Data Science", slug: "data-science" },
  { name: "AI & Machine Learning", slug: "ai-ml" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Mobile Development", slug: "mobile-development" },
  { name: "Software Engineering", slug: "software-engineering" },
];

export default function ExploreDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="text-sm font-medium hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        Explore
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-2 border z-50">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/Explore/${category.slug}`}
              className="block px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
