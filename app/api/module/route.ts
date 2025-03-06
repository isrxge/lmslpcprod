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
//code không filter
// GET - Lấy danh sách module theo loại
// export async function GET(req: Request) {
//   try {
//     const { userId } = auth();  // Lấy userId từ thông tin xác thực
//     const url = new URL(req.url);

//     const type = url.searchParams.get("type");  // Lọc theo loại (Slide/Exam)
//     const search = url.searchParams.get("search") || "";  // Lọc theo từ khóa tìm kiếm (nếu có)

//     const modules = await db.module.findMany({
//       where: {
//         type: type || undefined,  // Nếu có type, lọc theo type, nếu không thì không lọc theo type
//         title: {
//           contains: search,  // Tìm kiếm trong tiêu đề module
//           mode: "insensitive",  // Không phân biệt chữ hoa chữ thường
//         },
//         isPublished: true,  // Chỉ lấy module đã xuất bản
//       },
//     });

//     return NextResponse.json(modules);  // Trả về danh sách các module tìm được
//   } catch (error) {
//     console.log("[MODULE API]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }


//code filter theo type course
export async function GET(req: Request) {
  try {
    const { userId } = auth();  // Get userId from authentication
    const url = new URL(req.url);

    const type = url.searchParams.get("type");  // Filter by module type (Slide/Exam)
    const search = url.searchParams.get("search") || "";  // Search by keyword (if any)
    const courseId = url.searchParams.get("courseId");  // Get courseId from query to fetch course.type

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    // Fetch the course type based on courseId
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { type: true },  // Select only the type field of the course
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const courseType = course.type;

    // Initial filters
    let filters: any = {
      title: {
        contains: search,  // Search within module title
        mode: "insensitive",  // Case-insensitive search
      },
      isPublished: true,  // Only include published modules
    };

    if (type) {
      filters.type = type;  // Apply type filter (Slide or Exam)
    }

    // Apply filtering based on courseType
    if (courseType) {
      if (courseType === "Mandatory") {
        // For Mandatory course, show both Slide and Exam with maxAttempt = 1
        filters.OR = [
          { type: "Slide" },  // Include Slide modules
          { type: "Exam", maxAttempt: 1 },  // Include Exam modules with maxAttempt = 1
        ];
      } else if (courseType === "Probation") {
        // For Probation course, show both Slide and Exam with maxAttempt = 2
        filters.OR = [
          { type: "Slide" },  // Include Slide modules
          { type: "Exam", maxAttempt: 2 },  // Include Exam modules with maxAttempt = 2
        ];
      } else if (courseType === "SelfStudy") {
        // For Self-Study course, only show Slide modules (no Exam modules)
        filters.type = "Slide";  // Only include Slide modules
      }
    }

    console.log("Applying filters:", filters);  // Add logging to check applied filters

    // Fetch modules from the database based on filters
    const modules = await db.module.findMany({
      where: filters,
    });

    return NextResponse.json(modules);  // Return the filtered list of modules
  } catch (error) {
    console.error("[MODULE API]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



