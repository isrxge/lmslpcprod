"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
  HTMLProps,
} from "react";
import { AttendeesCell } from "@/components/ui/attendees-cell";
import { ExamsCell } from "@/components/ui/exam-cell";

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
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
          <span className="mr-2">Name of Course</span>
=======
          <span className="mr-2">Tên Khóa Học</span>
>>>>>>> 8b13b57 (commit)
        </span>
      );
    },
  },
<<<<<<< HEAD
  // {
  //   accessorKey: "user",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Created By</span>
  //       </span>
  //     );
  //   },
  //   cell: ({ row }: any) => {
  //     const { user } = row.original;
  //     return <div>{user.username}</div>;
  //   },
  // },
  // {
  //   accessorKey: "updatedUser",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Updated By</span>
  //       </span>
  //     );
  //   },
  //   cell: ({ row }: any) => {
  //     const { updatedUser } = row.original;

  //     return <div>{updatedUser?.username} </div>;
  //   },
  // },
=======

>>>>>>> 8b13b57 (commit)
  {
    accessorKey: "courseInstructedBy",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
<<<<<<< HEAD
          <span className="mr-2">Instructor</span>
=======
          <span className="mr-2">Người Hướng Dẫn</span>
>>>>>>> 8b13b57 (commit)
        </span>
      );
    },
  },
  {
    accessorKey: "courseInstructor",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
          <span className="mr-2">Instructor</span>
=======
          <span className="mr-2">Người Hướng Dẫn</span>
>>>>>>> 8b13b57 (commit)
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { courseInstructor } = row.original;

      return <div>{courseInstructor?.username} </div>;
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
          <span className="mr-2">Created On</span>
=======
          <span className="mr-2">Tạo Vào</span>
>>>>>>> 8b13b57 (commit)
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { startDate } = row.original;

      return (
        <div>
          {/* {new Date(startDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "} */}
          {new Date(startDate).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
        </div>
      );
    },
  },
  {
<<<<<<< HEAD
    accessorKey: "endDate",
=======
    accessorKey: "ClassSessionRecord",
    header: ({ column }) => (
      <span className="flex items-center cursor-pointer">
        <span className="mr-2">Người Học</span>
      </span>
    ),
    cell: AttendeesCell,
  },
  {
    accessorKey: "Module",
>>>>>>> 8b13b57 (commit)
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
          <span className="mr-2">End Date</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { endDate } = row.original;

      return (
        <div>
          {endDate
            ? new Date(endDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "ClassSessionRecord",
    header: ({ column }) => (
      <span className="flex items-center cursor-pointer">
        <span className="mr-2">Attendees</span>
      </span>
    ),
    cell: AttendeesCell,
  },
  // {
  //   accessorKey: "Module",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Exams</span>
  //       </span>
  //     );
  //   },
  //   cell: ExamsCell,
  // },
=======
          <span className="mr-2">Bài Kiểm Tra</span>
        </span>
      );
    },
    cell: ExamsCell,
  },
>>>>>>> 8b13b57 (commit)
  // {
  //   accessorKey: "Module",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Study pages</span>
  //       </span>
  //     );
  //   },
  //   cell: ({ row }: any) => {
  //     const { Module } = row.original;

  //     return (
  //       <div>
  //         {Module.map((item: any) => {
  //           return item.type == "slide" ? (
  //             <div key={item.id}>
  //               {item.title}
  //               {/* {item.UserProgress.map((item: any) => {
  //                 return <div key={item.id}>{item.user.username}</div>;
  //               })} */}
  //             </div>
  //           ) : (
  //             <></>
  //           );
  //         })}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "CourseOnDepartment",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
<<<<<<< HEAD
          <span className="mr-2">Course for</span>
=======
          <span className="mr-2">Khóa Học Dành Cho</span>
>>>>>>> 8b13b57 (commit)
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { CourseOnDepartment } = row.original;

      return (
        <div>
          {CourseOnDepartment.map((item: any) => {
            return <div key={item.id}>{item.Department.title}</div>;
          })}
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
