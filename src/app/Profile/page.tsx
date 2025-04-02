"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import TeacherNavBar from "@/components/teacherNavBar";
import StudentNavBar from "@/components/StudentNavBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  profilePictureUrl?: string | null;
  bio?: string;
  experience?: number;
  certificateUrls?: string[];
  educationLevel?: string;
  school?: string;
  subjects?: string[];
  goals?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [goals, setGoals] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5003/api/profile", {
          credentials: "include",
        });
        const data = await res.json();
        setProfile({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          userType: data.userType || "student",
          profilePictureUrl: data.profilePictureUrl || null,
          bio: data.bio || "",
          experience: data.experience,
          certificateUrls: data.certificateUrls || [],
          educationLevel: data.educationLevel,
          school: data.school,
          subjects: data.subjects,
          goals: data.goals,
        });
        if (data.userType === "tutor") {
          setBio(data.bio || "");
          setExperience(data.experience?.toString() || "");
        } else {
          setGoals(data.goals || "");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("No file selected");
    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
    try {
      const res = await fetch("http://localhost:5003/api/profile/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      alert("Profile picture updated!");
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              profilePictureUrl: `/api/profile/picture/${data.fileId}`,
            }
          : prev
      );
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleCertificateUpload = async () => {
    if (!certificateFile) return alert("No certificate file selected");
    const formData = new FormData();
    formData.append("certificate", certificateFile);
    try {
      const res = await fetch(
        "http://localhost:5003/api/profile/upload-certificate",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const data = await res.json();
      alert("Certificate uploaded successfully!");
      setProfile((prev) =>
        prev && prev.certificateUrls
          ? {
              ...prev,
              certificateUrls: [
                ...prev.certificateUrls,
                `/api/profile/certificate/${data.fileIds?.[0]}`,
              ],
            }
          : prev
      );
    } catch (error) {
      console.error(error);
      alert("Certificate upload failed");
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload =
        profile?.userType === "tutor"
          ? { bio, experience: parseInt(experience, 10) }
          : { goals };
      const res = await fetch("http://localhost:5003/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.message || "Profile updated");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading profile...</p>;
  if (!profile)
    return <p className="p-6 text-center">Error loading profile.</p>;

  return (
    <div>
      {profile.userType === "tutor" ? <TeacherNavBar /> : <StudentNavBar />}

      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/${profile.userType}-dashboard`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold"></CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
              {preview || profile.profilePictureUrl ? (
                <img
                  src={
                    preview ||
                    `http://localhost:5003${profile.profilePictureUrl}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-lg font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-sm text-gray-600">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm">
                  Upload Profile Picture
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm"
                    title="Upload Profile Picture"
                  />
                </label>
                <Button size="sm" onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {profile.userType === "student" && (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Education Level:</strong>{" "}
                {profile.educationLevel || "Not specified"}
              </p>
              <p>
                <strong>School:</strong> {profile.school || "Not specified"}
              </p>
              <p>
                <strong>Subjects:</strong>{" "}
                {Array.isArray(profile.subjects)
                  ? profile.subjects.join(", ")
                  : "Not specified"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Edit Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="What are your learning goals?"
                />
                <Button type="submit">Save Goals</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {profile.userType === "tutor" && (
        <>
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Subjects You Teach
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.subjects?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.map((subj, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No subjects listed.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                  <label>
                    Upload Certificate
                    <input
                      type="file"
                      onChange={handleCertificateChange}
                      title="Upload Certificate"
                    />
                  </label>
                  <Button size="sm" onClick={handleCertificateUpload}>
                    Upload
                  </Button>
                </div>
                {profile.certificateUrls?.map((url, i) => (
                  <a
                    key={i}
                    href={`http://localhost:5003${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline block"
                  >
                    View Certificate {i + 1}
                  </a>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Update Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Bio</label>
                    <textarea
                      className="w-full border p-2 rounded"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Write a short bio about yourself"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Enter your years of experience"
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
