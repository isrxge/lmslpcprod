"use client";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { Accordion, AccordionItem } from "@nextui-org/react";

import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
  HTMLProps,
} from "react";
import React from "react";
import { CourseAttendeeCell } from "@/components/ui/user-record-cell";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "username",
    header: () => {
      return <div>Tên</div>;
    },
    cell: ({ row }) => {
      const { username }: any = row.original;

      return (
        <div className="flex items-center">
          <div>{username}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Email</span>
        </span>
      );
    },
  },

  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Phòng Bàn</span>
        </span>
      );
    },
    cell: ({ row }) => {
      const { Department }: any = row.original;

      return (
        <div className="flex items-center">
          <div>{Department.title}</div>
        </div>
      );
    },
  },

  // {
  //   accessorKey: "star",
  //   header: ({ column }) => {
  //     return (
  //       <span className="flex items-center cursor-pointer">
  //         <span className="mr-2">Star</span>
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "departmentId",
    header: ({ column }) => {
      return <span className="flex items-center cursor-pointer">hidden</span>;
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return <span className="flex items-center cursor-pointer">hidden</span>;
    },

    cell: ({ row }) => {
      const { id, ClassSessionRecord }: any = row.original;

      return (
        <div className="flex items-center">
          <div>
            {ClassSessionRecord.map(
              (item: { endDate: any }) => item.endDate
            ).map((item: any) => {
              return <div key={item.id}>item</div>;
            })}
          </div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => {
  //     return (
  //       <span className="flex items-center cursor-pointer">
  //         <span className="mr-2">Status</span>
  //       </span>
  //     );
  //   },
  // },

  // Code cũ 13/5
  {
    accessorKey: "ClassSessionRecord",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Tiến Trình Học Của User </span>
        </span>
      );
    },
    cell: ({ row }) => {
      const { id, ClassSessionRecord }: any = row.original;

      return (
        <div className="flex items-center">
          <div>
            {ClassSessionRecord.map((item: any) => {
              console.log("item 2", item);
              return (
                <div key={item.id}>
                  <Accordion key="1">
                    <AccordionItem
                      startContent={
                        <div>
                          {item.course.title}:{" "}
                          {item.status === "finished" ? (
                            <span className="text-green-500 font-medium">
                              Hoàn Thành
                            </span>
                          ) : item.progress === "0%" ? (
                            <span className="text-red-500 font-medium">
                              Chưa Hoàn Thành
                            </span>
                          ) : item.status === "studying" ? (
                            <span className="text-yellow-500 font-medium">
                              Đang Học (
                              {parseFloat(item.progress + "").toFixed(0)}%)
                            </span>
                          ) : (
                            <>
                              {item.progress} (<span>{item.status}</span>)
                            </>
                          )}
                        </div>
                      }
                    >
                      - Tất Cả Kết Quả Kiểm Tra:
                      {item.course.modules
                        .filter((item: any) => item.module.type == "Exam")
                        .map((item: any) => {
                         
                          return (
                            <>
                              {item.module.UserProgress?.filter(
                                (item: any) => item.userId == id
                              ).length < 1 ? (
                                <div key={item.module.id}>
                                  {" "}
                                  • {item.module.title}
                                  {": "}Không Có Kết Quả
                                </div>
                              ) : (
                                <div key={item.module.id}>
                                  {item.module.UserProgress?.filter(
                                    (item: any) => item.userId == id
                                  ).map((item: any) => {
                                    return (
                                      <div key={item.module.id}>
                                        • {item.module.title}
                                        {": "}
                                        <span
                                          className={`${
                                            item.status == "finished"
                                              ? "text-green-500 font-medium"
                                              : item.status == "studying"
                                              ? "text-yellow-500 font-medium"
                                              : ""
                                          }`}
                                        >
                                          {item.status === "finished"
                                            ? `Đậu (${item.score}%)`
                                            : `Trượt (${item.score}%)`}
                                        </span>{" "}
                                        Vào Lúc{" "}
                                        {new Date(
                                          item.endDate
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}{" "}
                                        {new Date(
                                          item.endDate
                                        ).toLocaleDateString("vi-VN", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}{" "}
                                        {item.attempt > 1 && (
                                          <span>({item.attempt - 1} 🐓)</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          );
                        })}
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
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
