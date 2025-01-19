"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Clock, Calendar } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";
import { useRouter } from "next/navigation";

export default function MyCoursesPage() {
  const router = useRouter();

  return (
    <>
      <StudentNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-muted-foreground">
                    8 lessons completed
                  </p>
                  <div className="w-full bg-muted h-2 rounded-full mt-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Physics 101</p>
                  <p className="text-sm text-muted-foreground">
                    4 lessons completed
                  </p>
                  <div className="w-full bg-muted h-2 rounded-full mt-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-muted-foreground">
                    Assignment 3 due tomorrow
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Physics 101</p>
                  <p className="text-sm text-muted-foreground">
                    Lab report due in 3 days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Course Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-muted-foreground">
                    Next session: Today at 3:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Physics 101</p>
                  <p className="text-sm text-muted-foreground">
                    Next session: Tomorrow at 2:00 PM
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/Schedule")}
              >
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-muted-foreground">
                    Chapter 5: Differential Equations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Physics 101</p>
                  <p className="text-sm text-muted-foreground">
                    Chapter 3: Kinematics
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Materials
              </Button>
            </CardContent>
          </Card>

          {/* Course Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Course Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-muted-foreground">
                    Midterm exam scheduled for next week
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Physics 101</p>
                  <p className="text-sm text-muted-foreground">
                    Guest lecture on Quantum Mechanics
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Announcements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
