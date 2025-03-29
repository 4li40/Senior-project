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

// Define the Event type to match the expected structure
type Event = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

// Define the Session type to match the API response structure
type Session = {
  title: string;
  type: string;
  scheduled_at: string;
  duration_minutes?: number;
};

export default function SchedulePage() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState<
    { title: string; start: Date; end: Date; allDay: boolean }[]
  >([]);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    type: "session",
    scheduled_at: "",
    duration_minutes: "60",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5003/api/courses", {
        credentials: "include",
      });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("❌ Failed to load courses:", err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("http://localhost:5003/api/courses/sessions", {
        credentials: "include",
      });
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("❌ Expected array, got:", data);
        return;
      }

      const formatted: Event[] = data.map((session: Session) => {
        const start = new Date(session.scheduled_at);
        const end = new Date(
          start.getTime() + (session.duration_minutes || 60) * 60000
        );
        return {
          title: `${session.title} (${session.type})`,
          start,
          end,
          allDay: false,
        };
      });

      setEvents(formatted);
      // ⬅️ This should be passed to <Calendar events={events} />
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSessions();
  }, []);

  const handleBack = () => router.push("/tutor-dashboard");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `http://localhost:5003/api/courses/${form.courseId}/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create session");

      setSuccess(true);
      setShowModal(false);
      await fetchSessions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Calendar Schedule</h1>
        <div className="space-x-2">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            + Create Announcement / Session
          </Button>
          <Button onClick={handleBack} variant="outline">
            ← Back
          </Button>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule a Session or Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm">🎉 Created successfully!</p>
            )}

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
                  {courses.map((course: any) => (
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
              <Label>Description (optional)</Label>
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
                  <SelectItem value="session">Live Session</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Scheduled Time</Label>
              <Input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) =>
                  setForm({ ...form, scheduled_at: e.target.value })
                }
                required
              />
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
                required={form.type === "session"}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
