// "use client";

// import { Course } from "@prisma/client";
// import { ColumnDef } from "@tanstack/react-table";
// import { ArrowUpDown } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { CourseActionCell } from "@/components/ui/course-action-cell";
// import { CourseTitleCell } from "@/components/ui/course-title-cell";

// export const columns: ColumnDef<Course>[] = [
//   {
//     accessorKey: "title",
//     header: ({ column }) => {
//       return (
//         <span
//           className="flex items-center cursor-pointer"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           <span className="mr-2">Title</span>
//           <ArrowUpDown className="h-4 w-4" />
//         </span>
//       );
//     },
//     cell: CourseTitleCell,
//   },
//   {
//     accessorKey: "user",
//     header: ({ column }) => {
//       return (
//         <span
//           className="flex items-center cursor-pointer"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           <span className="mr-2">Created By</span>
//           <ArrowUpDown className="h-4 w-4" />
//         </span>
//       );
//     },
//     cell: ({ row }: any) => {
//       const { user } = row.original;
//       return <div>{user.username}</div>;
//     },
//   },
//   {
//     accessorKey: "updatedUser",
//     header: ({ column }) => {
//       return (
//         <span
//           className="flex items-center cursor-pointer"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           <span className="mr-2">Updated By</span>
//           <ArrowUpDown className="h-4 w-4" />
//         </span>
//       );
//     },
//     cell: ({ row }: any) => {
//       const { updatedUser } = row.original;

//       return <div>{updatedUser?.username} </div>;
//     },
//   },
//   {
//     accessorKey: "courseInstructor",
//     header: ({ column }) => {
//       return (
//         <span
//           className="flex items-center cursor-pointer"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           <span className="mr-2">Instructed By</span>
//           <ArrowUpDown className="h-4 w-4" />
//         </span>
//       );
//     },
//     cell: ({ row }: any) => {
//       const { courseInstructor } = row.original;

//       return <div>{courseInstructor?.username} </div>;
//     },
//   },
//   {
//     accessorKey: "isPublished",
//     header: ({ column }) => {
//       return (
//         <span
//           className="flex items-center cursor-pointer"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           <span className="mr-2">Published</span>
//           <ArrowUpDown className="h-4 w-4" />
//         </span>
//       );
//     },
//     cell: ({ row }) => {
//       const isPublished = row.getValue("isPublished") || false;

//       return (
//         <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
//           {isPublished ? "Published" : "Draft"}
//         </Badge>
//       );
//     },
//   },
//   {
//     id: "actions",
//     accessorKey: "Action",
//     cell: CourseActionCell,
//   },
// ];

"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CourseActionCell } from "@/components/ui/course-action-cell";
import { CourseTitleCell } from "@/components/ui/course-title-cell";

export const columns: ColumnDef<Course>[] = [
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
    cell: CourseTitleCell,
  },
  // {
  //   accessorKey: "user",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Created By</span>
  //         <ArrowUpDown className="h-4 w-4" />
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
  //         <ArrowUpDown className="h-4 w-4" />
  //       </span>
  //     );
  //   },
  //   cell: ({ row }: any) => {
  //     const { updatedUser } = row.original;
  //     return <div>{updatedUser?.username} </div>;
  //   },
  // },
  {
    accessorKey: "courseInstructor",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Người hướng dẫn</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { courseInstructor } = row.original;
      return <div>{courseInstructor?.username} </div>;
    },
  },
  {
    accessorKey: "startDate", // Add endDate column
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Ngày bắt đầu</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { startDate } = row.original;
      return <EndDateCell endDate={startDate} />;
    },
  },
  {
    accessorKey: "endDate", // Add endDate column
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Ngày kết thúc</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { endDate } = row.original;
      return <EndDateCell endDate={endDate} />;
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
          <span className="mr-2">Tình trạng</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Đã xuất bản" : "Nháp"}
        </Badge>
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
    cell: ({ row }) => {
    // giá trị status trả về từ DB (ví dụ: "open" | "closed")
    const rawStatus: string = row.original.status ?? "";

    // Chuẩn hoá tên hiển thị
    const label =
      rawStatus.toLowerCase() === "closed"
        ? "Đóng"
        : rawStatus.toLowerCase() === "open"
        ? "Mở"
        : rawStatus;

    // Chọn màu theo trạng thái
    const badgeClass = cn(
      "bg-slate-500",                  // mặc định xám (nếu tình cờ status khác)
      rawStatus.toLowerCase() === "open" && "bg-green-600",
      rawStatus.toLowerCase() === "closed" && "bg-red-600"
    );

    return <Badge className={badgeClass}>{label}</Badge>;
  },
},
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Published</span>
  //         <ArrowUpDown className="h-4 w-4" />
  //       </span>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const isPublished = row.getValue("isPublished") || false;
  //     return (
  //       <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
  //         {isPublished ? "Published" : "Draft"}
  //       </Badge>
  //     );
  //   },
  // },
  {
    id: "actions",
    accessorKey: "Hành động",
    cell: CourseActionCell,
  },
];

// EndDateCell component to display the formatted date and conditionally show "Opening" or "Closed"
const EndDateCell = ({ endDate }: { endDate: string | null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure that the code runs only on the client
  }, []);

  if (!isClient) {
    return null; // Render nothing until the client-side hydration is done
  }

  // Handle the case where endDate might be null
  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString()
    : "N/A";

  // Handle the case where endDate is null
  if (!endDate) {
    return <div>{formattedEndDate}</div>; // Or handle it as per your requirements
  }

  // // Get current date
  // const currentDate = new Date();

  // // Check if endDate is not null and then compare
  // const endDateObj = new Date(endDate);

  // // Compare end date with the current date to determine if it's "Opening" or "Closed"
  // const isOpening = currentDate < endDateObj; // If current date is less than endDate, it's opening
  // const statusText = isOpening ? "Opening" : "Closed";
  // const statusColor = isOpening ? "text-green-500" : "text-red-500"; 

  // const isClosed = currentDate > endDateObj; // If current date is less than endDate, it's opening
  // const statusText = isClosed ? "Closed" : "Opening";
  // const statusColor = isClosed ? "text-red-500" : "text-green-500";

  // const isClosed = currentDateUTC > endDateObj; // Nếu currentDate > endDate, khóa học đã đóng
  // const statusText = isClosed ? "Closed" : "Opening"; // Hiển thị trạng thái "Closed" nếu quá hạn
  // const statusColor = isClosed ? "text-red-500" : "text-green-500"; // Màu sắc thay đổi tùy theo trạng thái

  return (
    <div className="flex items-center">
      <div>{formattedEndDate}</div>
      {/* <span className={`ml-2 ${statusColor} text-sm`}>({statusText})</span> */}
    </div>
  );
};
