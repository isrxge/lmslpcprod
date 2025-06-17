"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Trash } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useAuth } from "@clerk/clerk-react";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
  status: string;
  title: string;
  endDate?: string | null; // ISO string hoặc null
  creatorId: string;
  canDeleteAny: boolean;
  canCloseAny?: boolean;
}

export const Actions = ({
  disabled,
  courseId,
  isPublished,
  status: courseStatus,
  title,
  endDate,
  creatorId,
  canDeleteAny,
  canCloseAny = false,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const { userId } = useAuth(); // Assuming you have a way to get the current user
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = userId === creatorId;
  const showClose = isOwner || canCloseAny;

  const showDelete = isOwner || canDeleteAny;
  const isClosed = courseStatus === "closed";

  const onClick = async () => {
    if (isClosed) {
      toast.error("Khóa Học Đã Đóng Hoàn Toàn, Không Thể Phát Hành.");
      return;
    }

    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Khóa Học Đã Được Thu Hồi");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Khóa Học Đã Được Phát Hành");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại Sau");
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseCourse = async () => {
    if (isClosed) return;

    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${courseId}/close`);
      toast.success("Khóa Học Đã Được Đóng");
      router.refresh();
    } catch {
      toast.error("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại Sau");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Khóa Học Đã Được Xóa");
      router.push(`/teacher/courses`);
    } catch {
      toast.error("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại Sau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading || isClosed}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Thu Hồi" : "Phát Hành"}
      </Button>
      {showClose && (
        <ConfirmModal
          title="Đóng Khóa Học"
          description="Bạn Có Chắc Muốn Đóng Khóa Học Này? Các Học Viên Sẽ Không Thể Truy Cập Tài Nguyên Khóa Học."
          onConfirm={onCloseCourse}
          confirmLabel="Close"
        >
          <Button
            size="sm"
            variant="destructive"
            disabled={isLoading || isClosed}
          >
            Close
          </Button>
        </ConfirmModal>
      )}

      {showDelete && (
        <ConfirmModal
          title="Xóa Khóa Học"
          description="Hành Động Này Sẽ không Thể Quay Lại."
          onConfirm={onDelete}
        >
          <Button size="sm" disabled={isLoading || isClosed}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      )}
    </div>
  );
};
