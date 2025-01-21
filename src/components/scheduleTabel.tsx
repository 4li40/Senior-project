'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Define the type for schedule data
interface ScheduleItem {
  title: string;
  instructor: string;
  time: string;
  day: string; // Day of the week (e.g., "Mon", "Tue")
}

// Props for the ScheduleTable component
interface ScheduleTableProps {
  courses: ScheduleItem[];
}

export default function ScheduleTable({ courses }: ScheduleTableProps) {
  // Group courses by day
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const groupedCourses = days.map((day) => ({
    day,
    courses: courses.filter((course) => course.day === day),
  }));

  return (
    <Card className="bg-background shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3 text-sm font-medium text-muted-foreground">Day</th>
                <th className="p-3 text-sm font-medium text-muted-foreground">Courses</th>
              </tr>
            </thead>
            <tbody>
              {groupedCourses.map(({ day, courses }) => (
                <tr key={day} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">{day}</td>
                  <td className="p-3">
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <div
                          key={index}
                          className="mb-3 p-4 rounded-lg bg-muted/20" // Colored background
                        >
                          <div className="font-medium text-foreground">{course.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span>Time: {course.time}</span>
                            <span className="mx-2">|</span>
                            <span>Instructor: {course.instructor}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No courses scheduled</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}