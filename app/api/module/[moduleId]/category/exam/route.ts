import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.module.findUnique({
      where: {
        id: params.moduleId,
        // courseId: params.courseId,
      },
    });

    if (!chapter || !chapter.title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const data = await Promise.all(await req.json()).then(async function (
      values: any
    ) {
      for (let k = 0; k < values.length; k++) {
        const { id, title, numOfAppearance }: any = values[k];
        await db.category.deleteMany({
          where: {
            moduleId: chapter.id.toString(),
          },
        });
        const category = await db.category.upsert({
          where: { id: id },
          update: {
            title: title,
            numOfAppearance: parseInt(numOfAppearance),
          },
          create: {
            moduleId: chapter.id.toString(),
            title: title,
            numOfAppearance: parseInt(numOfAppearance),
          },
        });
        await db.exam.deleteMany({
          where: {
            categoryId: id,
          },
        });
        if (category.id != undefined) {
          for (let i = 0; i < values[k].question.length; i++) {
            const { id, question, type, score, answer, compulsory }: any =
              values[k].question[i];
            let answerList = [...answer];
            for (let j = 0; j < answerList.length; j++) {
              delete answerList[j]["id"];
              delete answerList[j]["examId"];
            }

            const createExam = await db.exam.create({
              data: {
                categoryId: category.id,
                compulsory,
                question,
                type,
                score: parseInt(score),
                answer: {
                  createMany: { data: [...answerList] },
                },
              },
            });
          }
        }
      }
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

    const questionsList: any = await db.module.findUnique({
      where: {
        id: params.moduleId,
      },
      include: {
        Category: {
          include: {
            Exam: {
              include: {
                answer: true,
              },
            },
          },
        },

        UserProgress: {
          where: {
            userId: userId,
          },
        },
      },
    });

    // Thêm đoạn này: Xoá trường `isCorrect` trong tất cả answer
    for (const cat of questionsList.Category) {
      for (const exam of cat.Exam) {
        exam.answer.forEach((ans: any) => {
          // cách 1
          delete ans.isCorrect;
          // hoặc
          // ans.isCorrect = undefined;
        });
      }
    }

    for (let i = 0; i < questionsList.Category.length; i++) {
      questionsList.Category[i]["question"] = questionsList.Category[i].Exam;
    }

    return NextResponse.json(questionsList);
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
