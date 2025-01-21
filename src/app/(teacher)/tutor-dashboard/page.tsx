'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BarChartComponent } from "@/components/ui/bar-chart";
import { UserCircle2, CheckCircle2, Clock } from "lucide-react";
import TeacherNavBar from '@/components/teacherNavBar';
import { useRouter } from 'next/navigation'; // for navigation
import ScheduleTable from '@/components/scheduleTabel';

const data = [
  {
    name: "Mon",
    total: 700,
  },
  {
    name: "Tue",
    total: 1500,
  },
  {
    name: "Wed",
    total: 1700,
  },
  {
    name: "Thu",
    total: 1000,
  },
  {
    name: "Fri",
    total: 500,
  },
];

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

interface ScheduleItem {
  title: string;
  instructor: string;
  time: string;
  day: string; // Day of the week (e.g., "Mon", "Tue")
}

export default function Dashboard() {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const router = useRouter(); // Initialize the router

  // State to manage courses
  const [coursesData, setCoursesData] = useState<ScheduleItem[]>([
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
  ]);

  // Function to add a new course
  const addCourse = () => {
    const newCourse: ScheduleItem = {
      title: courseTitle,
      instructor: "Tutor Name", // Replace with dynamic instructor name if needed
      time: "12:00 PM", // Replace with dynamic time if needed
      day: "Thu", // Replace with dynamic day if needed
    };
    setCoursesData([...coursesData, newCourse]); // Update the state
    setCourseTitle(''); // Clear the input field
    setCourseDescription(''); // Clear the input field
  };

  const handleMyCoursesClick = () => {
    router.push('/teacher/mycourses'); // Navigate to the My Courses page
  };

  return (
    <>
      <TeacherNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Earnings Section */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold">$2,450</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Statistics</h3>
                <p className="font-medium mb-2">Weekly revenue</p>
                <BarChartComponent data={data} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New student enrolled</p>
                  <p className="text-sm text-muted-foreground">John Doe joined your Advanced data course</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New review received</p>
                  <p className="text-sm text-muted-foreground">5-star review for Physics 101</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Upcoming session</p>
                  <p className="text-sm text-muted-foreground">AI tutoring in 2 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Courses Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  addCourse();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Course Thumbnail</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-muted">
                    <div className="space-y-1 text-center">
                      <div className="mx-auto h-12 w-12 text-muted-foreground">
                        <svg stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex text-sm text-muted-foreground">
                        <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full" type="submit">
                  Upload Course
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Courses Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">Intro to AI</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={0} />
                  <span className="text-muted-foreground">0</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">Machine Learning</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={0} />
                  <span className="text-muted-foreground">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScheduleTable courses={coursesData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}