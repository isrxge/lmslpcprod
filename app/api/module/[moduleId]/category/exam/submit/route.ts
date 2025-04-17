import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Client gửi { answers: [ { examId, selected: [answerId1, answerId2...] } ] }
    const body = await req.json();
    const { answers } = body;
    if (!answers || !Array.isArray(answers)) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    let totalScore = 0;
    // Tuỳ logic, VD: maxScore = 100
    let maxScore = 100;

    // Ví dụ, biến "passed" nếu >= scoreLimit
    let passed = false;

    // Lấy module để xem "scoreLimit"
    const moduleItem = await db.module.findUnique({
      where: { id: params.moduleId },
    });
    if (!moduleItem) {
      return new NextResponse("Module not found", { status: 404 });
    }
    const scoreLimit = moduleItem.scoreLimit || 0;

    // 1) Lặp qua từng đáp án user
    for (const ansObj of answers) {
      // ansObj = { examId, selected: ["answerId1", "answerId2", ...] }
      // Tìm exam gốc + answer (có isCorrect) trong DB
      const exam = await db.exam.findUnique({
        where: { id: ansObj.examId },
        include: { answer: true },
      });
      if (!exam) continue; // exam ko tồn tại => bỏ qua

      // 2) Tính điểm
      // Giả sử logic: 
      // - “all correct or none”: user phải chọn đúng toàn bộ answer.isCorrect = true, và không chọn sai
      // - nếu đúng => + exam.score
      const correctAnswers = exam.answer.filter((a) => a.isCorrect);
      const correctIds = correctAnswers.map((a) => a.id);
      const userSelected = ansObj.selected || [];

      let isAllCorrect = true;
      // Kiểm tra user có chọn đủ answer.isCorrect
      for (const cId of correctIds) {
        if (!userSelected.includes(cId)) {
          isAllCorrect = false;
          break;
        }
      }
      // Kiểm tra user có chọn thừa (câu sai)
      for (const sId of userSelected) {
        if (!correctIds.includes(sId)) {
          isAllCorrect = false;
          break;
        }
      }

      if (isAllCorrect) {
        // Giả sử exam.score = số điểm
        totalScore += exam.score;
      }
    }

    // Tính ra finalScore (theo %) nếu bạn muốn
    const finalScore = Math.floor((totalScore / maxScore) * 100);

    if (finalScore >= (scoreLimit || 0)) {
      passed = true;
    }

    // 3) Trả về { score, passed }
    return NextResponse.json({
      score: finalScore,  // 0 -> 100
      passed,
    });
  } catch (error) {
    console.log("[SUBMIT_EXAM_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
