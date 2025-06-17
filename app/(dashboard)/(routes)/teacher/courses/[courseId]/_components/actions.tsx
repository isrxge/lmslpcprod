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
  endDate?: string | null;  // ISO string hoặc null
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


  // Tính xem course đã hết hạn chưa
  // const isExpired = endDate
  //   ? new Date(endDate) <= new Date()
  //   : false;

  // Auto-unpublish ngay khi mount nếu hết hạn và vẫn đang published
  // useEffect(() => {
  //   if (isExpired && isPublished) {
  //     axios
  //       .patch(`/api/courses/${courseId}/unpublish`)
  //       .then(() => {
  //         toast.success(`Course automatically unpublished (deadline passed)`);
  //         router.refresh();
  //       })
  //       .catch(() => {
  //         toast.error("Failed to auto-unpublish");
  //       });
  //   }
  // }, [isExpired, isPublished, courseId, router]);

  const onClick = async () => {
    if (isClosed) {                                  
      toast.error("Khóa Học Đã Đóng Hoàn Toàn, Không Thể Phát Hành.");
      return;
    }
    // Ngăn publish nếu đã hết hạn
    // if (isExpired) {
    //   toast.error(
    //     "Cannot publish: the course deadline has passed. It remains unpublished."
    //   );
    //   return;
    // }

    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseCourse = async () => {
    if (isClosed) return;

    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${courseId}/close`);
      toast.success("Course closed");
      router.refresh();
    } catch {
      toast.error("Failed to close course");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Course deleted");
      router.push(`/teacher/courses`);
    } catch {
      toast.error("Something went wrong");
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
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      {showClose && (
  <ConfirmModal
    title="Close course"
    description="Are you sure you want to close this course? Students will no longer be able to continue."
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
      {/* <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
            <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal> */}
      {/* {showDelete && (
        <ConfirmModal onConfirm={onDelete}>
          <Button size="sm" disabled={isLoading || isClosed}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      )} */}
      {showDelete && (
        <ConfirmModal
          title="Delete course"
          description="This action cannot be undone."
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
