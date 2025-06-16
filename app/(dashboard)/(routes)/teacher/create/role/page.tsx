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
  });

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // const [programList, setProgramList] = useState([]);
  const { isSubmitting, isValid } = form.formState;
  // useEffect(() => {
  //   const fetchProgram = async () => {
  //     const programs: any = await axios.get("/api/programs");
  //     // setProgramList(programs);
  //   };
  //   // call the function
  //   fetchProgram()
  //     // make sure to catch any error
  //     .catch(console.error);
  // }, [programList]);
  const onSubmitProgram = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/role", values);
      router.push(`/teacher/roles/${response.data.id}`);
<<<<<<< HEAD
      toast.success("Role created");
    } catch {
      toast.error("Something went wrong");
=======
      toast.success("Vai Trò Đã Được Tạo");
    } catch {
      toast.error("Đã Có Lỗi Xảy Ra, Vui Lòng Thử Lại Sau");
>>>>>>> 8b13b57 (commit)
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-60">
      <div>
        <>
<<<<<<< HEAD
          <h1 className="text-2xl">Name your role</h1>
          <p className="text-sm text-slate-600">
            What would you like to name your Role? Don&apos;t worry, you can
            change this later.
          </p>
=======
          <h1 className="text-2xl">Đặt Tên Vai Trò</h1>
          {/* <p className="text-sm text-slate-600">
            What would you like to name your Role? Don&apos;t worry, you can
            change this later.
          </p> */}
>>>>>>> 8b13b57 (commit)
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitProgram)}
              className="space-y-8 mt-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'ADMIN'"
                        {...field}
                      />
                    </FormControl>
<<<<<<< HEAD
                    <FormDescription>Role name?</FormDescription>
=======
                    <FormDescription>Tên Role?</FormDescription>
>>>>>>> 8b13b57 (commit)
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2">
                <Link href="/teacher/programs">
                  <Button type="button" variant="ghost">
<<<<<<< HEAD
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Continue
=======
                    Từ Chối
                  </Button>
                </Link>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Tiếp Tục
>>>>>>> 8b13b57 (commit)
                </Button>
              </div>
            </form>
          </Form>
        </>
      </div>
    </div>
  );
}

export default CreatePage;
