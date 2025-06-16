import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

export async function GET(
  req: Request,
  { params }: { params: { title: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const department: any = await db.department.findUnique({
      where: { title: params.title },
      include: {
        CourseOnDepartment: {
          include: {
            course: {
              include: {
                ClassSessionRecord: true,
                modules:{
                  include: {
                    module:true
                  }
                }
              },
            },
          },
        },
      },
    });
<<<<<<< HEAD
    // console.log(department)
    const coursesWithProgress: any = await Promise.all(
      department.CourseOnDepartment.map(async (course: any) => {
        
        

        return {
          ...course,
=======
    const coursesWithProgress: any = await Promise.all(
      department.CourseOnDepartment.map(async (course: any) => {
        console.log(course)
        const progressPercentage = await getProgress(userId, course.course.id);

        return {
          ...course,
          progress: progressPercentage,
>>>>>>> 8b13b57 (commit)
        };
      })
    );
    // console.log(coursesWithProgress);
    let newList = [];
    for (let i = 0; i < coursesWithProgress.length; i++) {
<<<<<<< HEAD
      if(coursesWithProgress[i].course != null){
        newList.push(coursesWithProgress[i].course);
      }
      
=======
      coursesWithProgress[i].course["progress"] =
        coursesWithProgress[i].progress;
      newList.push(coursesWithProgress[i].course);
>>>>>>> 8b13b57 (commit)
    }
    return NextResponse.json(newList);
  } catch (error) {
    console.log("DEPARTMENT ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
