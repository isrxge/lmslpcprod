import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
    const { title, type } = await req.json();
    let userInfo: any = await db.user.findUnique({
      where: { id: userId, status: "approved" },
    });

    const date = new Date();
    // const module = await db.module.create({
    //   data: {
    //     userId,
    //     title,
    //     startDate: date,
    //     isPublished: false,
    //     Module: {
    //       create: [
    //         {
    //           position: 1,
    //           isPublished: false,
    //           title: "Intro",
    //           type: "slide",
    //           userId,
    //         },
    //       ],
    //     },
    //   },
    // });

    const newModule = await db.module.create({
      data: {
        title,
        type,
        position: 1,
        isPublished: false,
        userId, // Đảm bảo module thuộc về user đã xác thực
      },
    });


    // // Liên kết module với khóa học qua bảng trung gian ModuleInCourse
    // await db.moduleInCourse.create({
    //   data: {
    //     moduleId: module.id,
    //     courseId,
    //   },
    // });

    return NextResponse.json(newModule);
  } catch (error) {
    console.log("[MODULE API]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
// GET - Lấy danh sách module theo loại
export async function GET(req: Request) {
  try {
    const { userId } = auth();  // Lấy userId từ thông tin xác thực
    const url = new URL(req.url);

    const type = url.searchParams.get("type");  // Lọc theo loại (Slide/Exam)
    const search = url.searchParams.get("search") || "";  // Lọc theo từ khóa tìm kiếm (nếu có)

    const modules = await db.module.findMany({
      where: {
        type: type || undefined,  // Nếu có type, lọc theo type, nếu không thì không lọc theo type
        title: {
          contains: search,  // Tìm kiếm trong tiêu đề module
          mode: "insensitive",  // Không phân biệt chữ hoa chữ thường
        },
        isPublished: true,  // Chỉ lấy module đã xuất bản
      },
    });

    return NextResponse.json(modules);  // Trả về danh sách các module tìm được
  } catch (error) {
    console.log("[MODULE API]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



