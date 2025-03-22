"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
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
    </div>
  );
}

export default SearchBar;