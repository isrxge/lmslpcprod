"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
  readOnly?: boolean;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, courseId, readOnly = false }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [selectedFile, setSelectedFile]: any = useState<File | null>(null);

  const toggleEdit = () => !readOnly && setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async () => {
    let getToken = await axios.get("/api/getToken");
    if (initialData.imageUrl != null && initialData.imageUrl != "") {
      await axios.delete(initialData?.imageUrl, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "X-Auth-Token": getToken.data["x-subject-token"],
        },
      });
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_ACCOUNT_URL as string}/Course/${
          initialData.title as string
        }/image/${selectedFile.name as string}`,
        selectedFile,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "*/*",
            "Content-Type": selectedFile.type,
            "X-Auth-Token": getToken.data["x-subject-token"],
          },
        }
      );

      await axios.patch(`/api/courses/${courseId as string}`, {
        imageUrl: `${process.env.NEXT_PUBLIC_ACCOUNT_URL as string}/Course/${
          initialData.title as string
        }/image/${selectedFile.name as string}`,
      });
      toast.success("Khóa học đã được cập nhật");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <div className="flex items-center">
          Ảnh khóa học
          {/* <Asterisk className="size-4" color="red" /> */}
        </div>
        {!readOnly && (
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              {!initialData.imageUrl ? (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Thêm ảnh
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </>
              )}
            </>
          )}
        </Button>
        )}
      </div>
      {!isEditing && (
        <>
          {!initialData.imageUrl ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <Image
                unoptimized
                alt="Upload"
                fill
                className="object-cover rounded-md"
                src={initialData.imageUrl.replace("public", "")}
              />
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div className="mt-4 flex flex-col">
          <div className="flex justify-between mb-2 ">
            <input
              type="file"
              name="myImage"
              onChange={handleFileChange}
              className="dark:text-slate-50"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={() => onSubmit()}
            >
              Lưu
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Khuyến nghị sử dụng tỷ lệ khung hình 16:9
          </div>
        </div>
      )}
    </div>
  );
};
