"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { CourseActionCell } from "@/components/ui/course-action-cell";

import { ExamTitleCell } from "./exam-title-cell";
import { ExamScoreCell } from "./exam-score-cell";
import { ExamAttemptCell } from "./exam-attempt-cell";
import { ExamLastAttemptCell } from "./exam-lastattempt-cell";
import { ExamStatusCell } from "./exam-status-cell";
import { ExamActionCell } from "@/components/ui/exam-action-cell";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Tên Bài Kiểm Tra</span>
          {/* <ArrowUpDown className="h-4 w-4" /> */}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Tên Bài Kiểm Tra</span>
          {/* <ArrowUpDown className="h-4 w-4" /> */}
        </span>
      );
    },
    cell: ExamTitleCell,
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Điểm</span>
          {/* <ArrowUpDown className="h-4 w-4" /> */}
        </span>
      );
    },
    cell: ExamScoreCell,
  },
  {
    accessorKey: "attempt",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Số Lần Thử</span>
          {/* <ArrowUpDown className="h-4 w-4" /> */}
        </span>
      );
    },
    cell: ExamAttemptCell,
  },
  {
    accessorKey: "lastattempt",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Lần Thử Cuối Cùng</span>
          {/* <ArrowUpDown className="h-4 w-4" /> */}
        </span>
      );
    },
    cell: ExamLastAttemptCell,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Trạng Thái</span>
          {/* <ArrowUpDown className="h-4 w-4" /> */}
        </span>
      );
    },
    cell: ExamStatusCell,
  },
  {
    id: "actions",
    accessorKey: "Action",
    cell: ExamActionCell,
  },
];
