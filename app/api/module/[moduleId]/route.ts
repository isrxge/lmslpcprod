import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const moduleData = await db.module.findUnique({
      where: {
        id: params.moduleId,
        // courseId: params.courseId,
      },
    });

    if (!moduleData) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedModule = await db.module.delete({
      where: {
        id: params.moduleId,
      },
    });

    // const publishedChaptersInCourse = await db.module.findMany({
    //   where: {
    //     // courseId: params.courseId,
    //     isPublished: true,
    //   },
    // });

    // if (!publishedChaptersInCourse.length) {
    //   await db.moduleInCourse.update({
    //     where: {
    //       id: params.courseId,
    //     },
    //     data: {
    //       isPublished: false,
    //     },
    //   });
    // }
    // await db.course.update({
    //   where: {
    //     id: params.courseId,
    //   },
    //   data: {
    //     updateDate: new Date(),
    //     updatedBy: userId,
    //   },
    // });
    return NextResponse.json(deletedModule);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    const { title, isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.module.update({
      where: {
        id: params.moduleId,
        // courseId: params.courseId,
      },
      data: {
        title,
        ...values,
      },
    });
    // await db.course.update({
    //   where: {
    //     id: params.courseId,
    //   },
    //   data: {
    //     updateDate: new Date(),
    //     updatedBy: userId,
    //   },
    // });
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, moduleId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.module.findUnique({
      where: {
        id: moduleId,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
