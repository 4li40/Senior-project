"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";
import ChatPopup from "@/components/chatpopup";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Types
type Course = {
  id: number;
  title: string;
  description: string;
  price: string;
};

type Session = {
  title: string;
  type: "session" | "announcement";
  scheduled_at: string;
  duration_minutes?: number;
};

type Tutor = {
  userId: number;
  first_name: string;
  last_name: string;
  education: string;
  subjects: string[];
};
type Activity = {
  type: string;
  message: string;
  created_at: string;
};

export default function StudentDashboard() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [tutors, setTutors] = useState<Tutor[]>([]);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/tutors", {
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setTutors(data);
        }
      } catch (error) {
        console.error("❌ Failed to load tutors:", error);
      }
    };

    fetchTutors();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "http://localhost:5003/api/enrollments/my-courses",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("❌ Failed to load courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5003/api/enrollments/my-schedule",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setSessions(data.slice(0, 5)); // only show top 5 upcoming
        }
      } catch (err) {
        console.error("❌ Failed to load schedule:", err);
      }
    };

    fetchCourses();
    fetchSessions();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <StudentNavBar />

      <main className="flex-grow px-4 md:px-8 lg:px-12 space-y-8 mt-8">
        <h2 className="text-center text-2xl font-bold text-blue-700 mb-6">
          Welcome to Your Dashboard
        </h2>

        {/* Top 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-purple-700">
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingCourses ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 border-b pb-3"
                  >
                    <div className="p-2 bg-purple-100 rounded-full">
                      <GraduationCap className="w-6 h-6 text-purple-700" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ${course.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  You are not enrolled in any courses.
                </p>
              )}
              <Button
                className="w-full mt-4"
                onClick={() => router.push("/MyCourses")}
              >
                View All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-blue-600">
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-center text-gray-500">
                  No upcoming sessions yet.
                </p>
              ) : (
                sessions.map((s, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-gray-600 capitalize">{s.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => router.push("/Schedule")}
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Calendar Mini View */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-blue-600">
                Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div style={{ height: 300 }}>
                <Calendar
                  localizer={localizer}
                  events={sessions.map((s) => ({
                    title: `${s.title} (${s.type})`,
                    start: new Date(s.scheduled_at),
                    end: new Date(
                      new Date(s.scheduled_at).getTime() +
                        (s.duration_minutes || 60) * 60000
                    ),
                    allDay: false,
                  }))}
                  startAccessor="start"
                  endAccessor="end"
                  views={["month"]}
                  toolbar={false}
                  popup
                  style={{ height: "100%" }}
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/Schedule")}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-gray-400">
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              Coming Soon...
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-blue-600">
                Find Tutors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tutors.length === 0 ? (
                <p className="text-center text-gray-500">
                  No tutors available.
                </p>
              ) : (
                tutors.slice(0, 3).map((tutor, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-semibold">
                      {tutor.first_name} {tutor.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{tutor.education}</p>
                    <p className="text-sm text-gray-500">
                      Subjects:{" "}
                      {Array.isArray(tutor.subjects)
                        ? tutor.subjects.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                ))
              )}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => router.push("/FindTutorPage")}
              >
                View All Tutors
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
        >
          💬
        </button>
        {chatOpen && <ChatPopup />}
      </div>
    </div>
  );
}
