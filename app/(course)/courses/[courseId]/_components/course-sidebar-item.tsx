"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: string;
  courseId: string;
  // isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  // isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useParams();

  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      // disabled={isLocked}
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted == "finished" && "text-emerald-700 hover:text-emerald-700",
        isCompleted == "finished" && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4  dark:text-gray-50">
        {isCompleted == "finished" ? (
          <CheckCircle
            size={22}
            className={cn(
              "dark:text-gray-50",
              "text-slate-500",
              isActive && "text-slate-700",
              isCompleted && "text-emerald-700"
            )}
          />
        ) : id == searchParams.chapterId || isCompleted == "studying" ? (
          <PlayCircle
            size={22}
            className={cn(
              "dark:text-gray-50",
              "text-slate-500",
              isActive && "text-slate-700",
              isCompleted && "text-emerald-700"
            )}
          />
        ) : (
          <Lock
            size={22}
            className={cn(
              "dark:text-gray-50",
              "text-slate-500",
              isActive && "text-slate-700",
              isCompleted && "text-emerald-700"
            )}
          />
        )}

        <span className="break-words max-w-[200px] text-left">{label}</span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted == "finished" && "border-emerald-700"
        )}
      />
    </button>
  );
};
