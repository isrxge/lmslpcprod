"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Asterisk } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";  // Ensure this is working as expected

interface EndDateFormProps {
  initialData: {
    endDate: string; // End Date as a string, might need conversion
  };
  courseId: string;
}
const timeZone = 'Asia/Ho_Chi_Minh';
const formSchema = z.object({
  endDate: z.string().min(1, {
    message: "End Date is required",
  }).refine((val) => {
    // Check if it's a valid date
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime());
  }, {
    message: "Please provide a valid date",
  }),
});

export const EndDateForm = ({ initialData, courseId }: EndDateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  // Get the reset method directly from the useForm hook
  const { reset } = form;

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     await axios.patch(`/api/courses/${courseId}`, { endDate: values.endDate });
  //     toast.success("End Date updated");
  //     toggleEdit();
  //     router.refresh();
  //   } catch {
  //     toast.error("Something went wrong");
  //   }
  // };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert endDate to UTC+7 before sending it to the server
      const utcEndDate = new Date(values.endDate);
      utcEndDate.setHours(utcEndDate.getHours() + 7); // Convert to UTC+7

      await axios.patch(`/api/courses/${courseId}`, { endDate: utcEndDate.toISOString() });
      toast.success("End Date updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    reset(initialData); // Reset form to initial data when canceling
    toggleEdit();
  };

  // Calculate tomorrow's date to be used as the start date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow
  useEffect(() => {
    if (initialData.endDate) {
      const formattedDate = new Date(initialData.endDate);
    // Chuyển ngày sang múi giờ Hà Nội và định dạng chỉ lấy ngày, tháng, năm
    const formattedEndDate = formattedDate.toLocaleDateString("en-GB", {
      timeZone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
      setFormattedEndDate(formattedEndDate);
      // setFormattedEndDate(new Date(initialData.endDate).toLocaleDateString());
    }
  }, [initialData.endDate]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <div className="flex items-center">
          End Date
          {/* <Asterisk className="size-4" color="red" /> */}
        </div>

        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit End Date
            </>
          )}
        </Button>
      </div>
      {!isEditing && formattedEndDate && (
        <p className="text-sm mt-2 dark:text-slate-50">{formattedEndDate}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Calendar
                      selected={field.value ? new Date(field.value) : undefined}
                      fromDate={tomorrow}
                      onDayClick={(date) => {
                        field.onChange(date.toISOString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
