import { BookOpenText } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { useAuth } from "@clerk/nextjs";

interface CoursesListProps {
  title: string;
  items: any[];
}

export const CoursesList = ({ title, items }: CoursesListProps) => {
  const { userId }: any = useAuth();
  return (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <BookOpenText className="mr-2" />
        {title} courses
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={
              item?.ClassSessionRecord.map(
                (item: { userId: any }) => item.userId
              ).indexOf(userId) == -1
                ? "/courselock.jpg"
                : item.imageUrl!
            }
            chapters={item?.modules}
            chaptersLength={item.modules.length}
            bookmark={item.BookMark}
            isLocked={
              item?.ClassSessionRecord.map(
                (item: { userId: any }) => item.userId
              ).indexOf(userId) == -1
                ? true
                : false
            }
            // price={item.price!}
            // progress={item.progress}
            description={item?.description}
            endDate={item?.endDate}
            // category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          Không tìm thấy khóa học nào
        </div>
      )}
    </div>
  );
};
