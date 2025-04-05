"use client";

import { useEffect, useState } from "react";
import StudentNavBar from "@/components/StudentNavBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Clock, Mail, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tutor {
  userId: number;
  first_name: string;
  last_name: string;
  email: string;
  education: string;
  experience: number;
  subjects: string[]; // parsed from JSON
  other_subjects: string | null;
  certifications: string | null;
  profile_picture?: string; // URL to profile picture
}

export default function FindTutorPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/tutors", {
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          console.log("📥 Received from /api/tutors:", data);
          setTutors(data);
        } else {
          console.error("Expected an array, got:", data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Get all unique subjects across all tutors
  const allSubjects = [...new Set(tutors.flatMap(tutor => 
    Array.isArray(tutor.subjects) ? tutor.subjects : []
  ))];

  // Filter tutors based on search term and selected subject
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = searchTerm === "" || 
      `${tutor.first_name} ${tutor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tutor.education && tutor.education.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = !selectedSubject || 
      (Array.isArray(tutor.subjects) && tutor.subjects.includes(selectedSubject));
    
    return matchesSearch && matchesSubject;
  });

  // Get initials for profile picture fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavBar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Find a Tutor</h1>
          <p className="text-gray-500">Connect with expert tutors who can help you succeed</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or education..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex-shrink-0 w-full md:w-64">
            <select 
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              value={selectedSubject || ""}
              onChange={(e) => setSelectedSubject(e.target.value || null)}
            >
              <option value="">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Tabs defaultValue="grid" className="mb-6">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-lg font-medium">No tutors found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutors.map((tutor) => (
                  <Card key={tutor.userId} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-primary text-white">
                          {tutor.profile_picture ? (
                            <img 
                              src={tutor.profile_picture} 
                              alt={`${tutor.first_name} ${tutor.last_name}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // If the image fails to load, replace with initials
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerText = getInitials(tutor.first_name, tutor.last_name);
                              }}
                            />
                          ) : (
                            getInitials(tutor.first_name, tutor.last_name)
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{tutor.first_name} {tutor.last_name}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            {tutor.email}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid gap-3">
                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Education</p>
                            <p className="text-sm text-gray-600">{tutor.education}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-primary mr-2" />
                          <div>
                            <p className="font-medium">Experience</p>
                            <p className="text-sm text-gray-600">{tutor.experience} {tutor.experience === 1 ? 'year' : 'years'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium mb-2">Subjects</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(tutor.subjects) ? (
                              tutor.subjects.map((subject, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{subject}</Badge>
                              ))
                            ) : (
                              <p className="text-sm text-gray-600">No subjects listed</p>
                            )}
                          </div>
                        </div>
                        {tutor.certifications && (
                          <div className="flex items-start">
                            <Award className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Certifications</p>
                              <p className="text-sm text-gray-600">{tutor.certifications}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-lg font-medium">No tutors found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTutors.map((tutor) => (
                  <Card key={tutor.userId} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row p-6">
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-primary text-white">
                          {tutor.profile_picture ? (
                            <img 
                              src={tutor.profile_picture} 
                              alt={`${tutor.first_name} ${tutor.last_name}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // If the image fails to load, replace with initials
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerText = getInitials(tutor.first_name, tutor.last_name);
                              }}
                            />
                          ) : (
                            getInitials(tutor.first_name, tutor.last_name)
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{tutor.first_name} {tutor.last_name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            {tutor.email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-grow grid md:grid-cols-2 gap-4 md:ml-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <BookOpen className="h-5 w-5 text-primary mr-2" />
                            <p className="font-medium">Education: <span className="font-normal text-gray-600">{tutor.education}</span></p>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-primary mr-2" />
                            <p className="font-medium">Experience: <span className="font-normal text-gray-600">{tutor.experience} {tutor.experience === 1 ? 'year' : 'years'}</span></p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Subjects:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(tutor.subjects) ? (
                              tutor.subjects.map((subject, i) => (
                                <Badge key={i} variant="secondary">{subject}</Badge>
                              ))
                            ) : (
                              <p className="text-sm text-gray-600">No subjects listed</p>
                            )}
                          </div>
                          
                          {tutor.certifications && (
                            <div className="flex items-center mt-3">
                              <Award className="h-5 w-5 text-primary mr-2" />
                              <p className="font-medium">Certifications: <span className="font-normal text-gray-600">{tutor.certifications}</span></p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}