import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import shuffleArray from "@/lib/shuffle";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1) Kiểm tra userExamReport để xem user đã set isInExam = true chưa
    const examReport = await db.userExamReport.findFirst({
      where: {
        userId: userId,
        moduleId: params.moduleId,
        isInExam: true, // Phải đúng
      },
    });
    if (!examReport) {
      // => user chưa Start exam => cấm
      return new NextResponse("Forbidden: You haven't started the exam yet.", {
        status: 403,
      });
    }
    

    const record = await db.classSessionRecord.findFirst({
      where: {
        courseId: params.courseId,
        userId: userId,
      },
    });
    if (!record) {
      // Nếu không tìm thấy => user chưa tham gia course => chặn
      return new NextResponse("Forbidden: You are not in this course", {
        status: 403,
      });
    }

    // console.log("Module ID:", params.moduleId);
    const questionsList: any = await db.module.findUnique({
      where: {
        id: params.moduleId,
      },
      include: {
        // module: {
        //   include: {
            Category: {
              include: {
                Exam: {
                  include: {
                    //answer: true,
                    answer: {
                      select: {
                        id: true,
                        text: true,
                        // isCorrect: false  // tuỳ cú pháp Prisma, 
                        // hoặc không khai báo => mặc định là false
                      },
                    },
                  },
                },
              },
            },
    
            UserProgress: {
              where: {
                userId: userId,
              },
            },
        //   },
        // }
      }
      
    });

    // console.log("Questions List:", questionsList);  // Log toàn bộ questionsList
    // console.log("Categories:", questionsList.Categories);  // Log phần Category từ questionsList
    
    let questionUnShuffleList: any = [];
    let examMaxScore = 0;
    while (examMaxScore != 100) {
      for (let i = 0; i < questionsList.Category.length; i++) {
        let listQuestionByCategory: any = [];
        let finalListQuestionByCategory: any = [];

        for (let j = 0; j < questionsList.Category[i].Exam.length; j++) {
          questionsList.Category[i].Exam[j].answer = shuffleArray(
            questionsList.Category[i].Exam[j].answer
          );
          listQuestionByCategory = [
            ...listQuestionByCategory,
            questionsList.Category[i].Exam[j],
          ];
        }
        for (let x = 0; x < listQuestionByCategory.length; x++) {
          if (listQuestionByCategory[x].compulsory) {
            finalListQuestionByCategory = [
              ...finalListQuestionByCategory,
              listQuestionByCategory[x],
            ];
          }
        }
        while (
          finalListQuestionByCategory.length <
          questionsList.Category[i].numOfAppearance
        ) {
          const random = Math.floor(
            Math.random() * listQuestionByCategory.length
          );
          if (!listQuestionByCategory[random].compulsory) {
            finalListQuestionByCategory = Array.from(
              new Set([
                ...finalListQuestionByCategory,
                listQuestionByCategory[random],
              ])
            );
          }
        }

        questionUnShuffleList = [
          ...questionUnShuffleList,
          ...finalListQuestionByCategory,
        ];
      }

      examMaxScore = questionUnShuffleList
        .map((item: { score: any }) => item.score)
        .reduce(function (a: any, b: any) {
          return a + b;
        });
    }

    const questions = {
      ...questionsList,
      examMaxScore,
      ExamList: shuffleArray(questionUnShuffleList),
    };

    return NextResponse.json(questions);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
