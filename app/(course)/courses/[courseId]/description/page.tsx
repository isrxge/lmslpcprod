import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CourseDescriptionPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const course: any = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      modules: {
        // where: {
        //   isPublished: true,
        // },
        include: {
          module: {
            include: {
              UserProgress: {
                where: {
                  userId,
                },
              },
            },
          }
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="p-10">
      <Link
        href="javascript:history.back()"
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Link>
      <h1 className="text-4xl font-bold">{course.title}</h1>

      <div className="border border-blue-800 border-l-8 shadow-lg rounded-lg mt-8 mb-8">
        <h5 className="text-2xl font-bold p-5">Tổng quan</h5>
        <div
          className="px-5 py-3 mb-3"
          dangerouslySetInnerHTML={{ __html: course.description }}
        ></div>
      </div>

      <div className="border border-blue-800 border-l-8 shadow-lg rounded-lg mt-8 mb-8">
        <h5 className="text-2xl font-bold p-5">Học phần</h5>
        <ul className="list-disc ml-5 mr-5 mb-8">
          {course.modules.map((moduleInCourse: any) => (
            <li
              key={moduleInCourse.module.id}
              className="text-gray-700 text-base ml-3 dark:text-white mb-2"
            >
              {moduleInCourse.module.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDescriptionPage;
