"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Asterisk } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface TypeFormProps {
  initialData: {
    type: "Mandatory" | "Probation" | "SelfStudy";
  };
  courseId: string;
}

const formSchema = z.object({
  type: z.enum(["Mandatory", "Probation", "SelfStudy"], {
    invalid_type_error: "Course type is required",
  }),
});

export const TypeForm = ({ initialData, courseId }: TypeFormProps) => {
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
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course type updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <div className="flex items-center">
          Course type
          <Asterisk className="size-4" color="red" />
        </div>

        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit type
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2 dark:text-slate-50">{initialData.type}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* Using a regular HTML <select> */}
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="dark:text-slate-50"
                    >
                      <option value="Mandatory">Mandatory</option>
                      <option value="Probation">Probation</option>
                      <option value="SelfStudy">Self Study</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
