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
import { CheckCircle, Calendar as CalendarIcon, Megaphone } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Types
type Course = {
  id: number;
  title: string;
  description: string;
  price: string;
  progress?: number; // percent complete
};

type Session = {
  title: string;
  type: "session" | "announcement";
  scheduled_at: string;
  duration_minutes?: number;
};

type ActivityType = "enroll" | "session" | "announcement";
interface Activity {
  type: ActivityType;
  message: string;
  created_at: string;
  parsedDate: Date;
  link?: string; // Optional link to navigate to
}

// Simple Toast
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-20 right-8 bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in z-[9999]">
      {message}
    </div>
  );
}

export default function StudentDashboard() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<ActivityType | "all">(
    "all"
  );

  // Helper for toast
  const triggerToast = (message: string) => {
    // setShowToast({ message });
  };

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/tutors", {
          credentials: "include",
        });
        const data = await res.json();
        // if (Array.isArray(data)) {
        //   setTutors(data);
        // }
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
        // Ensure courses is always an array
        setCourses(Array.isArray(data) ? data : data.courses ?? []);
      } catch (err) {
        console.error("❌ Failed to load courses:", err);
        setCourses([]);
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

  // --- Notes State ---
  const [notes, setNotes] = useState<string>("");
  useEffect(() => {
    const saved = localStorage.getItem("student_dashboard_notes");
    if (saved) setNotes(saved);
  }, []);
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    localStorage.setItem("student_dashboard_notes", e.target.value);
  };

  // --- Activity Types & Icons ---
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "enroll":
        return <CheckCircle className="text-purple-500 w-5 h-5" />;
      case "session":
        return <CalendarIcon className="text-blue-500 w-5 h-5" />;
      case "announcement":
        return <Megaphone className="text-green-500 w-5 h-5" />;
      default:
        return null;
    }
  };

  // --- Activity Filter ---
  const activityTypes: { label: string; value: ActivityType | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Enrollments", value: "enroll" },
    { label: "Sessions", value: "session" },
    { label: "Announcements", value: "announcement" },
  ];

  useEffect(() => {
    async function fetchActivities() {
      setLoadingActivities(true);
      setActivityError(null);
      try {
        // Fetch all in parallel
        const [coursesRes, sessionsRes, notificationsRes] = await Promise.all([
          fetch("http://localhost:5003/api/enrollments/my-courses", {
            credentials: "include",
          }),
          fetch("http://localhost:5003/api/courses/student/schedule", {
            credentials: "include",
          }),
          fetch("http://localhost:5003/api/notifications", {
            credentials: "include",
          }),
        ]);
        const [courses, sessions, notifications] = await Promise.all([
          coursesRes.ok ? coursesRes.json() : [],
          sessionsRes.ok ? sessionsRes.json() : [],
          notificationsRes.ok ? notificationsRes.json() : [],
        ]);

        // Helper to robustly get a valid date string
        const getValidDate = (
          fields: (string | undefined)[],
          fallback: string
        ) => {
          for (const f of fields) {
            if (f && !isNaN(new Date(f).getTime())) return f;
          }
          return fallback;
        };

        const nowIso = new Date().toISOString();
        // Enrollments
        const courseActs: Activity[] = (
          Array.isArray(courses) ? courses : []
        ).map((c: any) => {
          const dateStr = getValidDate(
            [c.enrolled_at, c.created_at, c.updated_at, c.date],
            nowIso
          );
          return {
            type: "enroll",
            message: `Enrolled in ${c.title}`,
            created_at: dateStr,
            parsedDate: new Date(dateStr),
            link: c.id ? `/MyCourses/${c.id}` : undefined,
          };
        });
        // Sessions
        const sessionActs: Activity[] = (
          Array.isArray(sessions) ? sessions : []
        ).map((s: any) => {
          const dateStr = getValidDate([s.scheduled_at, s.date], nowIso);
          return {
            type: "session",
            message: `Session: ${s.title || s.course || "(No Title)"}`,
            created_at: dateStr,
            parsedDate: new Date(dateStr),
            link: s.course_id ? `/MyCourses/${s.course_id}` : undefined,
          };
        });
        // Announcements/Notifications
        const notifActs: Activity[] = (
          Array.isArray(notifications) ? notifications : []
        ).map((n: any) => {
          const dateStr = getValidDate([n.createdAt, n.created_at], nowIso);
          return {
            type: "announcement",
            message: n.message || n.title || "New notification",
            created_at: dateStr,
            parsedDate: new Date(dateStr),
            link: n.link || undefined,
          };
        });
        // Merge and sort
        const allActs = [...courseActs, ...sessionActs, ...notifActs]
          .filter((a) => a.parsedDate && !isNaN(a.parsedDate.getTime()))
          .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());
        setActivities(allActs);
      } catch (err) {
        setActivities([]);
        setActivityError(
          "Failed to load recent activity. Please try again later."
        );
      } finally {
        setLoadingActivities(false);
      }
    }
    fetchActivities();
  }, []);

  // --- Filtered Activities ---
  const filteredActivities =
    activityFilter === "all"
      ? activities
      : activities.filter((a) => a.type === activityFilter);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <StudentNavBar />

      <main className="flex-grow px-4 md:px-8 lg:px-16 space-y-12 mt-10">
        <h2 className="text-center text-3xl font-extrabold text-blue-800 mb-8 tracking-tight drop-shadow-sm">
          Welcome to Your Dashboard
        </h2>
        <div className="border-b border-gray-200 mb-6"></div>

        {/* Top 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <Card className="w-full shadow-xl rounded-2xl transition-transform hover:scale-[1.02] bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-purple-700 text-xl font-bold">
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingCourses ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-5 bg-purple-100 rounded w-2/3 mx-auto" />
                  <div className="h-3 bg-purple-50 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-purple-50 rounded w-1/3 mx-auto" />
                </div>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 border-b pb-3 hover:bg-purple-50/70 rounded-lg transition-all cursor-pointer active:scale-95"
                    onClick={() => router.push(`/MyCourses/${course.id}`)}
                  >
                    <div className="p-2 bg-purple-100 rounded-full shadow">
                      <GraduationCap className="w-6 h-6 text-purple-700" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ${course.price}
                      </p>
                      <Progress
                        value={course.progress ?? 0}
                        className="h-2"
                      />
                      <span className="text-xs text-gray-500">
                        Progress: {course.progress ?? 0}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 italic">
                  You are not enrolled in any courses.
                </p>
              )}
              <Button
                className="w-full mt-4 font-semibold shadow-md bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                onClick={() => router.push("/MyCourses")}
              >
                View All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="w-full shadow-xl rounded-2xl transition-transform hover:scale-[1.02] bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-blue-600 text-xl font-bold">
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-center text-gray-400 italic">
                  No upcoming sessions yet.
                </p>
              ) : (
                sessions.map((s, idx) => (
                  <div
                    key={idx}
                    className="border-b pb-2 hover:bg-blue-50/50 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-blue-800">{s.title}</p>
                    <p className="text-xs text-blue-500 capitalize">{s.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
              <Button
                variant="outline"
                className="w-full mt-2 font-semibold border-blue-400 text-blue-600 hover:bg-blue-100 transition-colors"
                onClick={() => router.push("/Schedule")}
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Calendar Mini View */}
          <Card className="w-full shadow-xl rounded-2xl transition-transform hover:scale-[1.02] bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-blue-600 text-xl font-bold">
                Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="rounded-lg border border-blue-100 overflow-hidden shadow-sm"
                style={{ height: 300 }}
              >
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
                className="w-full font-semibold border-blue-400 text-blue-600 hover:bg-blue-100 transition-colors"
                onClick={() => router.push("/Schedule")}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="border-b border-gray-200 my-8"></div>

        {/* Bottom 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card className="w-full shadow-lg rounded-2xl bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-blue-700 text-xl font-bold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Activity Filter Buttons */}
              <div className="flex gap-2 mb-3 justify-center">
                {activityTypes.map((f) => (
                  <Button
                    key={f.value}
                    size="sm"
                    variant={activityFilter === f.value ? "default" : "outline"}
                    onClick={() => setActivityFilter(f.value)}
                    className="rounded-full"
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
              {/* Error State */}
              {activityError && (
                <p className="text-center text-red-500 italic mb-2">
                  {activityError}
                </p>
              )}
              {/* Loading/Empty/Feed */}
              {loadingActivities ? (
                <p className="text-center text-gray-400 italic">
                  Loading activity...
                </p>
              ) : filteredActivities.length === 0 ? (
                <p className="text-center text-gray-400 italic">
                  No recent activity.
                </p>
              ) : (
                <ul className="space-y-3">
                  {filteredActivities.map((a, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {/* Icon */}
                      {getActivityIcon(a.type)}
                      {/* Message (clickable if link) */}
                      {a.link ? (
                        <a
                          href={a.link}
                          className="flex-1 text-blue-700 hover:underline"
                        >
                          {a.message}
                        </a>
                      ) : (
                        <span className="flex-1 text-gray-700">
                          {a.message}
                        </span>
                      )}
                      {/* Date/Time */}
                      <span className="text-xs text-gray-400">
                        {a.parsedDate.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Personal Notes */}
          <Card className="w-full shadow-lg rounded-2xl bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-blue-700 text-xl font-bold">
                Personal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[120px] p-3 rounded border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none resize-vertical text-gray-700 bg-blue-50 placeholder:text-gray-400"
                placeholder="Write your notes here..."
                value={notes}
                onChange={handleNotesChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Progress Tracking */}
        <div className="mt-10">
          <Card className="w-full shadow-lg rounded-2xl bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-green-700 text-xl font-bold">
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-center text-gray-400 italic">
                  No courses to show progress.
                </p>
              ) : (
                <ul className="space-y-6">
                  {courses.map((course, idx) => (
                    <li key={course.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">
                          {course.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          {typeof course.progress === "number"
                            ? `${course.progress}%`
                            : "-"}
                        </span>
                      </div>
                      <Progress
                        value={course.progress ?? 0}
                        className="h-2"
                      />
                      <span className="text-xs text-gray-500">
                        Progress: {course.progress ?? 0}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center border-4 border-white"
          aria-label={chatOpen ? 'Close chat' : 'Open chat'}
        >
          <span className="text-2xl">💬</span>
        </button>
        <ChatPopup isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      </div>

      {/* {showToast && (
        <Toast message={showToast.message} onClose={() => setShowToast(null)} />
      )} */}
    </div>
  );
}
