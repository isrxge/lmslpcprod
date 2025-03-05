import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId }: any = auth();
    const { progress, status, endDate, score, retakeTime } = await req.json();

    const year = new Date();
    const date = new Date();
    const userProgress = await db.userProgress.upsert({
      where: {
        moduleId_userId: {
          userId,
          moduleId: params.moduleId,
        },
      },
      update: {
        progress,
        status,
        endDate,
        score,
        attempt: {
          increment: 1,
        },
        retakeTime,
      },
      create: {
        userId,
        moduleId: params.moduleId,
        progress,
        status,
        startDate: date,
        attempt: 0,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const checkChapter = await db.userProgress.findMany({
      where: {
        userId,
        moduleId: params.moduleId,
      },
    });
    const userProgress: any = await db.userProgress.findFirst({
      where: {
        userId,
        moduleId: params.moduleId,
      },
    });
    
    const currentChapterPos = checkChapter
      .map((item: { id: any }) => item.id)
      .indexOf(userProgress?.id);
    const nextChapter = checkChapter.map((item: { id: any }) => item.id)[
      currentChapterPos + 1
    ];
    if(userProgress != undefined){
      userProgress["nextChapterId"] = nextChapter;
    }
    
    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
