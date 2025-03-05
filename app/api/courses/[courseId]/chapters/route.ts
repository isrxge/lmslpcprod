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
        console.log(`Module with title "${chapterModule.title}" already exists in the course.`);
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

      const newPosition = lastChapter ? lastChapter.position + 1 : 1;

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

// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function POST(req: Request, { params }: { params: { courseId: string } }) {
//   try {
//     const { userId } = auth();
//     const { title, type } = await req.json(); // Destructuring title and type from the request body

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Check if a module with the same title and type already exists in the course
//     const existingModule = await db.module.findFirst({
//       where: {
//         courseId: params.courseId,
//         title, // Check if the title already exists for the course
//         type,  // Check if the type matches
//       },
//     });

//     if (existingModule) {
//       return new NextResponse("Module already exists in this course", { status: 400 });
//     }

//     // If no such module exists, create a new one
//     const lastChapter = await db.module.findFirst({
//       where: { courseId: params.courseId },
//       orderBy: { position: "desc" }, // Get the last module to set the position correctly
//     });

//     const newPosition = lastChapter ? lastChapter.position + 1 : 1; // Set position based on existing modules

//     // Create the new module
//     const newModule = await db.module.create({
//       data: {
//         title,
//         courseId: params.courseId,
//         position: newPosition,
//         type,
//         userId,
//         isPublished: false,
//       },
//     });

//     return NextResponse.json(newModule); // Respond with the new module's data
//   } catch (error) {
//     console.log("[MODULE CREATE]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// // export async function POST(
// //   req: Request,
// //   { params }: { params: { courseId: string } }
// // ) {
// //   try {
// //     const { userId } = auth();
// //     const { title, type = "slide"} = await req.json();

// //     if (!userId) {
// //       return new NextResponse("Unauthorized", { status: 401 });
// //     }

// //     const getModuleCount = await db.module.count({
// //       where: {
// //         courseId: params.courseId,
// //         UserProgress: {
// //           every: {
// //             status: "finished",
// //             progress: "100%",
// //           },
// //         },
// //       },
// //     });
// //     const getModuleCountAll = await db.module.count({
// //       where: {
// //         courseId: params.courseId,
// //       },
// //     });
// //     const updateCourse = await db.classSessionRecord.updateMany({
// //       where: {
// //         courseId: params.courseId,
// //         status: "finished",
// //         progress: "100%",
// //       },
// //       data: {
// //         status: "studying",
// //         progress: (getModuleCount / getModuleCountAll + 1) * 100 + "%",
// //       },
// //     });
// //     const lastChapter = await db.module.findFirst({
// //       where: {
// //         courseId: params.courseId,
// //       },
// //       orderBy: {
// //         position: "desc",
// //       },
// //     });

// //     const newPosition = lastChapter ? lastChapter.position + 1 : 1;
// //     const chapter = await db.module.create({
// //       data: {
// //         title,
// //         courseId: params.courseId,
// //         position: newPosition,

// //         type,

// //         userId,

// //         isPublished: false,
// //       },
// //     });
// //     // if (chapter.type.toLowerCase() == "slide") {
// //     // } else {
// //     //   const exam = await db.exam.create({
// //     //     data: {
// //     //       moduleId: chapter.id,
// //     //     },
// //     //   });
// //     // }
// //     await db.course.update({
// //       where: {
// //         id: params.courseId,
// //       },
// //       data: {
// //         updateDate: new Date(),
// //         updatedBy: userId,
// //       },
// //     });
// //     return NextResponse.json(chapter);
// //   } catch (error) {
// //     console.log("[CHAPTERS]", error);
// //     return new NextResponse("Internal Error", { status: 500 });
// //   }
// // }

// export async function GET(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const chapters = await db.module.findMany({
//       where: {
//         courseId: params.courseId,
//       },
//       orderBy: {
//         position: "asc", // Sorting by position if necessary
//       },
//     });

//     return NextResponse.json(chapters);
//   } catch (error) {
//     console.log("[CHAPTERS]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
//   try {
//     const { userId } = auth();
//     const { moduleIds } = await req.json(); // moduleIds is an array of module IDs to delete

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Delete modules from the course
//     const deletedModules = await db.module.deleteMany({
//       where: {
//         id: { in: moduleIds },
//       },
//     });

//     return NextResponse.json(deletedModules);
//   } catch (error) {
//     console.log("[CHAPTERS DELETE]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// Tao module bth
// export async function POST(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { userId } = auth();
//     const { title, type = "slide"} = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const getModuleCount = await db.module.count({
//       where: {
//         courseId: params.courseId,
//         UserProgress: {
//           every: {
//             status: "finished",
//             progress: "100%",
//           },
//         },
//       },
//     });
//     const getModuleCountAll = await db.module.count({
//       where: {
//         courseId: params.courseId,
//       },
//     });
//     const updateCourse = await db.classSessionRecord.updateMany({
//       where: {
//         courseId: params.courseId,
//         status: "finished",
//         progress: "100%",
//       },
//       data: {
//         status: "studying",
//         progress: (getModuleCount / getModuleCountAll + 1) * 100 + "%",
//       },
//     });
//     const lastChapter = await db.module.findFirst({
//       where: {
//         courseId: params.courseId,
//       },
//       orderBy: {
//         position: "desc",
//       },
//     });

//     const newPosition = lastChapter ? lastChapter.position + 1 : 1;
//     const chapter = await db.module.create({
//       data: {
//         title,
//         courseId: params.courseId,
//         position: newPosition,

//         type,

//         userId,

//         isPublished: false,
//       },
//     });
//     // if (chapter.type.toLowerCase() == "slide") {
//     // } else {
//     //   const exam = await db.exam.create({
//     //     data: {
//     //       moduleId: chapter.id,
//     //     },
//     //   });
//     // }
//     await db.course.update({
//       where: {
//         id: params.courseId,
//       },
//       data: {
//         updateDate: new Date(),
//         updatedBy: userId,
//       },
//     });
//     return NextResponse.json(chapter);
//   } catch (error) {
//     console.log("[CHAPTERS]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }