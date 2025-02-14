'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BarChartComponent } from "@/components/ui/bar-chart";
import { UserCircle2, CheckCircle2, Clock } from "lucide-react";
import TeacherNavBar from '@/components/teacherNavBar';
import { useRouter } from 'next/navigation'; 
import ScheduleTable from '@/components/scheduleTabel';

// Dummy bar chart data
const data = [
  { name: "Mon", total: 700 },
  { name: "Tue", total: 1500 },
  { name: "Wed", total: 1700 },
  { name: "Thu", total: 1000 },
  { name: "Fri", total: 500 }
];

// ⭐ Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-primary' : 'text-muted'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// 🗓️ Schedule Item Interface
interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  created_at: string;
  first_name: string;
  last_name: string;
}

export default function Dashboard() {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // 🔍 Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5003/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');

        const data = await response.json();
        console.log('📡 Courses fetched:', data);
        setCoursesData(data);
      } catch (err) {
        console.error('❌ Error fetching courses:', err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 🆕 Add New Course (Client-side only)
  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now(),
      title: courseTitle,
      description: courseDescription,
      price: "0.00",
      created_at: new Date().toISOString(),
      first_name: "Tutor",
      last_name: "Name",
    };
    setCoursesData((prev) => [...prev, newCourse]);
    setCourseTitle('');
    setCourseDescription('');
  };

  const handleMyCoursesClick = () => router.push('/teacher/mycourses');

  return (
    <>
      <TeacherNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Display Loading/Error Messages */}
        {loading && <p className="text-gray-500">Loading courses...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display Courses if Available */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{course.description}</p>
                <div className="flex items-center gap-2">
                  <UserCircle2 className="text-primary" />
                  <span>{course.first_name} {course.last_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  💲 Price: ${parseFloat(course.price).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  📅 Created: {new Date(course.created_at).toLocaleDateString()}
                </div>
                <Button variant="outline" className="w-full">
                  Edit Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Course</CardTitle>
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
                <Button className="w-full" type="submit">
                  Upload Course
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 📅 Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleTable courses={coursesData.map(course => ({
                title: course.title,
                instructor: `${course.first_name} ${course.last_name}`,
                time: 'TBD',
                day: 'TBD'
              }))} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
