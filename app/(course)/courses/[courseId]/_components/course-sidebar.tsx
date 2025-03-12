import { auth } from "@clerk/nextjs";
import { Course, ModuleInCourse, Module, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { db } from "@/lib/db";

interface CourseSidebarProps {
  course: Course & {
    modules: (ModuleInCourse & {
      module: Module & {
        userProgress: UserProgress[] | null; // Chỉnh sửa từ UserProgress thành userProgress
      };
    })[];
  };
  progressCount: number;
  isLocked: boolean;
}

export const CourseSidebar = async (
  { course, progressCount, isLocked }: CourseSidebarProps,
  params: {
    chapterId: any;
    params?: { chapterId: string };
  }
) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // Console log to check userProgress and module data
  console.log("User ID:", userId);
  console.log("Course Data:", course);

  return (
    <div className="h-full w-80 border-r flex flex-col overflow-y-auto bg-white dark:bg-slate-950 shadow-sm">
      <div className="p-7 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
      </div>
      <div className="flex flex-col w-full dark:text-gray-50">
        {isLocked ? (
          <></>
        ) : (
          course.modules.map((moduleInCourse, index) => {
            const currentModule  = moduleInCourse.module;
            const userProgress = currentModule .userProgress; // Sửa lại từ UserProgress thành userProgress

            // Log user progress and module for each iteration
            console.log("Module:", module); // Log current module data
            console.log("User Progress:", userProgress); // Log user progress data

            // Lấy trạng thái hoàn thành của module (nếu có)
            const isCompleted = userProgress?.[0]?.status ?? "studying";

            return (
              <CourseSidebarItem
                key={currentModule.id}
                id={currentModule.id}
                label={currentModule.title} // Hiển thị tiêu đề của module
                isCompleted={isCompleted} // Truyền trạng thái hoàn thành vào component
                courseId={course.id}
                // isLocked={
                //   (course.modules[index - 1]?.module.userProgress?.[0]?.status !==
                //     "finished" && index > 0) ||
                //   module.id == params?.chapterId
                //     ? true
                //     : false
                // }
              />
            );
          })
        )}
      </div>
    </div>
  );
};
