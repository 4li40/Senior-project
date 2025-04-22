"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Activity, Users, MapPin, DollarSign } from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*  1. SINGLE SOURCE OF TRUTH FOR YOUR BACKEND BASE URL       */
/*     Change this if your backend is on a different port     */
/* ────────────────────────────────────────────────────────── */
const API_BASE = "http://localhost:5003/api/admin";

/* ────────── Types ────────── */
type StatPayload = {
  totalUsers: number;
  activeUsers: number;
  activeSessions: number;
  countriesReached: number;
  revenue: string;
};
type UserRow  = { id: number; name: string; email: string; role: "student" | "tutor" };
type TutorApp = { id: number; name: string };

export default function AdminDashboard() {
  const router = useRouter();

  const [stats,     setStats] = useState<StatPayload | null>(null);
  const [users,     setUsers] = useState<UserRow[]>([]);
  const [tutorApps, setApps]  = useState<TutorApp[]>([]);
  const [error,     setError] = useState("");

  /* ───────── Helper to validate JSON & status ───────── */
  const fetchJSON = (url: string) =>
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`${res.status} ${res.statusText} — ${await res.text()}`);
        return res.json();
      });

  /* ───────── Fetch data ───────── */
  useEffect(() => {
    fetchJSON(`${API_BASE}/stats`).then(setStats).catch((e) => setError(e.message));
    fetchJSON(`${API_BASE}/users`).then(setUsers).catch((e) => setError(e.message));
    fetchJSON(`${API_BASE}/tutor-applications`)
      .then((data) => setApps(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message));
  }, []);

  /* ───────── Approve / decline tutors ───────── */
  const handleTutor = async (id: number, decision: "accept" | "decline") => {
    await fetch(`${API_BASE}/tutor-applications/${id}/${decision}`, {
      method: "POST",
      credentials: "include",
    });
    setApps((prev) => prev.filter((t) => t.id !== id));
  };

  /* ───────── UI States ───────── */
  if (error)      return <div className="p-10 text-red-600 text-center">{error}</div>;
  if (!stats)     return <p className="p-10 text-gray-500">Loading…</p>;

  /* ───────── Render ───────── */
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between p-6 bg-gray-800 text-white">
        <div className="text-xl font-bold">StudyBuddy Admin</div>
        <Button onClick={() => router.push("/")} className="bg-black text-white">
          Logout
        </Button>
      </nav>

      <main className="flex-grow px-6 md:px-12 space-y-10 mt-10">
        <h1 className="text-4xl font-bold text-center mb-6">Admin Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {[
    { icon: BarChart,   label: "Total Users",     value: stats.totalUsers.toLocaleString() },
    { icon: Activity,   label: "Active Sessions", value: stats.activeSessions },
    { icon: Users,      label: "Active Users",    value: stats.activeUsers },
    { icon: DollarSign, label: "15% Revenue ($)", value: stats.revenue },
  ].map(({ icon: Icon, label, value }, i) => (
    <Card key={i} className="border shadow-lg rounded-xl hover:scale-105 hover:bg-gray-200 transition-transform">
      <CardContent className="flex flex-col items-center p-6">
        <Icon className="w-10 h-10 text-gray-700 mb-3" />
        <h2 className="text-xl font-semibold">{value}</h2>
        <p className="text-sm text-gray-600">{label}</p>
      </CardContent>
    </Card>
  ))}
</div>


        {/* PENDING TUTORS */}
        <Card className="border shadow-lg rounded-xl">
          <CardHeader><CardTitle>Pending Tutor Applications</CardTitle></CardHeader>
          <CardContent>
            {tutorApps.length === 0 ? (
              <p className="text-sm text-gray-500">No pending applications 🎉</p>
            ) : (
              <ul className="space-y-4">
                {tutorApps.map((t) => (
                  <li key={t.id} className="flex justify-between items-center">
                    <span>{t.name}</span>
                    <div className="space-x-2">
                      <Button onClick={() => handleTutor(t.id, "accept")}  className="bg-green-500 text-white">Accept</Button>
                      <Button onClick={() => handleTutor(t.id, "decline")} className="bg-red-500 text-white">Decline</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* USER MANAGEMENT */}
        <Card className="border shadow-lg rounded-xl">
          <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>{["Name","Email","Role","Actions"].map(h=>(
                  <th key={h} className="border-b px-4 py-2 text-left">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="border-b px-4 py-2">{u.name}</td>
                    <td className="border-b px-4 py-2">{u.email}</td>
                    <td className="border-b px-4 py-2 capitalize">{u.role}</td>
                    <td className="border-b px-4 py-2 space-x-2">
                      <Button size="sm" className="bg-blue-500 text-white">View</Button>
                      <Button size="sm" className="bg-red-500  text-white"
                        onClick={async () => {
                          await fetch(`${API_BASE}/users/${u.id}`, { method: "DELETE", credentials: "include" });
                          setUsers(prev => prev.filter(x => x.id !== u.id));
                        }}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
