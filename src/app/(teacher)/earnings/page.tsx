"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChartComponent } from "@/components/ui/bar-chart";
import TeacherNavBar from "@/components/teacherNavBar";

export default function EarningsPage() {
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState<
    {
      course_title: string;
      first_name: string;
      last_name: string;
      price: number;
      enrolled_at: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      const res = await fetch("http://localhost:5003/api/tutors/earnings", {
        credentials: "include",
      });
      const data = await res.json();
      setTotal(data.total);
      setTransactions(data.transactions);
    };

    fetchEarnings();
  }, []);

  return (
    <>
      <TeacherNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Earnings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-3xl font-bold">${total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((t, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Course: {t.course_title}</p>
                  <p className="text-sm text-muted-foreground">
                    Enrollment by {t.first_name} {t.last_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${t.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(t.enrolled_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
