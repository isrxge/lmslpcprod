import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
var CryptoJS = require("crypto-js");
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const {courseResult} = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    var { progress, status, endDate ,score }  = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(courseResult, "4Qz!9vB#xL7$rT8&hY2^mK0@wN5*pS1Zx!a2Lz")));
    // const { progress, status, endDate ,score} = await req.json();
    // console.log(score)
    const year = new Date();
    const date = new Date();
    const userProgress = await db.classSessionRecord.upsert({
      where: {
        courseId_userId: {
          userId,
          courseId: params.courseId,
        },
      },
      update: {
        progress,
        status,
        endDate,
        score:score
      },
      create: {
        userId,
        courseId: params.courseId,
        progress,
        status,
        startDate: date,
        score:score
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
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        ClassSessionRecord: { include: { user: true } },
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
