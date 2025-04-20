import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
var CryptoJS = require("crypto-js");
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId }: any = auth();
    const {finalResult} = await req.json();
    //const { progress, status, endDate, score, retakeTime } = await req.json();
    //console.log("data abc",finalResult)
    //console.log("encrypt data",CryptoJS.AES.decrypt(finalResult, "1"))
    var { progress, status, endDate, score, retakeTime }  = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(finalResult, "4Qz!9vB#xL7$rT8&hY2^mK0@wN5*pS1Zx!a2Lz")));
    //console.log("progressABCDEF", score, progress, status, endDate, retakeTime);
    const year = new Date();
    const date = new Date();
    const userProgress = await db.userProgress.upsert({
      where: {
        moduleId_userId: {
          userId,
          moduleId: params.chapterId,
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
        moduleId: params.chapterId,
        progress,
        status,
        startDate: date,
        attempt: 0,
        score:score,
        endDate
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
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const checkChapter = await db.userProgress.findMany({
      where: {
        userId,
        moduleId: params.chapterId,
      },
    });
    const userProgress: any = await db.userProgress.findFirst({
      where: {
        userId,
        moduleId: params.chapterId,
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
