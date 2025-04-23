"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useRef } from "react"; // ← add this

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function SchedulePage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  interface Course {
    id: number;
    title: string;
  }
  const [courses, setCourses] = useState<Course[]>([]);
  interface Event {
    title: string;
    course: string;
    type: string;
    start: Date;
    end: Date;
    allDay: boolean;
    description?: string;
    duration: number;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    type: "live",
    scheduled_at: "",
    visibility: "private",
    duration_minutes: "60",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null); // 🔽 scroll target

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5003/api/courses", {
      credentials: "include",
    });
    const data = await res.json();
    setCourses(data);
    if (data.length === 1) {
      setForm((prev) => ({ ...prev, courseId: data[0].id.toString() }));
    }
  };

  // Define the Session interface
  interface Session {
    scheduled_at: string;
    duration_minutes?: number;
    title: string;
    type: string;
    course_title: string;
    description?: string;
  }

  const fetchSessions = async () => {
    const res = await fetch("http://localhost:5003/api/courses/sessions", {
      credentials: "include",
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Expected array but got:", data);
      return;
    }

    const formatted: Event[] = data.map((session: Session) => {
      const start = new Date(session.scheduled_at);
      const end = new Date(
        start.getTime() + (session.duration_minutes || 60) * 60000
      );
      return {
        title: `${session.title} (${session.type})`,
        course: session.course_title,
        type: session.type,
        start,
        end,
        allDay: false,
        description: session.description,
        duration: session.duration_minutes || 60,
      };
    });

    setEvents(formatted);
  };

  useEffect(() => {
    fetchCourses();
    fetchSessions();
  }, []);

  const totalSessions = events.length;
  const upcomingSessions = events.filter((e) => e.start > new Date()).length;
  const announcements = events.filter((e) =>
    e.title.includes("announcement")
  ).length;

  interface Form {
    courseId: string;
    title: string;
    description: string;
    type: string;
    scheduled_at: string;
    visibility: string;
    duration_minutes: string;
  }

  interface ApiResponse {
    message?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5003/api/courses/${form.courseId}/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create session");
      setShowForm(false); // hide the form
      await fetchSessions(); // ✅ refresh session list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <div className="p-8 max-w-screen-xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => router.back()} // Go back to the previous page
          variant="outline"
          className="text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-blue-700">
          Schedule Management
        </h1>
        <Button
          onClick={() => {
            setShowForm((prev) => {
              const next = !prev;
              if (!prev) {
                // just opened it
                setTimeout(() => {
                  formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }
              return next;
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showForm ? "Cancel" : "+ New Session"}
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-700">{totalSessions}</p>
          <p className="text-sm text-muted-foreground">Total Sessions</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">
            {upcomingSessions}
          </p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{announcements}</p>
          <p className="text-sm text-muted-foreground">Announcements</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold text-purple-600">{courses.length}</p>
          <p className="text-sm text-muted-foreground">Your Courses</p>
        </div>
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border p-6 rounded-xl shadow-sm bg-white col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            Upcoming Events
          </h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No upcoming sessions yet.
            </p>
          ) : (
            <ul className="text-sm space-y-3">
              {events.slice(0, 5).map((event, i) => (
                <li key={i}>
                  <span className="font-medium text-blue-800">
                    {event.title}
                  </span>
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {event.start.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2 border p-6 rounded-xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            Calendar View
          </h2>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            eventPropGetter={(event) => {
              const bgColor = event.type === "live" ? "#c7d2fe" : "#fef08a";
              return {
                style: {
                  backgroundColor: bgColor,
                  borderRadius: "6px",
                  padding: "4px",
                  color: "#1e293b",
                  border: "1px solid #e5e7eb",
                },
              };
            }}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
        </div>
      </div>

      {/* Table Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">
          Session Overview
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, i) => (
              <TableRow key={i}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.course || "-"}</TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell>{event.start.toLocaleString()}</TableCell>
                <TableCell>{event.duration} min</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tips Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">
          Tips for Scheduling
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
          <li>Keep live sessions under 90 minutes for better engagement.</li>
          <li>Use announcements to remind students of important deadlines.</li>
          <li>
            Make use of the public visibility option for marketing exclusive
            sessions.
          </li>
        </ul>
      </div>

      {showForm && (
        <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <Label>Course</Label>
              <Select
                onValueChange={(val) => setForm({ ...form, courseId: val })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(val) => setForm({ ...form, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live Session</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                value={form.scheduled_at}
                onChange={(e) =>
                  setForm({ ...form, scheduled_at: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Visibility</Label>
              <Select
                value={form.visibility}
                onValueChange={(val) => setForm({ ...form, visibility: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enrolled">enrolled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min="1"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Session"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
