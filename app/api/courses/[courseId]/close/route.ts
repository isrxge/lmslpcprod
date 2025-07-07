import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

/* --------------- cấu hình SMTP --------------- */
const transporter = nodemailer.createTransport(
  smtpTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secureConnection: false,
    auth: { user: "webmaster@lp.com.vn", pass: "yqpcfbbvhfrvfbwz" },
    tls: { ciphers: "SSLv3" },
  })
);

/* --------------- helpers gửi mail --------------- */
const sendInstructorReport = async (
  email: string,
  courseTitle: string,
  rowsHtml: string
) => {
  await transporter.sendMail({
    from: "webmaster@lp.com.vn",
    to: email,
    subject: `[LMS] Báo cáo tiến độ cuối cùng – ${courseTitle}`,
    html: `
      <p style="font-family:'Times New Roman';font-size:12pt">
        Dear bạn,<br/>
        Khóa học <strong>${courseTitle}</strong> đã được đóng.
        Dưới đây là bảng tiến độ cuối cùng của nhân viên bạn phụ trách.
      </p>
      <table border="1" cellpadding="0" cellspacing="0"
             style="border-collapse:collapse;width:100%;
                    font-family:'Times New Roman';font-size:12pt">
        <thead>
          <tr>
            <th style="padding:8px 18px">Staff</th>
            <th style="padding:8px 18px">Status</th>
            <th style="padding:8px 18px">Score</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <p style="font-family:'Times New Roman';font-size:12pt">
        Best regards,<br/>Learning Management System Administration
      </p>
    `,
  });
};

const sendStatusMail = async (
  email: string,
  courseTitle: string,
  finalStatus: "finished" | "failed",
  score: number
) =>
  transporter.sendMail({
    from: "webmaster@lp.com.vn",
    to: email,
    subject: `[LMS] Khóa học ${courseTitle} đã đóng – Trạng thái: ${finalStatus}`,
    html: `
      <p style="font-family:'Times New Roman';font-size:12pt">
        Dear bạn,<br/>
        Khóa học <strong>${courseTitle}</strong> đã được đóng và trạng thái cuối cùng của bạn là <strong>${finalStatus}</strong> (điểm&nbsp;${score}).<br/>
        ${
          finalStatus === "failed"
            ? "Vui lòng liên hệ người hướng dẫn của bạn để được hỗ trợ thêm."
            : "Chúc mừng bạn đã hoàn thành khóa học!"
        }
      </p>
      <p style="font-family:'Times New Roman';font-size:12pt">
        Best regards,<br/>Learning Management System Administration
      </p>
    `,
  });

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseId = params.courseId;

    /* 1️⃣  Đóng khóa (status = closed, unpublish) */
    const closedCourse = await db.course.update({
      where: { id: courseId },
      data: { status: "closed", isPublished: false },
      include: { courseInstructor: true },
    });
    /* 2️⃣  Đánh dấu mọi session còn “studying” thành “failed”, score = 0 */
    const isSelfStudy = closedCourse.type === "Self Study";
    const updateData = isSelfStudy
      ? { status: "finished", score: 100, progress: "100" }
      : { status: "failed", score: 0, progress: "0" };

    const { count: updatedRecords } = await db.classSessionRecord.updateMany({
      where: { courseId, status: "studying" },
      data: updateData,
    });

    /* 3. Lấy danh sách session cuối cùng để báo cáo */
    const sessions = await db.classSessionRecord.findMany({
      where: { courseId },
      include: { user: true },
    });

    /* 4. Gửi mail giảng viên */
    if (closedCourse.courseInstructor?.email) {
      const rowsHtml = sessions
        .map(
          (s) => `
          <tr>
            <td style="padding:8px 18px">
              ${s.user?.username ?? s.user?.email ?? "—"}
            </td>
            <td style="padding:8px 18px">${s.status}</td>
            <td style="padding:8px 18px">${s.score ?? "—"}</td>
          </tr>`
        )
        .join("");

      await sendInstructorReport(
        closedCourse.courseInstructor.email,
        closedCourse.title,
        rowsHtml
      );
    }

    /* 5. Gửi mail từng staff vừa bị failed */
    const affectedStaff = sessions.filter(
      (s) => s.status === (isSelfStudy ? "finished" : "failed")
    );

    for (const s of affectedStaff) {
      if (s.user?.email) {
        sendStatusMail(
          s.user.email,
          closedCourse.title,
          s.status as "finished" | "failed",
          s.score ?? 0
        ).catch((e) => console.error("[SEND_STATUS_MAIL]", s.user?.email, e));
      }
    }

    return NextResponse.json({
      course: closedCourse,
      updatedRecords,
      notified: affectedStaff.length,
    });
  } catch (error) {
    console.error("[COURSE_CLOSE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
