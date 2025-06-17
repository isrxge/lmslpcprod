"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CreatePage() {
  // Extend the form schema to include "type" for course type
  const formSchema = z.object({
    title: z
      .string()
      .min(1, {
        message: "Tên Khóa Học Phải Đảm Bảo: Tên khóa học - Đợt X",
      })
      .refine((value: any) => /^[\p{L}\p{N}\s]+ - Đợt \d+$/u.test(value ?? "")),
    type: z.enum(["Mandatory", "Probation", "Self Study"], {
      invalid_type_error: "Vui Lòng Chọn Loại Khóa Học",
    }),
  });

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "Mandatory", // Default course type
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmitCourse = async (values: z.infer<typeof formSchema>) => {
    // Get today's date in DD/MM/YYYY format
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const today = `${dd}/${mm}/${yyyy}`;

    // Append date automatically
    const fullTitle = `${values.title.trim()} - ${today}`;

    const imageUrl =
      "https://res.cloudinary.com/derjssgq9/image/upload/v1741085512/courseimg_lwaxee.jpg";
    try {
      const response = await axios.post("/api/courses", {
        title: fullTitle,
        type: values.type,
        imageUrl,
        status: "open",
      });
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Khóa Học Đã Được Tạo");
    } catch {
      toast.error("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại Sau");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-40">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
        Hãy Đặt Tên Cho Khóa Học. change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitCourse)}
            className="space-y-4 mt-8"
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Khóa Học (Giới Hạn 50 Ký Tự)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      maxLength={50}
                      placeholder="[Tên khóa học] - Đợt [số]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                  Mô Tả Khóa Học
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại Khóa Học</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="border rounded-md p-1 w-full "
                    >
                      <option value="Mandatory" title="One-time exam required">
                        Bắt Buộc (Dành Cho NV Chính Thức)
                      </option>
                      <option value="Probation" title="One-time exam required">
                        Thử Việc (Dành Cho NV Thử Việc)
                      </option>
                      <option value="Self Study" title="No exam required">
                      Tự Học (Khóa Học Không Bài Kiểm Tra Cho NV)
                      </option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Lưu Ý: Loại Khóa Học Sau Khi Chọn Sẽ Không Thể Chỉnh Sửa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/teacher/courses">
                <Button type="button" variant="ghost">
                  Từ Chối
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Tiếp Tục
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CreatePage;
