import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { modules } = await req.json(); // Nhận mảng modules thay vì title và type

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Kiểm tra nếu không có modules được gửi đi
    if (!modules || modules.length === 0) {
      return new NextResponse("No modules selected", { status: 400 });
    }

    // Lặp qua các module và thêm vào khóa học
    const addedModules = [];
    for (const chapterModule  of modules) {
      // Kiểm tra xem module đã tồn tại trong khóa học hay chưa
      const existingModule = await db.module.findFirst({
        where: {
          // courseId: params.courseId,
          title: chapterModule.title, // Kiểm tra theo tên module hoặc moduleId nếu cần
        },
      });

      if (existingModule) {
        // Nếu module đã tồn tại, bỏ qua và không thêm module này
        // console.log(`Module with title "${chapterModule.title}" already exists in the course.`);
        continue;  // Bỏ qua việc tạo module mới nếu nó đã tồn tại
      }

      // Lấy vị trí mới cho module
      const lastChapter = await db.module.findFirst({
        where: {
          // courseId: params.courseId,
        },
        orderBy: {
          position: "desc", // Sắp xếp theo vị trí để xác định vị trí tiếp theo
        },
      });

      // const newPosition = lastChapter ? lastChapter.position + 1 : 1;
      const newPosition = lastChapter
  ? (lastChapter.position ?? 0) + 1
  : 1;

      const chapter = await db.module.create({
        data: {
          title: chapterModule.title,
          // courseId: params.courseId,
          position: newPosition,
          type: chapterModule.type, // Kiểu module: "Slide" hoặc "Exam"
          userId,
          isPublished: false,
        },
      });

      addedModules.push(chapter); // Lưu lại các module đã được thêm vào khóa học
    }

    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        updateDate: new Date(),
        updatedBy: userId,
      },
    });

    // Trả về các module đã thêm
    return NextResponse.json(addedModules);
  } catch (error) {
    console.log("[CHAPTERS]", error);
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

    const chapters = await db.module.findMany({
      where: {
        // courseId: params.courseId,
      },
      orderBy: {
        position: "asc", // Sorting by position if necessary
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


