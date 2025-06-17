

"use client";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  Bookmark,
  Eye,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { IconBadge } from "@/components/icon-badge";
import { CourseProgress } from "@/components/course-progress";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
 
interface CourseCardCompleteProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  bookmark: any[];
  // progress: string | null;
  chapters: any;
  isLocked: boolean;
  description: string;
  endDate?: string;
  status?: boolean;
}
 
export const CourseCardComplete = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  bookmark,
  // progress,
  chapters,
  isLocked,
  description,
  endDate,
  status,
}: CourseCardCompleteProps) => {
  const router = useRouter();
 
  const [isUpdating, setIsUpdating] = useState(false);
  const { userId }: any = useAuth();
  const toggleUpdating = () => {
    setIsUpdating((current) => !current);
  };
  const onBookMark = async () => {
    let bookmark = await axios.post(`/api/courses/${id}/bookmark`);
    toggleUpdating();
    router.refresh();
  };
  const onUnBookMark = async () => {
    let unbookmark = await axios.delete(`/api/courses/${id}/bookmark`);
    toggleUpdating();
    router.refresh();
  };
 
  const [isClient, setIsClient] = useState(false); // To detect if it's client-side
  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);
 
  useEffect(() => {
    setIsClient(true); // Set the flag after component mounts
    if (endDate) {
      setFormattedEndDate(new Date(endDate).toLocaleDateString()); // Format the endDate
    }
  }, [endDate]);
 
  return (
    <div className="group relative">
      <div
        className={`group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full relative ${
          isLocked ? "pointer-events-none" : ""
        }`}
      >
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl != null ? imageUrl.replace("public", "") : ""}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500 dark:text-white">
              <IconBadge size="sm" icon={BookOpenCheck} />
              <span>
                {/* {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"} */}
                Has {status ? "Hoàn Thành" : "Trượt"}
              </span>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gray-300 rounded-md mt-1"></div>
          {isClient && (
            <p className="font-small mt-4 text-sky-700 text-xs">
              Khóa Học Sẽ Đóng Vào Lúc 18:00: {formattedEndDate || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
