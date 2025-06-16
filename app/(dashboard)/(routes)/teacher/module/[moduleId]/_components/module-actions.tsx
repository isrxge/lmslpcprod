"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ModuleActionsProps {
  disabled: boolean;
  // courseId: string;
  moduleId: string;
  isPublished: boolean;
}

export const ModuleActions = ({
  disabled,
  // courseId,
  moduleId,
  isPublished,
}: ModuleActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
<<<<<<< HEAD
  
      // Log the current state for debugging
      // console.log(`Module ID: ${moduleId}, Is Published: ${isPublished}`);
  
      if (isPublished) {
        // console.log('Unpublishing module...');
        const response = await axios.patch(`/api/module/${moduleId}/unpublish`);
        // console.log('Unpublish Response:', response); // Log the response
        toast.success("Module unpublished");
      } else {
        // console.log('Publishing module...');
        const response = await axios.patch(`/api/module/${moduleId}/publish`);
        // console.log('Publish Response:', response); // Log the response
        toast.success("Module published");
      }
  
      router.refresh();
    } catch (error) {
      // Log the error to understand what went wrong
      console.log('Error while publishing/unpublishing:', error);
      toast.error("Something went wrong");
=======

      // Log the current state for debugging

      if (isPublished) {
        const response = await axios.patch(`/api/module/${moduleId}/unpublish`);

        toast.success("Học Phần Đã Được Thu Hồi");
      } else {
        const response = await axios.patch(`/api/module/${moduleId}/publish`);

        toast.success("Học Phần Đã Được Phát Hành");
      }

      router.refresh();
    } catch (error) {
      // Log the error to understand what went wrong
      toast.error("Đã Có Lỗi Xảy Ra, Vui Lòng Thử Lại Sau");
>>>>>>> 8b13b57 (commit)
    } finally {
      setIsLoading(false);
    }
  };
<<<<<<< HEAD
  
=======
>>>>>>> 8b13b57 (commit)

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/module/${moduleId}`);
<<<<<<< HEAD
      toast.success("Module deleted");
      router.refresh();
      router.push(`/teacher/module/${moduleId}`);
    } catch {
      toast.error("Something went wrong");
=======
      toast.success("Học Phần Đã Được Xóa");
      router.refresh();
      router.push(`/teacher/module/${moduleId}`);
    } catch {
      toast.error("Đã Có Lỗi Xảy Ra, Vui Lòng Thử Lại Sau");
>>>>>>> 8b13b57 (commit)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
<<<<<<< HEAD
        {isPublished ? "Unpublish" : "Publish"}
=======
        {isPublished ? "Thu Hồi" : "Phát Hành"}
>>>>>>> 8b13b57 (commit)
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
