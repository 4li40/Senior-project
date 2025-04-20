"use client";

import TeacherNavBar from "@/components/teacherNavBar";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <TeacherNavBar />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
