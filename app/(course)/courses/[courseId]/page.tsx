import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId }: any = auth();
  const checkUser = await db.userPermission.findMany({
    where: {
      userId: userId,
    },
    include: {
      permission: true,
    },
  });
  // if (
  //   checkUser
  //     .map((item: { permission: { title: any } }) => item.permission.title)
  //     .indexOf("Study permission") == -1
  // ) {
  //   return redirect("/");
  // }
  const course: any = await db.course.findUnique({
    where: {
      id: params.courseId,
      modules:{
        some:{
          module:{
            isPublished: true,
          }
        }
      }
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
      ClassSessionRecord: true,
      CourseOnDepartment: true,
    },
  });

  // Log course và module
  // console.log("Course Data: ", course); // Log toàn bộ dữ liệu khóa học

  if (!course || !course.isPublished) {
    return redirect("/");
  }
  if (
    course.ClassSessionRecord.map(
      (item: { userId: any }) => item.userId
    ).indexOf(userId) == -1
  ) {
    return redirect(`/courses/${course.id}/description`);
  }

  let currentPos = 0;
  for (let i = 0; i < course.modules.length; i++) {
    const moduleInCourse = course.modules[i];
    const currentModule = moduleInCourse.module;

    const userProgressIndex = currentModule .UserProgress.map((item: any) => item.userId).indexOf(userId);
    if (userProgressIndex != -1) {
      const userProgress = currentModule .UserProgress[userProgressIndex];
      
      if (userProgress.status === "studying") {
        currentPos = i;
        break;
      } else if (userProgress.status === "finished") {
        currentPos = i;
      }
    }
  }

  return redirect(`/courses/${course.id}/chapters/${course.modules[currentPos].module.id}`);
};

export default CourseIdPage;