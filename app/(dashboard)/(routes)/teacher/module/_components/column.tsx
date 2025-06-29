"use client";

import { Module, Slide } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ModuleActionCell } from "@/components/ui/module-action-cell";
// import { ModuleTitleCell } from "@/components/ui/module-title-cell";

export const columns: ColumnDef<Slide>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="mr-2">Tên Học Phần</span>
        <ArrowUpDown className="h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại Học Phần",
    cell: ({ row }) => {
      const type = row.getValue("type");

      return <span>{type == "Slide" ? "Bài Giảng" : "Bài Kiểm Tra"}</span>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Được Phát Hành</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Đã Phát Hành" : "Bản Nháp"}
        </Badge>
      );
    },
  },
  // {
  //   accessorKey: "description",
  //   header: "Mô Tả",
  // },
  // {
  //   accessorKey: "department",
  //   header: "Department",
  //   cell: ({ row }: any) => {
  //     console.log(row.original.department.title)
  //     return <div>{row.original.department.title}</div>;
  //   },
  // },
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
    cell: ModuleActionCell,
  },
];
