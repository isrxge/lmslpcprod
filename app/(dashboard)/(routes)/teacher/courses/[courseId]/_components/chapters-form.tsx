"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Asterisk, Loader2, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Module, Course, ModuleInCourse } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
  initialData: any;
  courseId: string;
}

const formSchema = z.object({
  type: z.string().optional(),
});

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  console.log("initialData:", initialData);
  // console.log("ModuleInCourse data:", initialData.modulesInCourse.map((m) => m.module));
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterType, setFilterType] = useState("Slide");
  const [searchKeyword, setSearchKeyword] = useState(""); // Thanh tìm kiếm
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [selectedModules, setSelectedModules] = useState<Module[]>([]); // Lưu trữ các module đã chọn
  const [moduleInCourse, setModuleInCourse] = useState<ModuleInCourse[]>([]);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async () => {
    if (selectedModules.length === 0) {
      toast.error("Please select at least one module");
      return;
    }

    try {
      // Gửi các module đã chọn và courseId tới backend
      await axios.post(`/api/moduleincourse`, {
        modules: selectedModules.map((module) => ({
          moduleId: module.id,
        })),
        courseId: courseId, // Đảm bảo bạn gửi đúng courseId
      });

      toast.success("Modules added to course");
      toggleCreating();
      setSelectedModules([]);
      router.refresh();
    } catch (error) {
      console.error("Error submitting modules:", error);
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };
  // code aP
  // const handleModuleSelect = (module: Module) => {
  //   if (module.type === "Slide") {
  //     // Nếu là Slide, cho phép chọn nhiều module
  //     setSelectedModules((prev) =>
  //       prev.some((m) => m.id === module.id)
  //         ? prev.filter((m) => m.id !== module.id) // Bỏ chọn nếu đã chọn
  //         : [...prev, module] // Chọn thêm nếu chưa chọn
  //     );
  //   } else if (module.type === "Exam") {
  //     // Nếu là Exam, chỉ cho phép chọn một module
  //     setSelectedModules([module]);
  //   }
  // };

  const handleModuleSelect = (module: Module) => {
    if (module.type === "Slide") {
      // Nếu là Slide, cho phép chọn nhiều module
      setSelectedModules((prev) => {
        if (prev.some((m) => m.id === module.id)) {
          // Bỏ chọn module và gọi API xóa
          removeModuleFromCourse(module.id);
          return prev.filter((m) => m.id !== module.id);
        } else {
          return [...prev, module];
        }
      });
    } else if (module.type === "Exam") {
      // Nếu là Exam, chỉ cho phép chọn một module
      setSelectedModules([module]);
      removeModuleFromCourse(module.id); // Xóa module cũ khỏi Course nếu có
    }
  };

  // Hàm gọi API xóa module khỏi ModuleInCourse
  const removeModuleFromCourse = async (moduleId: string) => {
    try {
      await axios.delete(`/api/moduleincourse`, {
        data: {
          moduleId,
          courseId, // Đảm bảo rằng bạn gửi đúng courseId
        },
      });
      toast.success("Module removed from course");
    } catch (error) {
      console.error("Error removing module:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoadingModules(true);
        const response = await axios.get(`/api/module`, {
          params: {
            courseId: courseId,
            search: searchKeyword, // Thêm tham số tìm kiếm
            type: filterType, // Thêm tham số lọc loại module
          },
        });
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching ModuleInCourse:", error);
        toast.error("Failed to load modules");
      } finally {
        setLoadingModules(false);
      }
    };

    if (isCreating) {
      // chỉ fetch khi đang tạo module
      fetchModules();
    }
  }, [isCreating, searchKeyword, filterType, courseId]); // Cập nhật lại khi thay đổi searchKeyword, filterType

  //code aP
  // useEffect(() => {
  //   const fetchModules = async () => {
  //     try {
  //       const response = await axios.get(`/api/module`, {
  //         params: { courseId: courseId }
  //       });
  //       console.log(response.data)
  //       // console.log("ModulesInCourse data:", response.data); // In dữ liệu trả về
  //       setModules(response.data);
  //     } catch (error) {
  //       console.error("Error fetching ModuleInCourse:", error);
  //       toast.error("Failed to load modules");
  //     }
  //   };

  //   if (!isCreating) {
  //     fetchModules();
  //   }
  // }, [isCreating, courseId]);  // Chạy lại khi courseId thay đổi

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-950 ">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between text-black dark:text-slate-50">
        <div className="flex items-center">
          Course chapters <Asterisk className="size-4" color="red" />
        </div>
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Find module
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <div>
          {/* Drop-down để chọn loại module */}
          <div className="flex items-center mt-4">
            <select
              onChange={(e) => setFilterType(e.target.value)}
              name="type"
              className="mr-4 p-2 border rounded-md"
            >
              <option value="Slide">Slide</option>
              <option value="Exam">Exam</option>
            </select>

            {/* Thanh tìm kiếm */}
            <input
              type="text"
              placeholder="Search modules"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {isCreating && !loadingModules && modules.length > 0 && (
            <div className="mt-4">
              <h5>Available Modules</h5>
              <div className="overflow-y-auto max-h-72">
                <ul>
                  {modules.map((module: any) => (
                    <li
                      key={module.id}
                      onClick={() => handleModuleSelect(module)}
                      className={`cursor-pointer p-2 border rounded-md mb-2 ${
                        selectedModules.some((m) => m.id === module.id)
                          ? "bg-blue-500 text-white"
                          : ""
                      }`}
                    >
                      {module.title} ({module.type})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {isCreating && loadingModules && (
            <Loader2 className="animate-spin h-5 w-5 text-sky-700" />
          )}

          {/* Chuyển nút submit xuống dưới cùng */}
          <div className="mt-4">
            <Button disabled={isSubmitting} onClick={onSubmit}>
              Submit
            </Button>
          </div>
        </div>
      )}

      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.modules.length && "text-slate-500 italic"
          )}
        >
          {!initialData.modules.length && "No chapters"}
          <ChaptersList items={initialData.modules} onReorder={onReorder} />
        </div>
      )}

      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
