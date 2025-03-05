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
  const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title is required",
    }),
    type: z.enum(["Slide", "Exam"], {
      invalid_type_error: "Type must be either Slide or Exam", // Corrected message handling
    }),
  });

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "Slide", // Default value for the select
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // const courseId = '21601e8f-eba8-428b-97bd-b6d362c23fae'; // Main LMS

  const onSubmitCourse = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/module/`, values);
      const newModuleId = response.data.id; // Get the id of the created module

      console.log("Navigating to edit page with module id:", newModuleId);
      onEdit(newModuleId);
      toast.success("Module created");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/module/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-60">
      <div>
        <h1 className="text-2xl">Name your module</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your module? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitCourse)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module title (50 character limit)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      maxLength={50}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this module?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Using a standard HTML select for type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Type</FormLabel>
                  <FormControl>
                    <select {...field} disabled={isSubmitting} className="w-full p-2 border rounded-md">
                      <option value="Slide">Slide</option>
                      <option value="Exam">Exam</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Select the type of module.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/teacher/module">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CreatePage;
