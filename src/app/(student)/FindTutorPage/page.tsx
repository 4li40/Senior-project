"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, MessageSquare, Star } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";

export default function FindTutorsPage() {
  // Example tutor data (replace with real data from an API)
  const tutors = [
    {
      id: 1,
      name: "Prof. Smith",
      subject: "Advanced Data Analysis",
      rating: 4.8,
      bio: "Experienced Data Analyst with 10+ years of teaching experience.",
    },
    {
      id: 2,
      name: "Dr. Johnson",
      subject: "Web Developement 101",
      rating: 4.7,
      bio: "Web Developper with a passion for teaching and mentoring students.",
    },
    {
      id: 3,
      name: "Ms. Davis",
      subject: "Quality Assurance",
      rating: 4.9,
      bio: "Quality Assurance Specialist with a focus on software testing.",
    },
  ];

  return (
    <>
      <StudentNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Find Tutors</h1>
        <p className="text-muted-foreground">
          Connect with expert tutors in your field of study. Get personalized
          help and improve your understanding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tutor Cards */}
          {tutors.map((tutor) => (
            <Card key={tutor.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {tutor.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {tutor.subject}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm text-muted-foreground">
                    Rating: {tutor.rating}/5
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{tutor.bio}</p>
                <Button
                  className="w-full"
                  onClick={() => alert(`Registering with ${tutor.name}`)}
                >
                  Register
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
