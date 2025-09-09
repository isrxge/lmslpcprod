import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

// 1. Setup transporter
const transporter = nodemailer.createTransport(
  smtpTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secureConnection: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { ciphers: "SSLv3" },
  })
);

// 2. Gửi email cho nhân viên
const sendStatusMail = async (
  email: string,
  courseTitle: string,
  status: "finished" | "failed",
  score: number
) =>
  transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `[LMS] Khóa học ${courseTitle} đã đóng – Trạng thái: ${status}`,
    html: `
      <p style="font-family:'Times New Roman';font-size:12pt">
        Dear anh/chị,<br/>
        Khóa học <strong>${courseTitle}</strong> đã được đóng.<br/>
        Trạng thái cuối cùng của anh/chị: <strong>${status}</strong> (điểm: ${score}).<br/>
        ${
          status === "failed"
            ? "Vui lòng liên hệ người hướng dẫn để biết thêm chi tiết."
            : "Chúc mừng anh/chị đã hoàn thành khóa học!"
        }
      </p>
      <p style="font-family:'Times New Roman';font-size:12pt">
        Best regards,<br/>Learning Management System Administration
      </p>
    `,
  });

// 3. Gửi báo cáo cho giảng viên
const sendFinalReport = async (to: string, courseTitle: string, body: string) =>
  transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    cc: process.env.AD_EMAIL,
    subject: `[LMS] Báo cáo tiến độ cuối cùng – ${courseTitle}`,
    html: body,
  });

// 4. Logic chính
const handleCourseClosure = async () => {
  const logs: string[] = [];

  const expiredCourses = await db.course.findMany({
    where: { status: "open", endDate: { lt: new Date() } },
    include: {
      courseInstructor: true,
      ClassSessionRecord: { include: { user: true } },
    },
  });

  logs.push(`[Close] Found ${expiredCourses.length} expired courses`);

  for (const course of expiredCourses) {
    // Đóng khóa học
    await db.course.update({
      where: { id: course.id },
      data: { status: "closed", isPublished: false },
    });

    const isSelf = course.type === "Self Study";
    const updateData = isSelf
      ? { status: "finished", score: 100, progress: "100" }
      : { status: "failed", score: 0, progress: "0" };

    // Lấy các session đang học
    const studyingSessions = course.ClassSessionRecord.filter(
      (s) => s.status === "studying"
    );

    if (studyingSessions.length) {
      await db.classSessionRecord.updateMany({
        where: { id: { in: studyingSessions.map((s) => s.id) } },
        data: updateData,
      });
    }

    // Gửi mail cho các session vừa cập nhật
    for (const s of studyingSessions) {
      if (s.user?.email) {
        await sendStatusMail(
          s.user.email,
          course.title,
          updateData.status as "finished" | "failed",
          updateData.score as number
        );
        logs.push(`[Close] Sent status mail to ${s.user.email}`);

        // Ghi log gửi báo cáo nhân viên
        await db.notificationLog.create({
          data: {
            userId: s.user.id,
            courseId: course.id,
            type: "final_status",
            sentDate: new Date(),
          },
        });
      }
    }

    // Gửi báo cáo instructor
    if (course.courseInstructor?.email) {
      const sessions = await db.classSessionRecord.findMany({
        where: { courseId: course.id },
        include: { user: true },
      });

      const rows = sessions
        .map(
          (s) => `
        <tr>
          <td>${s.user?.username ?? s.user?.email ?? "—"}</td>
          <td>${s.status}</td>
          <td>${s.score ?? "—"}</td>
        </tr>`
        )
        .join("");

      const htmlBody = `
        <p style="font-family:'Times New Roman';font-size:12pt">
          Dear anh/chị,<br/>
          Khóa học <strong>${course.title}</strong> đã được hệ thống tự động đóng.<br/>
          Dưới đây là bảng tiến độ cuối cùng của nhân viên anh/chị phụ trách:
        </p>
        <table border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:'Times New Roman';font-size:12pt">
          <thead>
            <tr>
              <th style="padding:8px 18px">Nhân viên</th>
              <th style="padding:8px 18px">Kết quả</th>
              <th style="padding:8px 18px">Điểm</th>
            </tr>
          </thead>
          <tbody>${rows.replace(
            /<td>/g,
            "<td style='padding:8px 18px;'>"
          )}</tbody>
        </table>
        <p style="font-family:'Times New Roman';font-size:12pt">
          Best regards,<br/>Learning Management System Administration
        </p>
      `;

      await sendFinalReport(course.courseInstructor.email, course.title, htmlBody);
      logs.push(`[Close] Sent report to instructor ${course.courseInstructor.email}`);

      // Ghi log gửi báo cáo giảng viên
      await db.notificationLog.create({
        data: {
          userId: course.courseInstructor.id,
          courseId: course.id,
          type: "final_report",
          sentDate: new Date(),
        },
      });
    }
  }

  logs.push(`[Close] ✅ Process completed at ${new Date().toISOString()}`);
  return logs;
};

// 5. Public API route
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    console.log("[API] /api/close-expired-courses called");
    const logs = await handleCourseClosure();
    return NextResponse.json({
      message: "Expired courses closed successfully",
      details: logs,
    });
  } catch (error) {
    console.error("[API] Close courses error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
