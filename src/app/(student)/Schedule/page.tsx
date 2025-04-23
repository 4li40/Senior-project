"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function SchedulePageStudent() {
  const router = useRouter();
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

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5003/api/courses", {
      credentials: "include",
    });
    const data = await res.json();
    setCourses(data);
  };

  const fetchSessions = async () => {
    const res = await fetch(
      "http://localhost:5003/api/courses/student/schedule",
      {
        credentials: "include",
      }
    );
    const data = await res.json();

    console.log("📦 Received sessions data:", data); // 🔍

    if (!Array.isArray(data)) {
      console.error("❌ Expected an array but got:", data);
      return;
    }

    interface Session {
      scheduled_at: string;
      duration_minutes?: number;
      title: string;
      type: string;
      course_title: string;
      description?: string;
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

  return (
    <div className="p-8 max-w-screen-xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-blue-700">Schedule Overview</h1>
        <div /> {/* Empty div to balance layout */}
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

      {/* Calendar and Events */}
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
    </div>
  );
}
