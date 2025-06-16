import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge"

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div>
        <p className="font-medium">
          {label}
        </p>
        <p className="text-gray-500 text-sm">
<<<<<<< HEAD
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
=======
          {numberOfItems} {numberOfItems === 1 ? "Khóa Học" : "Nhiều Khóa Học"}
>>>>>>> 8b13b57 (commit)
        </p>
      </div>
    </div>
  )
}