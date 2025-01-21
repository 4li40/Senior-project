'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChartComponent } from "@/components/ui/bar-chart";
import TeacherNavBar from '@/components/teacherNavBar';

const data = [
  {
    name: "Mon",
    total: 700,
  },
  {
    name: "Tue",
    total: 1500,
  },
  {
    name: "Wed",
    total: 1700,
  },
  {
    name: "Thu",
    total: 1000,
  },
  {
    name: "Fri",
    total: 500,
  },
];

export default function EarningsPage() {
  return (
    <>
      <TeacherNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Earnings</h1>

        {/* Earnings Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold">$2,450</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Statistics</h3>
              <p className="font-medium mb-2">Weekly revenue</p>
              <BarChartComponent data={data} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Course: Intro to AI</p>
                <p className="text-sm text-muted-foreground">Enrollment by John Doe</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$50</p>
                <p className="text-sm text-muted-foreground">Jan 15, 2024</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Course: Machine Learning</p>
                <p className="text-sm text-muted-foreground">Enrollment by Jane Smith</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$75</p>
                <p className="text-sm text-muted-foreground">Jan 10, 2024</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Course: What is an API?</p>
                <p className="text-sm text-muted-foreground">Enrollment by Alice Johnson</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$30</p>
                <p className="text-sm text-muted-foreground">Jan 5, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}