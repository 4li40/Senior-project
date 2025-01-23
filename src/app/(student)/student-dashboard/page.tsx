"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, Calendar, Activity } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <StudentNavBar />
      <div className="flex-grow px-4 md:px-8 lg:px-12 space-y-8 mt-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-muted-foreground">
                    Today at 3:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    with Prof. Smith
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
                    Tomorrow at 2:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    with Dr. Johnson
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Courses */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
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
              <Button
                className="w-full"
                onClick={() => router.push("/MyCourses")}
              >
                View All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Overview */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">This Week</p>
                  <p className="text-sm text-muted-foreground">
                    5 upcoming sessions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2 assignments due
                  </p>
                </div>
              </div>
              <Button className="w-full">View Full Schedule</Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Completed Quiz on AI</p>
                  <p className="text-sm text-muted-foreground">
                    Scored 85% on the AI quiz.
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Submitted Assignment</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted &quot;Physics Lab Report&quot;.
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Activities
              </Button>
            </CardContent>
          </Card>

          {/* Find Tutors */}
          <Card>
            <CardHeader>
              <CardTitle>Find Tutors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect with expert tutors in your field of study. Get
                personalized help and improve your understanding.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="w-full"
                  onClick={() => router.push("/FindTutorPage")}
                >
                  Browse Tutors
                </Button>
                <Button variant="outline" className="w-full">
                  Quick Match
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
