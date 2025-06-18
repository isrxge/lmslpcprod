"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
   title?: string;
  /** Mô tả ngắn (mặc định “This action cannot be undone.”) */
  description?: string;
  /** Nhãn nút xác nhận (mặc định “Continue”) */
  confirmLabel?: string;
  /** Nhãn nút hủy (mặc định “Cancel”) */
  cancelLabel?: string;
};

export const ConfirmModal = ({
  children,
  onConfirm,
  title = "Xác Nhận Thực Hiện Hành Động ?",
  description = "Hành Động Này Sẽ Không Thể Thu Hồi.",
  confirmLabel = "Tiếp Tục",
  cancelLabel = "Từ Chối",
}: ConfirmModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác Nhận Thực Hiện Hành Động ?</AlertDialogTitle>
          <AlertDialogDescription>
          Hành Động Này Sẽ Không Thể Thu Hồi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
          Tiếp Tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
