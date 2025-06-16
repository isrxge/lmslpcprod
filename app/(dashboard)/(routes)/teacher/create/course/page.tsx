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
<<<<<<< HEAD
    title: z
      .string()
      .min(1, {
        message: "Title must follow: Tên khóa học - Đợt X",
      })
      .refine((value: any) => /^[\p{L}\p{N}\s]+ - Đợt \d+$/u.test(value ?? "")),
    type: z.enum(["Mandatory", "Probation", "Self Study"], {
      invalid_type_error: "Course type is required",
=======
    title: z.string().min(1, {
      message: "Title is required",
    }),
    type: z.enum(["Mandatory", "Probation", "Self Study"], {
      invalid_type_error: "Vui Lòng Chọn Loại Khóa Học",
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
    // Get today's date in DD/MM/YYYY format
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const today = `${dd}/${mm}/${yyyy}`;

    // Append date automatically
    const fullTitle = `${values.title.trim()} - ${today}`;

=======
>>>>>>> 8b13b57 (commit)
    const imageUrl =
      "https://res.cloudinary.com/derjssgq9/image/upload/v1741085512/courseimg_lwaxee.jpg";
    try {
      const response = await axios.post("/api/courses", {
<<<<<<< HEAD
        title: fullTitle,
        type: values.type,
        imageUrl,
        status: "open",
      });
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course created");
    } catch {
      toast.error("Something went wrong");
=======
        ...values,
        imageUrl,
      });
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Khóa Học Đã Được Tạo");
    } catch {
      toast.error("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại Sau");
>>>>>>> 8b13b57 (commit)
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-40">
      <div>
<<<<<<< HEAD
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
=======
        <h1 className="text-2xl">Tạo Khóa Học</h1>
        <p className="text-sm text-slate-600">
          Hãy Đặt Tên Cho Khóa Học. change this later.
>>>>>>> 8b13b57 (commit)
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitCourse)}
<<<<<<< HEAD
            className="space-y-4 mt-8"
=======
            className="space-y-8 mt-8"
>>>>>>> 8b13b57 (commit)
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel>Course title (50 character limit)</FormLabel>
=======
                  <FormLabel>Tên Khóa Học (Giới Hạn 50 Ký Tự)</FormLabel>
>>>>>>> 8b13b57 (commit)
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      maxLength={50}
<<<<<<< HEAD
                      placeholder="[Tên khóa học] - Đợt [số]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
=======
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Mô Tả Khóa Học</FormDescription>
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
                  <FormLabel>Course Type</FormLabel>
=======
                  <FormLabel>Loại Khóa Học</FormLabel>
>>>>>>> 8b13b57 (commit)
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="border rounded-md p-1 w-full "
                    >
                      <option value="Mandatory" title="One-time exam required">
<<<<<<< HEAD
                        Mandatory
                      </option>
                      <option value="Probation" title="One-time exam required">
                        Probation
                      </option>
                      <option value="Self Study" title="No exam required">
                        Self Study
                      </option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Note: Once you choose a course type, you will not be able
                    to change it.
                  </FormDescription>
=======
                        Bắt Buộc (Dành Cho NV Chính Thức)
                      </option>
                      <option value="Probation" title="Two-time exam required">
                        Thử Việc (Dành Cho NV Thử Việc)
                      </option>
                      <option value="Self Study" title="No exam required">
                        Tự Học (Khóa Học Không Bài Kiểm Tra Cho NV)
                      </option>
                    </select>
                  </FormControl>
>>>>>>> 8b13b57 (commit)
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/teacher/courses">
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
      </div>
    </div>
  );
}

export default CreatePage;
