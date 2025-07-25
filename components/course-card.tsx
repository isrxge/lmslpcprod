"use client";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, BookOpenText, Bookmark, Eye, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { IconBadge } from "@/components/icon-badge";
import { CourseProgress } from "@/components/course-progress";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  bookmark: any[];
  // progress: string | null;
  chapters: any;
  isLocked: boolean;
  description: string;
  endDate?: string
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  bookmark,
  // progress,
  chapters,
  isLocked,
  description,
  endDate
}: CourseCardProps) => {
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

  const [isClient, setIsClient] = useState(false);  // To detect if it's client-side
  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);  // Set the flag after component mounts
    if (endDate) {
      setFormattedEndDate(new Date(endDate).toLocaleDateString());  // Format the endDate
    }
  }, [endDate]);

  return (
    <div className="group relative">
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full relative">
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
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gray-300 rounded-md mt-1"></div>
          {isClient && (
          <p className="font-small mt-4 text-sky-700 text-xs">
            Khóa học kết thúc lúc 18:00: {formattedEndDate || "N/A"}
          </p>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          {isLocked ? (
            <Link href={`/courses/${id}`}>
              <button className="bg-gradient-to-r from-pink-600 to-red-700 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition">
                <Eye />
              </button>
            </Link>
          ) : (
            <Link href={`/courses/${id}`}>
              <button className="bg-gradient-to-r from-pink-600 to-red-700 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition">
                <BookOpenText />
              </button>
            </Link>
          )}

          {bookmark?.filter(
            (item) => item.courseId == id && item.userId == userId
          ).length > 0 ? (
            <button
              onClick={onUnBookMark}
              className="bg-gradient-to-r from-pink-600 to-red-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              <Bookmark />
            </button>
          ) : (
            <button
              onClick={onBookMark}
              className="bg-gradient-to-r from-white to-gray-500 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              <Bookmark />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
