"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChartComponent } from "@/components/ui/bar-chart";
import { LineChartComponent } from "@/components/ui/line-chart";
import { PieChartComponent } from "@/components/ui/pie-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { DataTable } from "./data-table";
import { columns, type Transaction } from "./columns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import axios from "axios";

type Analytics = {
  earningsByCourse: {
    title: string;
    enrollments: number;
    total_earned: number;
  }[];
  monthlyTrend: {
    month: string;
    earnings: number;
  }[];
};

export default function EarningsPage() {
  const [total, setTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [postTaxTotal, setPostTaxTotal] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [period, setPeriod] = useState("month");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previousTotal, setPreviousTotal] = useState(0);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period,
        page: page.toString(),
      });

      if (startDate) params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));

      const res = await fetch(`http://localhost:5003/api/tutors/earnings?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      
      setPreviousTotal(total);
      setTotal(data.total);
      setTaxAmount(data.taxAmount);
      setPostTaxTotal(data.postTaxTotal);
      setTransactions(data.transactions);
      setAnalytics(data.analytics);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [period, startDate, endDate, page]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  const calculatePercentageChange = () => {
    if (previousTotal === 0) return 0;
    return ((total - previousTotal) / previousTotal) * 100;
  };

  const percentageChange = calculatePercentageChange();
  const isPositive = percentageChange >= 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
        <div className="flex gap-4">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {period === "custom" && (
            <div className="flex gap-2">
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Start Date"
              />
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="End Date"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Current Period (After Tax)</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">${Number(postTaxTotal).toFixed(2)}</p>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(percentageChange).toFixed(1)}%
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Pre-tax Total: ${Number(total).toFixed(2)}</div>
                <div>Tax (15%): -${Number(taxAmount).toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.monthlyTrend && (
              <LineChartComponent
                data={analytics.monthlyTrend.map(item => ({
                  name: item.month,
                  value: item.earnings
                }))}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings by Course</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.earningsByCourse && analytics.earningsByCourse.length > 0 ? (
              <PieChartComponent
                data={analytics.earningsByCourse.map(item => ({
                  name: item.title,
                  value: Number(item.total_earned)
                }))}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No earnings data available for this period
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
