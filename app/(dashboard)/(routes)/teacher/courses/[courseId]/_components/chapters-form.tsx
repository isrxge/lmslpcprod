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
import { Reorder } from "framer-motion";

interface ChaptersFormProps {
  initialData: any;
  courseId: string;
  courseType: string;
  readOnly?: boolean;
}

const formSchema = z.object({
  type: z.string().optional(),
});

export const ChaptersForm = ({
  initialData,
  courseId,
  courseType,
  readOnly = false
}: ChaptersFormProps) => {
  // console.log("initialData:", initialData);
  // console.log("ModuleInCourse data:", initialData.modulesInCourse.map((m) => m.module));
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterType, setFilterType] = useState("Slide");
  const [searchKeyword, setSearchKeyword] = useState(""); // Thanh tìm kiếm
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [moduleInCourse, setModuleInCourse] = useState<Module[]>(
    initialData.modules || []
  );
  const flatArray1 = moduleInCourse.map(
    (item: any) => (item.module.position = item.position)
  );
  // console.log("ModuleInCourse data flatArray1:", flatArray1); // In dữ liệu trả về
  const flatArray2 = moduleInCourse
    .map((item: any) => item.module)
    .sort((a: any, b: any) => a.position - b.position);
  // console.log("ModuleInCourse data flatArray2:", flatArray2); // In dữ liệu trả về
  const [selectedModules, setSelectedModules] = useState<Module[]>(
    flatArray2 || []
  ); // Lưu trữ các module đã chọn
  // console.log(selectedModules);
  const toggleCreating = () => { !readOnly && setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
    },
  });

  const filterModules = () => {
    let filters: any = {
      type: "Slide", // Default to show Slide modules
    };

    if (courseType === "Mandatory" || courseType === "Probation") {
      // For Mandatory and Probation, show Slide and Exam
      filters.type = "Slide,Exam";

      // For Mandatory: Exam modules where maxAttempt = 1
      if (courseType === "Mandatory") {
        filters.maxAttempt = 1;
      }

      // For Probation: Exam modules where maxAttempt = 2
      if (courseType === "Probation") {
        filters.maxAttempt = 2;
      }
    }

    return filters;
  };

  const { isSubmitting } = form.formState;

  const onSubmit = async () => {
    if (selectedModules.length === 0) {
      toast.error("Vui lòng chọn ít nhất một học phần");
      return;
    }

    try {
      // Gửi các module đã chọn và courseId tới backend
      // await axios.post(`/api/moduleincourse`, {
      //   modules: selectedModules.map((module) => ({
      //     moduleId: module.id,
      //   })),
      //   courseId: courseId, // Đảm bảo bạn gửi đúng courseId
      // });

      // toast.success("Modules added to course");
      // toggleCreating();
      // setSelectedModules([]);
      // router.refresh();
      // Gửi các module đã chọn và courseId tới backend

      // await axios.post(`/api/moduleincourse`, {
      //   modules: selectedModules.map((module) => ({
      //     moduleId: module.id,
      //     position: module.position,
      //   })),
      //   courseId: courseId, // Đảm bảo bạn gửi đúng courseId
      // });

      await axios.post(`/api/moduleincourse`, {
        modules: selectedModules.map((module: any) => {
          // console.log("Module Position:", module.positionmodule); // Log vị trí của mỗi module
          return {
            moduleId: module.id,
            position: module.positionmodule || module.position,
            type: module.type,
          };
        }),
        courseId: courseId, // Đảm bảo bạn gửi đúng courseId
      });

      toast.success("Học phần đã được thêm vào khóa học");
      toggleCreating();
      //setSelectedModules([]);
      window.location.reload(); // Tải lại trang để cập nhật danh sách module
      router.refresh();
    } catch (error) {
      console.error("Error submitting modules:", error);
      toast.error("Đã xảy ra lỗi");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Thứ tự học phần đã được cập nhật");
      // window.location.reload();
      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
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

  //code 23/4
  const handleModuleSelect = (module: any) => {
    if (module.type === "Slide") {
      // Nếu là Slide, cho phép chọn nhiều module
      setSelectedModules((prev: any) => {
        if (prev.some((m: { id: any }) => m.id === module.id)) {
          // Bỏ chọn module và gọi API xóa
          removeModuleFromCourse(module.id);
          return prev.filter((m: { id: any }) => m.id !== module.id);
        } else {
          const alreadyHasExam = prev.findIndex(
            (m: { type: string }) => m.type === "Exam"
          );
          module["positionmodule"] = selectedModules.length;

          // console.log("Số lượng sau khi thêm:", selectedModules.length);
          return [...prev, module];
        }
      });
    } 
    //code cũ 4/7
    // else if (module.type === "Exam") {
    //   // Nếu là Exam, chỉ cho phép chọn một module
    //   // setSelectedModules([module]);
    //   // removeModuleFromCourse(module.id); // Xóa module cũ khỏi Course nếu có
    //   setSelectedModules((prev: any) => {
    //     // Có exam cũ không?
    //     const alreadyHasExam = prev.findIndex(
    //       (m: { type: string }) => m.type === "Exam"
    //     );
    //     // Tùy logic, bạn có thể xóa exam cũ ra khỏi danh sách
    //     if (alreadyHasExam !== -1) {
    //       if (prev.some((m: { id: any }) => m.id === module.id)) {
    //         // Bỏ chọn module và gọi API xóa
    //         removeModuleFromCourse(module.id);
    //         return prev.filter((m: { id: any }) => m.id !== module.id);
    //       } else {
    //         alert("Bạn chỉ được chọn 1 bài thi trong khóa học này!");
    //         return prev;
    //       }
    //     } else {
    //       module["positionmodule"] = selectedModules.length;
    //       // console.log("Số lượng sau khi thêm:", selectedModules.length);
    //       return [...prev, module];
    //     }
    //   });
    // }
    // code mới 4/7
    else if (module.type === "Exam") {
  setSelectedModules((prev: any) => {
    // Tìm vị trí Exam cũ (nếu có)
    const oldExamIndex = prev.findIndex(
      (m: { type: string }) => m.type === "Exam"
    );

    let newModules = [...prev];

    // Nếu đã có bài thi cũ, thì xóa nó ra và gọi API
    if (oldExamIndex !== -1) {
      const oldExamId = newModules[oldExamIndex].id;
      removeModuleFromCourse(oldExamId); // Gọi API xóa module cũ
      newModules.splice(oldExamIndex, 1); // Xóa khỏi danh sách
    }

    // Kiểm tra nếu module mới đã có trong danh sách (tránh thêm trùng)
    const alreadySelected = newModules.some(
      (m: { id: any }) => m.id === module.id
    );
    if (!alreadySelected) {
      newModules.push(module);
    }

    return newModules;
  });
}

  };

  // const handleModuleSelect = (module: any) => {
  //   if (module.type === "Slide") {
  //     // Nếu là Slide, cho phép chọn nhiều module
  //     setSelectedModules((prev) => {
  //       if (prev.some((m) => m.id === module.id)) {
  //         // Bỏ chọn module và gọi API xóa
  //         removeModuleFromCourse(module.id);
  //         return prev.filter((m) => m.id !== module.id);
  //       } else {
  //         let checkIfExamExist = selectedModules.indexOf((item: { type: string; })=> item.type === "Exam");
  //         if (checkIfExamExist !== -1) {
  //           module["positionmodule"] = selectedModules.length -1;
  //         }else{
  //           module["positionmodule"] = selectedModules.length;
  //         }
  //         console.log("Số lượng sau khi thêm:", selectedModules.length);
  //         return [...prev, module];
  //       }
  //     });
  //   } else if (module.type === "Exam") {
  //     // Nếu là Exam, chỉ cho phép chọn một module
  //     // setSelectedModules([module]);
  //     // removeModuleFromCourse(module.id); // Xóa module cũ khỏi Course nếu có
  //     setSelectedModules((prev) => {
  //       // Có exam cũ không?
  //       const alreadyHasExam = prev.findIndex((m) => m.type === "Exam");
  //       // Tùy logic, bạn có thể xóa exam cũ ra khỏi danh sách
  //       if (alreadyHasExam !== -1) {
  //         removeModuleFromCourse(prev[alreadyHasExam].id);
  //         prev.splice(alreadyHasExam, 1);
  //       }

  //       // Gán position = cuối mảng
  //       module["positionmodule"] = selectedModules.length;
  //       removeModuleFromCourse(module.id);

  //       // Thêm module exam mới
  //       return [...prev, module];
  //     });
  //   }
  // };

  // Hàm gọi API xóa module khỏi ModuleInCourse
  const removeModuleFromCourse = async (moduleId: string) => {
    try {
      await axios.delete(`/api/moduleincourse`, {
        data: {
          moduleId,
          courseId, // Đảm bảo rằng bạn gửi đúng courseId
        },
      });
      // setSelectedModules([]);
      toast.success("Học phần đã được xóa khỏi khóa học");
      // window.location.reload();
      router.refresh();
    } catch (error) {
      console.error("Error removing module:", error);
      // toast.success("Unselect this module");
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoadingModules(true);

        const filters = filterModules(); // code filter theo module

        const response = await axios.get(`/api/module`, {
          params: {
            courseId: courseId,
            search: searchKeyword, // Thêm tham số tìm kiếm
            type: filterType, // Thêm tham số lọc loại module
            maxAttempt: filters.maxAttempt, // code filter theo module
          },
        });
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching ModuleInCourse:", error);
        toast.error("Không thể tải học phần");
      } finally {
        setLoadingModules(false);
      }
    };

    if (isCreating) {
      // chỉ fetch khi đang tạo module
      fetchModules();
    }
  }, [isCreating, searchKeyword, filterType, courseId, courseType]); // Cập nhật lại khi thay đổi searchKeyword, filterType

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
          Học phần <Asterisk className="size-4" color="red" />
        </div>
        {!readOnly && (
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Hủy</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tìm học phần
            </>
          )}
        </Button>
        )}
      </div>

      {isCreating && (
        <div>
          {/* Drop-down để chọn loại module */}
          <div className="flex items-center mt-4">
            <select
              onChange={(e) => setFilterType(e.target.value)}
              name="type"
              className="mr-4 p-2 border rounded-md"
              disabled={courseType === "Self Study"}
            >
              <option value="Slide">Bài giảng</option>
              {courseType !== "Self Study" && (
                <option value="Exam">Bài kiểm tra</option>
              )}
            </select>

            {/* Thanh tìm kiếm */}
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {isCreating && !loadingModules && modules.length > 0 && (
            <div className="mt-4">
              <h5>Học phần có sẵn</h5>
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
              Lưu
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
          {!initialData.modules.length && "Không có học phần nào."}
          <ChaptersList
            items={selectedModules}
            onReorder={onReorder}
            courseId={courseId}
            readOnly={readOnly}
       />
        </div>
      )}

      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Kéo và thả để sắp xếp lại học phần
        </p>
      )}
    </div>
  );
};
