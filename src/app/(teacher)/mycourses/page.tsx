'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherNavBar from '@/components/teacherNavBar';
import ScheduleTable from '@/components/scheduleTabel'; // Import the ScheduleTable component

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-primary' : 'text-muted'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Sample data for courses
const coursesData = [
  {
    title: "Intro to AI",
    instructor: "David Brown",
    time: "3:00 PM",
    day: "Mon", // Add the `day` property
  },
  {
    title: "Machine Learning",
    instructor: "Emily White",
    time: "10:00 AM",
    day: "Tue", // Add the `day` property
  },
  {
    title: "What is an API?",
    instructor: "Frank Green",
    time: "2:30 PM",
    day: "Wed", // Add the `day` property
  },
];

export default function MyCoursesPage() {
  return (
    <>
      <TeacherNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Course Card */}
          <Card>
            <CardHeader>
              <CardTitle>Intro to AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">Course Description...</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <StarRating rating={4} />
                  <span className="text-muted-foreground">4.0</span>
                </div>
                <Button variant="outline">Edit Course</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Machine Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">Course Description...</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <StarRating rating={5} />
                  <span className="text-muted-foreground">5.0</span>
                </div>
                <Button variant="outline">Edit Course</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What is an API?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">Course Description...</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <StarRating rating={3} />
                  <span className="text-muted-foreground">3.0</span>
                </div>
                <Button variant="outline">Edit Course</Button>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Additional Section (if needed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Total Enrollments: 120</p>
              <p className="text-sm text-muted-foreground">Average Rating: 4.5</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">New review received for Intro to AI</p>
              <p className="text-sm text-muted-foreground">5 new enrollments in Machine Learning</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}