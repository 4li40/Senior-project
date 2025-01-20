"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, AlertCircle, Bell, List } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";

export default function SchedulePage() {
  // Example upcoming exams
  const upcomingExams = [
    {
      id: 1,
      title: "Midterm Exam - Math",
      date: "October 20, 2023",
      course: "Advanced Mathematics",
    },
    {
      id: 2,
      title: "Final Exam - Physics",
      date: "November 10, 2023",
      course: "Physics 101",
    },
  ];

  // Example notifications
  const notifications = [
    {
      id: 1,
      message: "Math Assignment 3 is due tomorrow.",
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "Physics Lab Report feedback is available.",
      time: "1 day ago",
    },
  ];

  // Example daily planner tasks
  const dailyPlanner = [
    {
      id: 1,
      task: "Complete Math Assignment 3",
      completed: false,
    },
    {
      id: 2,
      task: "Review Physics Lab notes",
      completed: true,
    },
  ];

  return (
    <>
      <StudentNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Schedule</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">{exam.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.course}
                    </p>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Exams
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Daily Planner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                Daily Planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyPlanner.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    <span
                      className={`text-sm ${
                        task.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.task}
                    </span>
                  </label>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                Add Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
