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
  title = "Xác nhận thực hiện hành động?",
  description = "Hành động này sẽ không thể thu hồi.",
  confirmLabel = "Tiếp tục",
  cancelLabel = "Hủy",
}: ConfirmModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hành động?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn sẽ không thể quay lại sau khi thực hiện.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
