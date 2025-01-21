'use client';

import TeacherNavBar from '@/components/teacherNavBar';
import ScheduleTable from '@/components/scheduleTabel'; 

// Fetch data (you can replace this with an API call or database query)
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
  return (
    <>
      {/* Add the TeacherNavBar /}
      <TeacherNavBar />

      {/ Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Weekly Schedule</h1>
        <ScheduleTable courses={coursesData} />
      </div>
    </>
  );
}