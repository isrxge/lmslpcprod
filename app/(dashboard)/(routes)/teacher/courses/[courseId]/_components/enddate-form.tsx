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
    notifyDate: number | null;
  };
  courseId: string;
  readOnly?: boolean;
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

export const EndDateForm = ({ initialData, courseId, readOnly = false }: EndDateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notifyDate, setNotifyDate] = useState<number | null>(initialData.notifyDate || 0);
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(initialData.notifyDate !== 0);
  const [isEndDateValid, setIsEndDateValid] = useState(true);
  const [isNotifyDateValid, setIsNotifyDateValid] = useState(true);

  const toggleEdit = () => !readOnly && setIsEditing((current) => !current);

  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting} = form.formState;

  // Get the reset method directly from the useForm hook
  const { reset, setValue, getValues } = form;

  const validateEndDate = (date: string) => {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime()) && parsedDate > new Date()) {
      setIsEndDateValid(true);
    } else {
      setIsEndDateValid(false);
    }
  };

  const validateNotifyDate = (value: number | null) => {
    if (value && value > 0 && value <= 5) {
      setIsNotifyDateValid(true);
    } else {
      setIsNotifyDateValid(false);
    }
  };

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

      await axios.patch(`/api/courses/${courseId}`, { endDate: utcEndDate.toISOString(), notifyDate: isNotifyEnabled ? notifyDate : 0 });
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
      validateEndDate(initialData.endDate);
      // setFormattedEndDate(new Date(initialData.endDate).toLocaleDateString());
    }
  }, [initialData.endDate]);

  useEffect(() => {
    // Cập nhật trạng thái hợp lệ khi notifyDate thay đổi
    validateNotifyDate(notifyDate);
  }, [notifyDate]);

  const isSaveButtonEnabled = isEndDateValid && (isNotifyEnabled ? isNotifyDateValid : true);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <div className="flex items-center">
          End Date
          {/* <Asterisk className="size-4" color="red" /> */}
        </div>
        {!readOnly && (
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
        )}
      </div>
      {!isEditing && formattedEndDate && (
        <p className="text-sm mt-2 dark:text-slate-50">{formattedEndDate}</p>
      )}
      {isNotifyEnabled && notifyDate && (
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  You have set a reminder for <strong>{notifyDate} days</strong> before the course end date.
                </p>
              </div>
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
                        validateEndDate(date.toISOString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isNotifyEnabled}
                onChange={() => setIsNotifyEnabled(!isNotifyEnabled)}
                className="h-4 w-4"
              />
              <label className="text-sm">Enable Reminder Notification</label>
            </div>

            {isNotifyEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Reminder Date (in days)</label>
                <select
                  value={notifyDate || ''}
                  onChange={(e) => setNotifyDate(Number(e.target.value))}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">Select a reminder date</option>
                  {[1, 2, 3, 4, 5].map((days) => (
                    <option key={days} value={days}>
                      {days} days before
                    </option>
                  ))}
                </select>
              </div>
            )}

            

            <div className="flex items-center gap-x-2">
              <Button disabled={!isSaveButtonEnabled  || isSubmitting} type="submit">
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
