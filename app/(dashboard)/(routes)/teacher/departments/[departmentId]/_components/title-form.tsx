"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Asterisk, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  departmentId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
<<<<<<< HEAD
    message: "Title is required",
=======
    message: "Vui Lòng Nhập Tên Phòng Ban",
>>>>>>> 8b13b57 (commit)
  }),
});

export const TitleForm = ({ initialData, departmentId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/departments/${departmentId}`, values);
<<<<<<< HEAD
      toast.success("Department updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
=======
      toast.success("Cập Nhật Phòng Ban Thành Công");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại Sau");
>>>>>>> 8b13b57 (commit)
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <div className="flex items-center">
<<<<<<< HEAD
          Permission title <Asterisk className="size-4" color="red" />
=======
          Tên Phòng Ban <Asterisk className="size-4" color="red" />
>>>>>>> 8b13b57 (commit)
        </div>

        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
<<<<<<< HEAD
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
=======
            <>Từ Chối</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh Sửa
>>>>>>> 8b13b57 (commit)
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="dark:text-slate-50"
                      disabled={isSubmitting}
                      placeholder="e.g. 'Create course permission'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
<<<<<<< HEAD
                Save
=======
                Lưu
>>>>>>> 8b13b57 (commit)
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
