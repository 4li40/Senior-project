// ✅ FRONTEND: Student Schedule Page
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";

const localizer = momentLocalizer(moment);

export default function StudentSchedulePage() {
  const router = useRouter();
  const [events, setEvents] = useState<
    { title: string; start: Date; end: Date; allDay: boolean }[]
  >([]);

  const fetchStudentSchedule = async () => {
    try {
      const res = await fetch(
        "http://localhost:5003/api/courses/student/schedule",
        {
          credentials: "include",
        }
      );

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error("❌ Failed to parse response:", raw);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("❌ Expected array of sessions, got:", data);
        return;
      }

      const mapped = data.map((session) => {
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

      setEvents(mapped);
    } catch (err) {
      console.error("❌ Failed to fetch student schedule:", err);
    }
  };

  useEffect(() => {
    fetchStudentSchedule();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">My Schedule</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/student-dashboard")}
        >
          ← Back
        </Button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
    </div>
  );
}
