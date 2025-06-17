// @refresh reset
"use client";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Image from "next/image";
import { Cell } from "@/components/ui/cell";
import { CellUserExamStatus } from "@/components/ui/cell-user-exam-status";
import { cn } from "@nextui-org/react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: () => {
      return <div>Tên User</div>;
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
          <span className="mr-2">Phòng Ban</span>
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
          <span className="mr-2">Trạng Thái</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") || false;

      return (
        <div
          className={cn(
            "text-green-600",
            status == "approved" && "text-blue-600"
          )}
        >
          {status == "approved"
            ? "Đã Chấp Thuận"
            : "User Không Có Quyền Truy Cập Hệ Thông"}
        </div>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "Action",
    header: ({ column }) => {
      return (
        <span>
          <span className="mr-2">Hành Động</span>
        </span>
      );
    },
    cell: Cell,
  },
  {
    id: "isInExam",
    accessorKey: "isInExam",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Người Dùng Có Đang Làm Kiểm Tra?</span>
        </span>
      );
    },
    cell: CellUserExamStatus,
  },
];
