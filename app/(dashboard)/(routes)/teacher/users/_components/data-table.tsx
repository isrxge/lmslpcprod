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
import { PlusCircle } from "lucide-react";
import axios from "axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  canCreate: boolean;
  canEdit: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  canCreate,
  canEdit,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  async function updateUserList() {
    let userList = await axios.get("/api/getLDAP");

    for (let i = 0; i < userList.data.length; i++) {
      const userCheck = await axios.post(`/api/getClerkUser`, {
        emailAddress: userList.data[i].mail,
      });

      if (userCheck.data.length == 0) {
        let userDepartment = userList.data[i].dn.split(",")[1].split("=")[1];
        if (userDepartment == "SCC" || userDepartment == "DSC") {
          userDepartment = "TVTK";
        } else if (userDepartment == "Leaders") {
          userDepartment = "BOD";
        } else if (userDepartment == "Sales") {
          userDepartment = "BU";
        }
        let newUser: any = {
          username: userList.data[i].cn,
          emailAddress: userList.data[i].mail,
          department: userDepartment,
        };
        const userCreate = await axios.post(`/api/createClerkUser`, newUser);

        newUser["createdUserId"] = userCreate.data.id;

        await axios.post(`/api/signup`, newUser);
      }
    }
  }
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Tìm Kiếm Người Dùng..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          title="Lưu Ý, Chức Năng Đang Trong Giai Đoạn Thử Nghiệm!!!"
          onClick={() => updateUserList()}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Cập Nhật NV Từ Active Directory
        </Button>
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
                  Không Có Kết Quả.
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
