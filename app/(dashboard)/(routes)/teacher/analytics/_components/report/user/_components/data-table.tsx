"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, FileDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any[];
}
// const doc = new jsPDF();
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [userList, setUserList] = React.useState<any[]>(data || []);
  const [rowSelection, setRowSelection] = React.useState({});
  const [departments, setDepartments] = React.useState([]);
  const [dateRangeEnd, setDateRangeEnd]: any = React.useState<
    DateRange | undefined
  >();
  const [datePickerDisabled, setDatePickerDisabled] = React.useState(false); // State to manage date picker disable
  const [canViewAll, setCanViewAll] = React.useState<boolean>(false);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const table = useReactTable({
    data: userList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility: {
        departmentId: false,
        endDate: false,
      },
    },
  });

  // Gọi API lấy danh sách user & đồng thời check quyền
  React.useEffect(() => {
    async function fetchUsers() {
      try {
        // API đã trả về { users, canViewAll }
        const res = await axios.get("/api/users");
        setUserList(res.data.users || []);
        setCanViewAll(res.data.canViewAll || false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  React.useEffect(() => {
    async function getDepartments() {
      let departmentList = await axios.get(`/api/departments`);
      setDepartments(departmentList.data);
    }

    getDepartments();
  }, []);

  React.useEffect(() => {
    if (dateRangeEnd?.from && dateRangeEnd?.to) {
      let tempUserList = [...data].filter((item: any) => {
        return item.ClassSessionRecord.some((item: any) => {
          let dateFrom: any = new Date(dateRangeEnd.from.toISOString());
          let date: any = new Date(new Date(item.startDate).toISOString());
          let dateTo: any = new Date(dateRangeEnd.to.toISOString());
          return dateFrom <= date && date <= dateTo;
        });
      });
      setUserList(tempUserList);
      setDatePickerDisabled(true); // Disable date picker after selecting date range
    } else {
      setUserList(data);
    }
  }, [dateRangeEnd, table]);
  function getMonday(d: any) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  async function getSheetData(filter: any) {
    const workbook = XLSX.utils.book_new();
    let exportList = [];

    // const processUserList = (list: any[]) => {
    //   return list.map((user) => {
    //     let completedCourses = "";
    //     let ongoingCourses = "";

    //     user.ClassSessionRecord.forEach((session: any) => {
    //       if (session.status === "finished") {
    //         const endDate = new Date(session.endDate)
    //           .toISOString()
    //           .split("T")[0];
    //         const [year, month, day] = endDate.split("-");
    //         const formattedDate = `${day}/${month}/${year}`;
    //         completedCourses += `\n${session.course.title}: completed on ${formattedDate}`;
    //         session.course.modules.forEach((modules: any) => {
    //           for (let i = 0; i < modules.module.UserProgress.length; i++) {
    //             let progress = modules.module.UserProgress[i];
    //             if (user.id == modules.module.UserProgress[i].userId) {
    //               completedCourses += `\n${modules.module.title}: ${progress.status} (${progress.progress})\n`;
    //             }
    //           }
    //         });
    //       } else {
    //         ongoingCourses += `${session.course.title}\nStudying\n`;
    //         session.course.modules.forEach((modules: any) => { console.log("dsad",modules)
    //           for (let i = 0; i < modules.module.UserProgress.length; i++) {
    //             let progress = modules.module.UserProgress[i];
    //             if (user.id == modules.module.UserProgress[i].userId) {
    //               ongoingCourses += `\n${modules.module.title}: ${progress.status} (${progress.progress})\n`;
    //             }
    //           }
    //         });
    //       }
    //     });

    //     return {
    //       Name: user.username,
    //       Points: user.star,
    //       Email: user.email,
    //       Department: user.Department.title,
    //       "Completed Courses": completedCourses,
    //       "Uncompleted Courses": ongoingCourses,
    //     };
    //   });
    // };

    const processUserList = (list: any[]) =>
      list.map((user) => {
        const completed: string[] = [];
        const uncompleted: string[] = [];        // chứa cả studying + failed
    
        user.ClassSessionRecord.forEach((session: any) => {
          const lines: string[] = [];
          const title = session.course.title;
    
          // Lấy ngày (nếu có)
          const iso = session.endDate
            ? new Date(session.endDate).toISOString().split("T")[0]
            : "";
          const [y, m, d] = iso ? iso.split("-") : ["", "", ""];
    
          // 1️⃣ Tiêu đề khóa + trạng thái
          if (session.status === "finished") {
            lines.push(`${title} (completed: ${d}/${m}/${y})`);
          } else if (session.status === "failed") {
            lines.push(`${title} (failed${iso ? `: ${d}/${m}/${y}` : ""})`);
          } else {
            // mặc định là studying
            lines.push(`${title} (studying)`);
          }
    
          // 2️⃣ Danh sách module & tiến độ
          session.course.modules.forEach((mod: any) => {
            const p = mod.module.UserProgress.find(
              (up: any) => up.userId === user.id
            );
            if (p) lines.push(`- ${mod.module.title}: ${p.status} (${p.progress})`);
          });
    
          // 3️⃣ Đưa vào nhóm thích hợp
          if (session.status === "finished") {
            completed.push(lines.join("\n"));
          } else {
            uncompleted.push(lines.join("\n"));
          }
        });
    
        return {
          Name: user.username,
          Points: user.star,
          Email: user.email,
          Department: user.Department.title,
          "Completed Courses": completed.join("\n\n"),
          "Uncompleted Courses": uncompleted.join("\n\n"),
        };
      });
    

    switch (filter) {
      case "All":
        exportList = processUserList(userList);
        break;
      case "Selected Rows":
        exportList = processUserList(
          table.getSelectedRowModel().rows.map((row) => row.original)
        );
        break;
      case "This Week":
        exportList = processUserList(
          userList.filter((item: any) =>
            item.ClassSessionRecord.some((session: any) => {
              let dateFrom = getMonday(new Date()).toISOString();
              let date = new Date(session.endDate).toISOString();
              return dateFrom <= date;
            })
          )
        );
        break;
      case "This Month":
        exportList = processUserList(
          userList.filter((item: any) =>
            item.ClassSessionRecord.some((session: any) => {
              let currDate = new Date();
              let firstDay = new Date(
                currDate.getFullYear(),
                currDate.getMonth(),
                1
              ).toISOString();
              let date = new Date(session.startDate).toISOString();
              return firstDay <= date;
            })
          )
        );
        break;
      case "This Year":
        exportList = processUserList(
          userList.filter((item: any) =>
            item.ClassSessionRecord.some((session: any) => {
              let currDate = new Date();
              let firstDay = new Date(
                currDate.getFullYear(),
                0,
                1
              ).toISOString();
              let date = new Date(session.startDate).toISOString();
              return firstDay <= date;
            })
          )
        );
        break;
      default:
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportList);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 30 }, // Name column width
      { wch: 10 }, // Score column width
      { wch: 30 }, // Email column width
      { wch: 15 }, // Department column width
      { wch: 50 }, // Completed Courses column width
      { wch: 50 }, // Ongoing Courses column width
    ];

    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const ref = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[ref];
      if (!cell) continue;

      cell.s = {
        ...(cell.s || {}),
        font: {
          name: "Arial",
          sz: 12,
          bold: R === 0,                 // hàng tiêu đề in đậm
        },
        alignment: { vertical: "top", wrapText: true },
        ...(R === 0 && {
          fill: { patternType: "solid", fgColor: { rgb: "EAEAEA" } },
        }),
      };
    }
  }

    const date = new Date();
    XLSX.writeFile(
      workbook,
      `${filter}_Users_${date.toISOString().split("T")[0]}.xlsx`, {
        cellStyles: true,
      });
    
  }

  function onDepartmentChange(departmentId: any) {
    table.getColumn("departmentId")?.setFilterValue(departmentId);
  }
  console.log("userList value:", userList);
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter users..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* <select
          name="status"
          id="filterByStatus"
          onChange={(event) => onDepartmentChange(event.target.value)}
          className="max-w-sm p-2 border rounded text-muted-foreground dark:bg-slate-950"
        >
           <option value="">All Departments</option>
         {departments.map((item: any) => (
            <option
              key={item.id}
              value={item.id}
              className="max-w-sm p-2 border rounded text-muted-foreground dark:bg-slate-950"
            >
              {item.title}
            </option>
          ))}
        </select> */}
        {canViewAll && (
  <select
    name="status"
    id="filterByStatus"
    onChange={(event) => onDepartmentChange(event.target.value)}
    className="max-w-sm p-2 border rounded text-muted-foreground dark:bg-slate-950"
  >
    <option value="">All Departments</option>
    {departments.map((item: any) => (
      <option
        key={item.id}
        value={item.id}
        className="max-w-sm p-2 border rounded text-muted-foreground dark:bg-slate-950"
      >
        {item.title}
      </option>
    ))}
  </select>
)}
        {/* <div className="flex gap-2 items-center">
          <DatePickerWithRange
            placeHolder={"Filter by date for complete course"}
            date={dateRangeEnd}
            setDate={setDateRangeEnd}
            className="max-w-sm"
            disabled={datePickerDisabled} // Pass the disabled state to the date picker
          />
          {dateRangeEnd != undefined ? (
            <button
              onClick={() => {
                setDateRangeEnd(undefined);
                setDatePickerDisabled(false); // Enable date picker on cancel
              }}
            >
              X
            </button>
          ) : (
            <></>
          )}
        </div> */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FileDown className="h-4 w-4 mr-2" />
                Select report <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            {userList.length == 0 ? (
              <></>
            ) : (
              <DropdownMenuContent>
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("All")}>
                    Report (All)
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => getSheetData("Selected Rows")}
                  >
                    Report (Selected Rows)
                  </DropdownMenuItem>
                )}
                {/* {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("This Week")}>
                    Report (This Week)
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("This Month")}>
                    Report (This Month)
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("This Year")}>
                    Report (This Year)
                  </DropdownMenuItem>
                ) : (
                  <></>
                )} */}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function DatePickerWithRange({
  placeHolder,
  className,
  date,
  setDate,
  disabled,
}: {
  placeHolder?: string;
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  disabled?: boolean; // Accept disabled prop
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed" // Apply styles when disabled
            )}
            disabled={disabled} // Disable button when disabled prop is true
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}{" "}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeHolder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
