"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, BarChart, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 12345,
    activeSessions: 789,
    countriesReached: 92,
    activeUsers: 6345,
  });

  // Simulate fetching data from an API
  useEffect(() => {
    // Example of API call to fetch stats
    // fetch('/api/admin/stats')
    //   .then(res => res.json())
    //   .then(data => setStats(data))
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Admin Navbar - You can use the same structure from your teacher navbar */}
      <nav className="flex items-center justify-between p-6 bg-gray-800 text-white">
        <div className="text-xl font-bold">StudyBuddy Admin</div>
        <div className="space-x-4">
          <Button
            onClick={() => router.push("/login")}
            className="bg-black text-white"
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="flex-grow px-6 md:px-12 space-y-10 mt-10">
        <h1 className="text-4xl font-bold text-center text-black mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: BarChart,
              label: "Total Users",
              value: stats.totalUsers.toLocaleString(),
            },
            {
              icon: Activity,
              label: "Active Sessions",
              value: stats.activeSessions,
            },
            {
              icon: Users,
              label: "Active Users",
              value: stats.activeUsers,
            },
            {
              icon: MapPin,
              label: "Countries Reached",
              value: stats.countriesReached,
            },
          ].map(({ icon: Icon, label, value }, index) => (
            <Card
              key={index}
              className="border border-gray-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-200"
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Icon className="w-10 h-10 text-gray-700 mb-3" />
                <h2 className="text-xl font-semibold">{value}</h2>
                <p className="text-sm text-gray-600">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Management Section */}
        <div className="mt-10">
          <Card className="border border-gray-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-200">
            <CardHeader>
              <CardTitle className="text-black">
                Pending Tutor Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              {/* List of Pending Applications */}
              <ul className="space-y-4">
                {["Nader Bakir", "Abdala Shalik", "Maher Jneid"].map(
                  (name, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{name}</span>
                      <div className="space-x-2">
                        <Button className="bg-green-500 text-white">
                          Accept
                        </Button>
                        <Button className="bg-red-500 text-white">
                          Decline
                        </Button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-10">
          <Card className="border border-gray-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              <ul className="list-disc ml-6 space-y-3">
                <li>🎉 New student enrolled in "Advanced React"</li>
                <li>💬 You received 2 new messages from tutors</li>
                <li>📖 Course "Data Science with Python" was updated</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <div className="mt-10">
          <Card className="border border-gray-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-200">
            <CardHeader>
              <CardTitle className="text-black">User Management</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2">Name</th>
                    <th className="border-b px-4 py-2">Email</th>
                    <th className="border-b px-4 py-2">Role</th>
                    <th className="border-b px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Alice Cooper",
                      email: "alice@example.com",
                      role: "Student",
                    },
                    {
                      name: "Bob Marley",
                      email: "bob@example.com",
                      role: "Tutor",
                    },
                    {
                      name: "Charlie Brown",
                      email: "charlie@example.com",
                      role: "Admin",
                    },
                  ].map((user, index) => (
                    <tr key={index}>
                      <td className="border-b px-4 py-2">{user.name}</td>
                      <td className="border-b px-4 py-2">{user.email}</td>
                      <td className="border-b px-4 py-2">{user.role}</td>
                      <td className="border-b px-4 py-2 space-x-2">
                        <Button className="bg-blue-500 text-white">Edit</Button>
                        <Button className="bg-red-500 text-white">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
