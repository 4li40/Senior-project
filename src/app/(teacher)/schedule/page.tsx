"use client";

import { useRouter } from "next/navigation";
import ScheduleTable from "@/components/scheduleTabel";

// Sample static data (replace with real API data later)
const coursesData = [
  {
    title: "Intro to AI",
    instructor: "David Brown",
    time: "3:00 PM",
    day: "Mon",
  },
  {
    title: "Machine Learning",
    instructor: "Emily White",
    time: "10:00 AM",
    day: "Tue",
  },
  {
    title: "What is an API?",
    instructor: "Frank Green",
    time: "2:30 PM",
    day: "Wed",
  },
  {
    title: "Advanced Data Structures",
    instructor: "Alice Johnson",
    time: "1:00 PM",
    day: "Thu",
  },
  {
    title: "Web Development Basics",
    instructor: "Bob Smith",
    time: "4:00 PM",
    day: "Fri",
  },
];

export default function SchedulePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/tutor-dashboard");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Weekly Schedule</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          ← Back
        </button>
      </div>
      <ScheduleTable courses={coursesData} />
    </div>
  );
}
