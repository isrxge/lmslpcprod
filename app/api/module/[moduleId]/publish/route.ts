import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const ownCourse = await db.course.findUnique({
    //   where: {
    //     id: params.courseId,
    //     userId,
    //   },
    // });

    // if (!ownCourse) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const moduleData = await db.module.findUnique({
      where: {
        id: params.moduleId,
        // courseId: params.courseId,
      },
    });

    if (!moduleData || !moduleData.title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    // let courseChapterBefore: any = await db.moduleInCourse.findUnique({
    //   where: {
    //     courseId: params.courseId,
    //     id: params.moduleId,
    //   },
    //   include: {
    //     module: {
    //       select: {
    //         isPublished: true,
    //       },
    //     },
    //   },
    // });
    const publishedChapter = await db.module.update({
      where: {
        id: params.moduleId,
        // courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });
    // await db.moduleInCourse.update({
    //   where: {
    //     id: params.courseId,
    //   },
    //   data: {
    //     // updateDate: new Date(),
    //     // updatedBy: userId,
    //   },
    // });
    // let courseChapterAfter: any = await db.moduleInCourse.findUnique({
    //   where: {
    //     id: params.courseId,
    //   },
    //   include: {
    //     module: {
    //       select: {
    //         isPublished: true,
    //       },
    //     },
    //   },
    // });
    const checkClassSessionRecord: any = await db.classSessionRecord.findMany({
      where: { courseId: params.courseId },
    });
    for (let i = 0; i < checkClassSessionRecord.length; i++) {
      await db.classSessionRecord.update({
        where: {
          id: checkClassSessionRecord[i].id,
        },
        data: {
          status: "studying",
          // progress:
          //   (courseChapterBefore.Module.length /
          //     courseChapterAfter.Module.length) *
          //     100 +
          //   "%",
        },
      });
    }

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
