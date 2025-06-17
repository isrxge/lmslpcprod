"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

export const ExamActionCell = ({ row }: any) => {
  const { id, title, UserProgress } = row.original;

  const { userId }: any = useAuth();
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}/personalInfo`);
    return data;
  };
  const resetExamProgress = async () => {
    await axios.patch(`/api/user`, { UserProgress });
  };
  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );
  if (isLoading) {
    return <></>;
  } else {
    return data.userPermission
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit course permission") != -1 ? (
      <AlertDialog>
        <AlertDialogTrigger className="flex justify-center items-center">
          <>Chạy Lại Bài Kiểm Tra</>
        </AlertDialogTrigger>

        <AlertDialogContent className="AlertDialogContent">
          <AlertDialogTitle className="AlertDialogTitle">
            Lưu ý Bài Kiểm Tra
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
            Bạn Chuẩn Bị Chạy Lại Bài Kiểm Tra Cho Các Người Dùng Trượt.
          </AlertDialogDescription>
          <div
            style={{
              display: "flex",
              gap: 25,
              justifyContent: "flex-end",
            }}
          >
            <AlertDialogCancel>Từ Chối</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                className="Button red"
                onClick={() => resetExamProgress()}
              >
                Xác Nhận
              </button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <></>
    );
  }
};
