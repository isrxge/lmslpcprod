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
  
      // Log the current state for debugging
      console.log(`Module ID: ${moduleId}, Is Published: ${isPublished}`);
  
      if (isPublished) {
        console.log('Unpublishing module...');
        const response = await axios.patch(`/api/module/${moduleId}/unpublish`);
        console.log('Unpublish Response:', response); // Log the response
        toast.success("Module unpublished");
      } else {
        console.log('Publishing module...');
        const response = await axios.patch(`/api/module/${moduleId}/publish`);
        console.log('Publish Response:', response); // Log the response
        toast.success("Module published");
      }
  
      router.refresh();
    } catch (error) {
      // Log the error to understand what went wrong
      console.log('Error while publishing/unpublishing:', error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/module/${moduleId}`);
      toast.success("Module deleted");
      router.refresh();
      router.push(`/teacher/module/${moduleId}`);
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
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
