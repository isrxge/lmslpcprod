// @refresh reset
"use client";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Image from "next/image";
import { Cell } from "@/components/ui/cell";
import { CellUserExamStatus } from "@/components/ui/cell-user-exam-status";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: () => {
      return <div>Họ và tên</div>;
    },
    cell: ({ row }) => {
      const { username, imageUrl }: any = row.original;

      return (
        <div className="flex items-center">
          <Image
            src={imageUrl === null ? "/figure_605.png" : imageUrl}
            alt={username}
            height={32}
            width={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>{username}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Email</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },

  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Phòng ban</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },

  {
    accessorKey: "star",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Điểm</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Trạng thái</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "Hành động",
    cell: Cell,
  }
  // ,
  // {
  //   id: "isInExam",
  //   accessorKey: "isInExam",
  //   header: ({ column }) => {
  //     return (
  //       <span className="flex items-center cursor-pointer">
  //         <span className="mr-2">Is user taking an exam?</span>
  //       </span>
  //     );
  //   },
  //   cell: CellUserExamStatus,
  // },
];
