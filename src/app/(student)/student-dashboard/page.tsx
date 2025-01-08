'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, Calendar, MessageSquare } from "lucide-react";
import StudentNavBar from '@/components/StudentNavBar';

export default function StudentDashboard() {
  return (
    <>
      <StudentNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <Card>
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
                  <p className="text-sm text-muted-foreground">Today at 3:00 PM</p>
                  <p className="text-sm text-muted-foreground">with Prof. Smith</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Physics 101</p>
                  <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
                  <p className="text-sm text-muted-foreground">with Dr. Johnson</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Courses */}
          <Card>
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
                  <p className="text-sm text-muted-foreground">8 lessons completed</p>
                  <div className="w-full bg-muted h-2 rounded-full mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Physics 101</p>
                  <p className="text-sm text-muted-foreground">4 lessons completed</p>
                  <div className="w-full bg-muted h-2 rounded-full mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Overview */}
          <Card>
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
                  <p className="text-sm text-muted-foreground">5 upcoming sessions</p>
                  <p className="text-sm text-muted-foreground">2 assignments due</p>
                </div>
              </div>
              <Button className="w-full">View Full Schedule</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Prof. Smith</p>
                  <p className="text-sm text-muted-foreground">Regarding next week's session...</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Dr. Johnson</p>
                  <p className="text-sm text-muted-foreground">Here's the study material for...</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">View All Messages</Button>
            </CardContent>
          </Card>

          {/* Find Tutors */}
          <Card>
            <CardHeader>
              <CardTitle>Find Tutors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect with expert tutors in your field of study. Get personalized help and improve your understanding.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full">Browse Tutors</Button>
                <Button variant="outline" className="w-full">Quick Match</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}