"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

export const ReportModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Gán email người dùng mặc định (ẩn)
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  // Reset mọi thứ khi đóng popup
  useEffect(() => {
    if (!open) {
      setMessage("");
      setFiles([]);
      setLoading(false);
    }
  }, [open]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => {
        const combined = [...prev, ...acceptedFiles];
        if (combined.length > 6) {
          toast.error("Tối đa chỉ được gửi 6 ảnh.");
          return combined.slice(0, 6);
        }
        return combined;
      });
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  const handleRemove = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleSubmit = async () => {
    if (!message) {
      toast.error("Vui lòng nhập nội dung góp ý hoặc báo lỗi");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("message", message);
      files.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("/api/report", formData);

      toast.success("Gửi phản hồi thành công!");
      onClose(); // popup tự đóng và tự reset qua useEffect
    } catch {
      toast.error("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle>Góp ý & Báo lỗi hệ thống</DialogTitle>
        </DialogHeader>

        <Textarea
          className="min-h-[180px]"
          placeholder="Nhập góp ý hoặc mô tả lỗi bạn gặp phải..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Drag-and-drop khu vực */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-gray-500">
            Kéo và thả ảnh vào đây hoặc nhấp để chọn (tối đa 6 ảnh)
          </p>
        </div>

        {/* Hiển thị ảnh đã chọn */}
        {files.length > 0 && (
          <div className="max-h-56 overflow-y-auto pr-1 mt-2">
            <div className="grid grid-cols-3 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover rounded shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-0 text-xs hidden group-hover:block"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi phản hồi"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
