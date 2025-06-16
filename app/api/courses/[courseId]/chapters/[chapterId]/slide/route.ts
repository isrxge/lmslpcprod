import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { contents } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
<<<<<<< HEAD

    // const ownCourse = await db.course.findUnique({
    //   where: {
    //     id: params.courseId,
    //     userId,
    //   },
    // });

    // if (!ownCourse) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

=======
>>>>>>> 8b13b57 (commit)
    const removeSlide = await db.slide.deleteMany({
      where: { moduleId: params.chapterId },
    });
    const createSlide = await db.slide.createMany({
      data: contents.map((content: any, i: any) => ({
        moduleId: params.chapterId,
        title: content.title,
        position: i,
        content: content.content,
        contentType: content.contentType,
        videoUrl: content.videoUrl,
        fileUrl: content.fileUrl,
        description: content.description,
      })),
    });

<<<<<<< HEAD
    // for (let i = 0; i < contents.length; i++) {
    //   const createSlide = await db.slide.create({
    //     data: {
    //       moduleId: chapter.id,
    //       title: contents[i].title,
    //       position: i,
    //       content: contents[i].content,
    //       contentType: contents[i].contentType,
    //       videoUrl: contents[i].videoUrl,
    //       fileUrl: contents[i].fileUrl,
    //       description: contents[i].description,
    //     },
    //   });
    // }
=======
>>>>>>> 8b13b57 (commit)
    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        updateDate: new Date(),
        updatedBy: userId,
      },
    });
    return NextResponse.json("success");
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.module.findUnique({
      where: {
        id: params.chapterId,
        // courseId: params.courseId,
      },
    });

    if (!chapter || !chapter.title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const slide = await db.slide.findMany({
      where: { moduleId: chapter.id },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
