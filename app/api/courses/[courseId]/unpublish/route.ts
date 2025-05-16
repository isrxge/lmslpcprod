// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

// import { db } from "@/lib/db";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     const getEndDate = await db.course.findUnique({
//       where: {
//         id: params.courseId,
//       },
      
//     })
//     const unpublishedCourse = await db.course.update({
//       where: {
//         id: params.courseId,
//       },
//       data: {
//         isPublished: false,
//         updateDate: new Date(),
//         updatedBy: userId,
//       },
//     });
//     if(getEndDate?.endDate == new Date()){
//       await db.classSessionRecord.updateMany({
//         where: {
//           courseId: params.courseId,
//           NOT:{status: "finished"}
          
//         },
//         data: {
//           status: "failed",
//         },
//       })
//     }
//     return NextResponse.json(unpublishedCourse);
//   } catch (error) {
//     console.log("[COURSE_ID_UNPUBLISH]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// code cũ 12/5
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // 1. Lấy thông tin khoá học cùng endDate
//     const course = await db.course.findUnique({
//       where: { id: params.courseId },
//     });
//     if (!course) {
//       return new NextResponse("Course not found", { status: 404 });
//     }

//     const now = new Date();

//     // 2. Nếu khoá học đã kết thúc (endDate <= now) thì cập nhật các session chưa finished thành failed
//     if (course.endDate && course.endDate.getTime() <= now.getTime()) {
//       await db.classSessionRecord.updateMany({
//         where: {
//           courseId: params.courseId,
//           // NOT: { status: "finished" },
//           status: {
//             not: "finished",
//           },
//         },
//         data: {
//           status: "failed",
//         },
//       });
//     }

//     // 3. Unpublish khoá học
//     const unpublishedCourse = await db.course.update({
//       where: { id: params.courseId },
//       data: {
//         isPublished: false,
//         updateDate: now,
//         updatedBy: userId,
//       },
//     });

//     return NextResponse.json(unpublishedCourse);
//   } catch (error) {
//     console.log("[COURSE_ID_UNPUBLISH]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false,
        updateDate: new Date(),
        updatedBy: userId,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}