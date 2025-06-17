"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const AlertInExam = ({ courseId, moduleId }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  function backToTest() {
    router.push(`/courses/${courseId}/chapters/${moduleId}`);
  }
  if (!isMounted) {
    return null;
  }
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lưu Ý</AlertDialogTitle>
          <AlertDialogDescription>
            Xin Lỗi Nhưng Bạn Đang Làm Kiểm Tra!!!
          </AlertDialogDescription>
          <AlertDialogAction asChild>
            <button className="Button red" onClick={() => backToTest()}>
              Quay Lại Bài Kiểm Tra
            </button>
          </AlertDialogAction>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
