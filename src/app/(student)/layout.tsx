"use client";

import StudentNavBar from "@/components/StudentNavBar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <StudentNavBar />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
