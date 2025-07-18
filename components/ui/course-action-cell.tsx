"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MoreHorizontal,
  Pencil,
  Eye,
  FileDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Modal } from "@/components/modals/modal-course-live";
import { exportCourseToExcel } from "@/app/utils/export-course";

export const CourseActionCell = ({ row }: any) => {
  const { id, status } = row.original;
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  const { userId }: any = useAuth();
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}/personalInfo`);
    return data;
  };

  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );
  const handleViewReport = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      const classRecords = res.data.ClassSessionRecord || [];

      const formattedData = classRecords.map((item: any) => ({
        username: item.user.username,
        progress: parseFloat(item.progress),
        status: item.status,
        score: item.score,
      }));

      setReportData(formattedData);
      setReportModalOpen(true);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu báo cáo:", err);
    }
  };
  if (isLoading) {
    return <></>;
  } else {
    return data.userPermission
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit course permission") != -1 ? (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem onClick={handleViewReport}>
              <Eye className="h-4 w-4 mr-2" />
              Xem báo cáo
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                try {
                  const res = await axios.get(`/api/courses/${id}`);
                  const course = res.data;

                  // Truyền toàn bộ object course vào hàm export
                  await exportCourseToExcel(course, "SelectedCourse");
                } catch (error) {
                  console.error("❌ Xuất báo cáo lỗi:", error);
                }
              }}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </DropdownMenuItem>

            {/* <Link href={`/teacher/courses/${id}/exams`}>
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Check exams
            </DropdownMenuItem>
          </Link> */}
          </DropdownMenuContent>
        </DropdownMenu>
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Báo cáo khóa học"
          allUsers={reportData}
        />
      </>
    ) : (
      <></>
    );
  }
};
