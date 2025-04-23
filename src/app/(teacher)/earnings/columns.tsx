"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Transaction = {
  enrolled_at: string
  course_title: string
  price: number
  first_name: string
  last_name: string
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "enrolled_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full flex justify-start"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("enrolled_at"))
      return <div className="font-medium">{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "course_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full flex justify-start"
      >
        Course
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("course_title")}</div>
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-end"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("price"))
      const tax = amount * 0.15
      const postTax = amount - tax
      
      return (
        <div className="text-right space-y-1">
          <div className="font-medium">${amount.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">
            Tax: -${tax.toFixed(2)}
            <br />
            After Tax: ${postTax.toFixed(2)}
          </div>
        </div>
      )
    },
  },
  {
    id: "student",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full flex justify-start"
      >
        Student
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </div>
      )
    },
  },
] 