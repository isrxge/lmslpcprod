import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CourseNotAvailable() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6 dark:bg-slate-900">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <AlertTriangle className="text-red-600 w-8 h-8" />
      </div>

      <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
        Khóa học không khả dụng
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-md">
        Khóa học bạn đang tìm kiếm có thể đã bị xóa, chưa được công khai
        hoặc đường dẫn không chính xác.
      </p>

      <Link href="/" className="mt-6">
        <Button className="px-6 py-2">Quay lại trang chủ</Button>
      </Link>
    </div>
  );
}
