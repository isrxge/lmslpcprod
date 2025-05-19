import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
import { db } from "@/lib/db";
 
export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { user_Id, courseId, moduleId, result } = await req.json();
    const { userId }: any = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
 
    const examRecord = await db.userExamRecord.create({
      data: {
        userId: user_Id,
        courseId: courseId,
        moduleId: moduleId,
        result: result,
        date: new Date(),
        // courseId: params.courseId,
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
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
 
    // // 1) Kiểm tra xem user có trong khoá này không (nếu cần)
    // //    (Tuỳ logic, bạn có thể dùng classSessionRecord, userProgress,...)
    // const record = await db.classSessionRecord.findFirst({
    //   where: {
    //     userId,
    //     courseId: params.courseId,
    //   },
    // });
    // if (!record) {
    //   // user chưa join course => chặn
    //   return new NextResponse("Forbidden: You are not in this course", {
    //     status: 403,
    //   });
    // }
 
    // // 2) Kiểm tra userExamReport => isInExam = true
    // const examReport = await db.userExamReport.findFirst({
    //   where: {
    //     userId: userId,
    //     moduleId: params.moduleId,
    //     courseId: params.courseId, // nếu cần
    //     isInExam: true,
    //   },
    // });
    // if (!examReport) {
    //   // user chưa Start exam => chặn
    //   return new NextResponse("Forbidden: You haven't started the exam.", {
    //     status: 403,
    //   });
    // }
 
    const getRecord: any = await db.userExamRecord.findMany({
      where: {
        // courseId: params.courseId,
        moduleId: params.moduleId,
      },
      orderBy: {
        date: "asc",
      },
    });
 
    // Thêm đoạn này: Xoá trường `isCorrect` trong tất cả answer
 
    return NextResponse.json(getRecord);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
 
// export async function GET(
//   req: Request,
//   { params }: { params: { courseId: string; moduleId: string } }
// ) {
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
 
//     // 1) Lấy danh sách permission của user
//     const userPermissions = await db.userPermission.findMany({
//       where: {
//         userId: userId,
//       },
//       include: {
//         permission: true,
//       },
//     });
 
//     // Kiểm tra user có Edit/Create resource permission?
//     const canEdit = userPermissions.some(
//       (up) => up.permission.title === "Edit resource permission"
//     );
//     const canCreate = userPermissions.some(
//       (up) => up.permission.title === "Create resource permission"
//     );
 
//     // 2) Logic cho user bình thường (chưa có 2 quyền kia)
//     //    Họ cần: (a) Thuộc khoá, (b) isInExam = true
//     let mustCheckIsInExam = true;
 
//     // 3) Nếu user có ít nhất 1 trong 2 quyền =>
//     //    => “bỏ qua” check isInExam (coi như admin)
//     if (canEdit || canCreate) {
//       mustCheckIsInExam = false;
//     }
 
//     // 4) Nếu user không phải admin => Kiểm tra user có thuộc course
//     //    (Tuỳ nếu bạn vẫn muốn admin cũng phải thuộc course, bạn cmt khúc này)
//     const record = await db.classSessionRecord.findFirst({
//       where: {
//         userId,
//         courseId: params.courseId,
//       },
//     });
//     if (!record) {
//       // user chưa join course => chặn
//       return new NextResponse("Forbidden: You are not in this course", {
//         status: 403,
//       });
//     }
 
//     // 5) Nếu user bình thường => phải isInExam = true mới xem
//     if (mustCheckIsInExam) {
//       const examReport = await db.userExamReport.findFirst({
//         where: {
//           userId: userId,
//           moduleId: params.moduleId,
//           courseId: params.courseId,
//           isInExam: true,
//         },
//       });
//       if (!examReport) {
//         return new NextResponse("Forbidden: You haven't started the exam.", {
//           status: 403,
//         });
//       }
//     }
 
//     // 6) Lấy dữ liệu exam
//     const questionsList: any = await db.module.findUnique({
//       where: { id: params.moduleId },
//       include: {
//         Category: {
//           include: {
//             Exam: {
//               include: {
//                 answer: true,
//               },
//             },
//           },
//         },
//         UserProgress: {
//           where: { userId: userId },
//         },
//       },
//     });
 
//     if (!questionsList) {
//       return new NextResponse("Module not found", { status: 404 });
//     }
 
//     // Xoá isCorrect
//     for (const cat of questionsList.Category) {
//       for (const exam of cat.Exam) {
//         exam.answer.forEach((ans: any) => {
//           delete ans.isCorrect;
//         });
//       }
//     }
 
//     // Tạo field "question" = Exam
//     for (let i = 0; i < questionsList.Category.length; i++) {
//       questionsList.Category[i]["question"] = questionsList.Category[i].Exam;
//     }
 
//     return NextResponse.json(questionsList);
//   } catch (error) {
//     console.log("[CHAPTER_PUBLISH]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }