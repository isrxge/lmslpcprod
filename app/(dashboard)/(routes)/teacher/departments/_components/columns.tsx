"use client"; // Ensure this is at the top of your file

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { DepartmentActionCell } from "@/components/ui/department-action-cell";
import { Modal } from "@/components/modals/modal"; // Import your modal component
import { DepartmentUserCell } from "@/components/ui/department-user-cell";

export const columns: ColumnDef<{
  id: string;
  title: string;
  status: string;
  User: { id: string; username: string }[];
}>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
          <span className="mr-2">Title</span>
=======
          <span className="mr-2">Tên Phòng Ban</span>
>>>>>>> 8b13b57 (commit)
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "User",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
          <span className="mr-2">Department members</span>
=======
          <span className="mr-2">Danh Sách Thành Viên Phòng Ban</span>
>>>>>>> 8b13b57 (commit)
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: DepartmentUserCell,
<<<<<<< HEAD
  }
  // ,
  // {
  //     id: "actions",
  //     accessorKey: "Action",
  //     cell: DepartmentUserCell,
  //   },
=======
  },
>>>>>>> 8b13b57 (commit)
];
