"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Module } from "@prisma/client";

import { Button } from "@/components/ui/button";

interface ChapterAccessFormProps {
  initialData: Module;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   isFree: !!initialData.isFree
    // },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Học Phần Đã Được Cập Nhật");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại Sau");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter access
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Từ Chối</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh Sửa
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
