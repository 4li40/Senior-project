/* -----------------------------------------------------------------------------
   PAGE ▸ /profile  – Student / Tutor profile & settings
   --------------------------------------------------------------------------- */
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import StudentNavBar from "@/components/StudentNavBar";
import TeacherNavBar from "@/components/teacherNavBar";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Camera,
  Paperclip,
  PlayCircle,
  CheckCircle,
  BookOpenText,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  userType: "student" | "tutor";
  profilePictureUrl?: string | null;
  bio?: string;
  experience?: number;
  certificateUrls?: string[];
  educationLevel?: string;
  school?: string;
  subjects?: string[];
  goals?: string;
}

/* -------------------------------------------------------------------------- */
/*  Helper: initials for Avatar fallback                                      */
/* -------------------------------------------------------------------------- */
const initials = (first = "", last = "") =>
  (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */
export default function ProfilePage() {
  /* ───────── state ───────── */
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // images / uploads
  const [picFile, setPicFile] = useState<File | null>(null);
  const [picPreview, setPicPreview] = useState<string | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  // editable fields
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [goals, setGoals] = useState("");

  const router = useRouter();

  /* ───────── fetch profile once ───────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5003/api/profile", {
          credentials: "include",
        });
        const data = await res.json();
        const normalised: ProfileData = {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          userType: data.userType ?? "student",
          profilePictureUrl: data.profilePictureUrl ?? null,
          bio: data.bio ?? "",
          experience: data.experience ?? 0,
          certificateUrls: data.certificateUrls ?? [],
          educationLevel: data.educationLevel,
          school: data.school,
          subjects: data.subjects,
          goals: data.goals ?? "",
        };
        setProfile(normalised);
        setBio(normalised.bio ?? "");
        setExperience(normalised.experience?.toString() ?? "");
        setGoals(normalised.goals ?? "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───────── upload helpers ───────── */
  const uploadPicture = async () => {
    if (!picFile) return;
    const fd = new FormData();
    fd.append("profilePicture", picFile);
    const res = await fetch("http://localhost:5003/api/profile/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const json = await res.json();
    setProfile(
      (prev) =>
        prev && {
          ...prev,
          profilePictureUrl: `/api/profile/picture/${json.fileId}`,
        }
    );
    setPicFile(null);
    setPicPreview(null);
  };

  const uploadCert = async () => {
    if (!certFile) return;
    const fd = new FormData();
    fd.append("certificate", certFile);
    const res = await fetch(
      "http://localhost:5003/api/profile/upload-certificate",
      {
        method: "POST",
        credentials: "include",
        body: fd,
      }
    );
    const json = await res.json();
    setProfile(
      (p) =>
        p && {
          ...p,
          certificateUrls: [
            ...(p.certificateUrls ?? []),
            `/api/profile/certificate/${json.fileIds?.[0]}`,
          ],
        }
    );
    setCertFile(null);
  };

  /* ───────── save editable fields ───────── */
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const payload =
      profile?.userType === "tutor"
        ? { bio, experience: Number(experience) }
        : { goals };
    await fetch("http://localhost:5003/api/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    alert("Profile saved!");
  };

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (!profile) return <p className="p-6 text-center">Could not load.</p>;

  /* ───────── JSX ───────── */
  return (
    <>
      {profile.userType === "tutor" ? <TeacherNavBar /> : <StudentNavBar />}

      <div className="mx-auto max-w-5xl px-6 pb-20">
        {/* back button */}
        <Button
          variant="secondary"
          className="mb-4 mt-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>

        {/* ---------- header card ---------------------------------------------------- */}
        <Card className="mb-8">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            {/* avatar + picker */}
            <div className="space-y-3 text-center sm:text-left">
              <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                {profile.profilePictureUrl ? (
                  <AvatarImage
                    src={`http://localhost:5003${profile.profilePictureUrl}`}
                    alt={profile.email}
                  />
                ) : picPreview ? (
                  <AvatarImage src={picPreview} alt="preview" />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {initials(profile.firstName, profile.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>

              <Label
                htmlFor="pic-input"
                className="cursor-pointer inline-flex items-center gap-1 text-sm text-primary"
              >
                <Camera className="h-4 w-4" />
                Change photo
              </Label>
              <Input
                id="pic-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file: File | undefined = e.target.files?.[0];
                  if (file) {
                    setPicFile(file);
                    setPicPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {picFile && (
                <Button size="sm" onClick={uploadPicture}>
                  Upload
                </Button>
              )}
            </div>

            {/* name / email */}
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* ---------- GRID ---------------------------------------------------------- */}
        <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-6">
          {/* === left column =================================================== */}
          <div className="space-y-6 lg:col-span-1">
            {/* --- info card  (student OR tutor) --------------------------- */}
            {profile.userType === "student" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Student Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>Education Level:</strong>{" "}
                    {profile.educationLevel ?? "—"}
                  </p>
                  <p>
                    <strong>School:</strong> {profile.school ?? "—"}
                  </p>
                  <p>
                    <strong>Subjects:</strong>{" "}
                    {profile.subjects?.join(", ") || "—"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Tutor Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setBio(e.target.value)
                      }
                      rows={4}
                      placeholder="Tell students about yourself"
                    />
                  </div>
                  <div>
                    <Label>Experience (years)</Label>
                    <Input
                      type="number"
                      value={experience}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setExperience(e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* --- certificates (tutor only) -------------------------------- */}
            {profile.userType === "tutor" && (
              <Card>
                <CardHeader>
                  <CardTitle>Certificates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.certificateUrls?.length ? (
                    <ul className="space-y-1">
                      {profile.certificateUrls.map((u, i) => (
                        <li key={i}>
                          <a
                            href={`http://localhost:5003${u}`}
                            target="_blank"
                            className="underline text-blue-600 text-sm"
                          >
                            Certificate&nbsp;{i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No certificates uploaded.
                    </p>
                  )}

                  <Separator />

                  <Label
                    htmlFor="cert-inp"
                    className="flex items-center gap-1 text-sm cursor-pointer"
                  >
                    <Paperclip className="h-4 w-4" />
                    Attach certificate
                  </Label>
                  <Input
                    id="cert-inp"
                    type="file"
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCertFile(e.target.files?.[0] ?? null)
                    }
                  />
                  {certFile && (
                    <Button size="sm" onClick={uploadCert}>
                      Upload
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* === right / main column ======================================= */}
          <div className="space-y-6 lg:col-span-2">
            {/* --- learning goals (student) -------------------------------- */}
            {profile.userType === "student" && (
              <Card>
                <CardHeader>
                  <CardTitle>Learning Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    rows={4}
                    value={goals}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setGoals(e.target.value)
                    }
                    placeholder="Write what you want to achieve…"
                  />
                  <Button type="submit">Save Goals</Button>
                </CardContent>
              </Card>
            )}

            
          </div>
        </form>
      </div>
    </>
  );
}
