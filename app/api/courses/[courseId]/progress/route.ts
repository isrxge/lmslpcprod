import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
<<<<<<< HEAD
var CryptoJS = require("crypto-js");
=======

>>>>>>> 8b13b57 (commit)
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
<<<<<<< HEAD
    const {courseResult} = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    var { progress, status, endDate ,score }  = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(courseResult, "4Qz!9vB#xL7$rT8&hY2^mK0@wN5*pS1Zx!a2Lz")));
    // const { progress, status, endDate ,score} = await req.json();
    // console.log(score)
=======
    const { progress, status, endDate } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
        score:score
=======
>>>>>>> 8b13b57 (commit)
      },
      create: {
        userId,
        courseId: params.courseId,
        progress,
        status,
        startDate: date,
<<<<<<< HEAD
        score:score
=======
>>>>>>> 8b13b57 (commit)
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
<<<<<<< HEAD

=======
>>>>>>> 8b13b57 (commit)
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
