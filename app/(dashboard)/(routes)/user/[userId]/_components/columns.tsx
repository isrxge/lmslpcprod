"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseTitleCellPersonal } from "@/components/ui/course-title-cell-personal";
import { HTMLProps } from "react";
import React from "react";

export const columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span className="flex items-center">
          <span className="mr-2">Title</span>
        </span>
      );
    },
    cell: CourseTitleCellPersonal,
  },
  {
    accessorKey: "progress",
    header: ({ column }) => {
      return (
        <span className="flex items-center">
          <span className="mr-2">Progress</span>
        </span>
      );
    },
    cell: ({ row }) => {
      const { ClassSessionRecord }: any = row.original;

      return (
        <div className="flex items-center">
          <div>{ClassSessionRecord[0].progress}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span className="flex items-center">
          <span className="mr-2">Status</span>
        </span>
      );
    },
    cell: ({ row }) => {
      const { ClassSessionRecord }: any = row.original;

      return (
        <div className="flex items-center">
          <div>
            {ClassSessionRecord[0].status == "finished"
              ? `${ClassSessionRecord[0].status} on ${new Date(
                  ClassSessionRecord[0].endDate
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} ${new Date(
                  ClassSessionRecord[0].endDate
                ).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}`
              : ClassSessionRecord[0].status}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "averageScoreOnTest",
    header: ({ column }) => {
      return (
        <span className="flex items-center">
          <span className="mr-2">Exam Result</span>
        </span>
      );
    },
    cell: ({ row }) => {
      const { modules }: any = row.original;

      return (
        <div className="flex items-center">
          <ul>
            {modules && modules.length > 0 ? (
              modules.map((item: any) => {
                const courseModule = item.module; // Truy cập vào module từ bảng ModuleInCourse
                return (
                  <li key={module.id}>
                    {courseModule.title}:{" "}
                    {courseModule.UserProgress && courseModule.UserProgress.length > 0
                      ? `${courseModule.UserProgress[0]?.status} (${courseModule.UserProgress[0]?.score}%) in ${courseModule.UserProgress[0]?.attempt} attempts`
                      : "No Result"}
                  </li>
                );
              })
            ) : (
              <li>No Modules</li>
            )}
          </ul>
        </div>
      );
    },
  },
];
function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
