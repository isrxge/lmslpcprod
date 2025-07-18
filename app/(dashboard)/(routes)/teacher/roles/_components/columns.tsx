"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleActionCell } from "@/components/ui/role-action-cell";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<{ id: string; title: string; status: string; }>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Tiêu đề</span>
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
    cell: ({ row }: any) => {
  const { id, status } = row.original;

  return (
    <Badge
      className={cn(
        "bg-slate-500 dark:text-zinc-50 ",
        status === "active" && "bg-sky-700"
      )}
    >
      {status == "active" ? "Đang hoạt động" : "Không hoạt động"}
    </Badge>
  );
}

  },

  {
    id: "actions",
    accessorKey: "Hành động",
    cell: RoleActionCell,
  },
];
