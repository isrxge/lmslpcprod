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
import * as XLSX from "xlsx-js-style";
// import * as XLSX from "xlsx";
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
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileDown, ChevronDown } from "lucide-react";
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "star", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [userList, setUserList] = React.useState(data);
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
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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
      let tempUserList = [...data].filter((item: any) =>
        item.ClassSessionRecord.some((item: any) => {
          let dateFrom: any = new Date(dateRangeEnd.from.toISOString());
          let date: any = new Date(new Date(item.endDate).toISOString());
          let dateTo: any = new Date(dateRangeEnd.to.toISOString());
          return dateFrom < date && date < dateTo;
        })
      );

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

    const UserList = (list: any[]) => {
      return list.map((user) => {
        return {
          Name: user.username,
          Email: user.email,
          Department: user.Department.title,
          Points: user.star,
        };
      });
    };

    switch (filter) {
      case "All":
        exportList = UserList(userList);
        break;
      case "Selected Rows":
        exportList = UserList(
          table.getSelectedRowModel().rows.map((row) => row.original)
        );
        break;
      case "This Week":
        exportList = UserList(
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
        exportList = UserList(
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
        exportList = UserList(
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
      { wch: 30 }, // Email column width
      { wch: 15 }, // Department column width
      { wch: 10 }, // Score column width
    ];

    
  /* --- ÁP DỤNG STYLE CHUNG & HEADER --- */
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const ref = XLSX.utils.encode_cell({ r: R, c: C });
      const cell: any = worksheet[ref];
      if (!cell) continue;

      cell.s = {
        ...(cell.s || {}),
        font: { name: "Arial", sz: 12, bold: R === 0, color: { rgb: "000000" } },
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

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Tìm kiếm người dùng..."
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
          <option value="">All Department</option>
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
    <option value="">Tất cả phòng ban</option>
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
            placeHolder={"Filter date range"}
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
                Tải báo cáo <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            {userList.length == 0 ? (
              <></>
            ) : (
              <DropdownMenuContent>
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("All")}>
                    Tất cả
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => getSheetData("Selected Rows")}
                  >
                    Các mục đã chọn
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
                  Không có kết quả.
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
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sau
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
