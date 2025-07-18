// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import toast from "react-hot-toast";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormLabel,
//   FormMessage,
//   FormItem,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// function CreatePage() {
//   const formSchema = z.object({
//     title: z.string().min(1, {
//       message: "Title is required",
//     }),
//   });

//   const router = useRouter();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//     },
//   });

//   // const [programList, setProgramList] = useState([]);
//   const { isSubmitting, isValid } = form.formState;
//   // useEffect(() => {
//   //   const fetchProgram = async () => {
//   //     const programs: any = await axios.get("/api/programs");
//   //     // setProgramList(programs);
//   //   };
//   //   // call the function
//   //   fetchProgram()
//   //     // make sure to catch any error
//   //     .catch(console.error);
//   // }, [programList]);

//   const onSubmitCourse = async (values: z.infer<typeof formSchema>) => {

//     const imageUrl = "https://res.cloudinary.com/derjssgq9/image/upload/v1741085512/courseimg_lwaxee.jpg"
//     try {
//       const response = await axios.post("/api/courses", {...values, imageUrl});
//       router.push(`/teacher/courses/${response.data.id}`);
//       toast.success("Course created");
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-60">
//       <div>
//         <>
//           <h1 className="text-2xl">Name your course</h1>
//           <p className="text-sm text-slate-600">
//             What would you like to name your course? Don&apos;t worry, you can
//             change this later.
//           </p>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmitCourse)}
//               className="space-y-8 mt-8"
//             >
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Course title (50 character limit)</FormLabel>
//                     <FormControl>
//                       <Input
//                         disabled={isSubmitting}
//                         maxLength={50}
//                         placeholder="e.g. 'Advanced web development'"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       What will you teach in this course?
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex items-center gap-x-2">
//                 <Link href="/teacher/courses">
//                   <Button type="button" variant="ghost">
//                     Cancel
//                   </Button>
//                 </Link>
//                 <Button type="submit" disabled={!isValid || isSubmitting}>
//                   Continue
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </>
//       </div>
//     </div>
//   );
// }

// export default CreatePage;

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
        message: "Title must follow: Tên khóa học - Đợt X",
      })
      .refine((value: any) => /^[\p{L}\p{N}\s]+ - Đợt \d+$/u.test(value ?? "")),
    type: z.enum(["Mandatory", "Probation", "Self Study"], {
      invalid_type_error: "Course type is required",
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
      toast.success("Khóa học đã được tạo");
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-40">
      <div>
        <h1 className="text-2xl">Đặt tên cho khóa học của bạn</h1>
        <p className="text-sm text-slate-600">
          Bạn muốn đặt tên khóa học là gì? Đừng lo, bạn có thể thay đổi sau.
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
                  <FormLabel>Tiêu đề khóa học (50 character limit)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      maxLength={50}
                      placeholder="[Tên khóa học] - Đợt [số]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Quy trình nào sẽ được đào tạo trong khóa học này?
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
                  <FormLabel>Loại khóa học</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="border rounded-md p-1 w-full "
                    >
                      <option value="Mandatory" title="Yêu cầu thi một lần duy nhất">
                        Bắt buộc
                      </option>
                      <option value="Probation" title="One-time exam required">
                        Thử việc
                      </option>
                      <option value="Self Study" title="Không yêu cầu bài thi">
                        Tự học
                      </option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Lưu ý: Sau khi bạn chọn loại khóa học, bạn sẽ không thể thay đổi lại.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/teacher/courses">
                <Button type="button" variant="ghost">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Tiếp tục
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CreatePage;
