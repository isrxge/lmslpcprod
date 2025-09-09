// // lib/cron.ts
// import cron from "node-cron";
// import { db } from "@/lib/db";

// // cron.schedule("0 1 * * *", async () => {
// cron.schedule("*/1 * * * *", async () => {
//   const n = await db.course.updateMany({
//     where: { status: "open", endDate: { lt: new Date() } },
//     data:  { status: "closed", isPublished: false },
//   });
//   console.log(`[CRON] Closed ${n.count} expired courses`);
// });
// console.log("[CRON] Scheduler initialised");

// lib/cron.ts
import cron from "node-cron";
import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secureConnection: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS, },
    tls: { ciphers: "SSLv3" },
  })
);

const sendStatusMail = async (
  email: string,
  courseTitle: string,
  status: "finished" | "failed",
  score: number
) =>
  transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `[LMS] Course ${courseTitle} closed – Status: ${status}`,
    html: `
      <p style="font-family:'Times New Roman';font-size:12pt">
        Dear anh/chị,<br/>
        Khóa học <strong>${courseTitle}</strong> đã được đóng lại.<br/>
        Trạng thái cuối cùng của anh/chị là: <strong>${status}</strong> (điểm ${score}).<br/>
        ${
          status === "failed"
            ? "Vui lòng liên hệ người hướng dẫn để biết thêm thông tin chi tiết."
            : "Chúc mừng anh/chị đã hoàn thành khóa học!"
        }
      </p>
      <p style="font-family:'Times New Roman';font-size:12pt">
        Best regards,<br/>Learning Management System Administration
      </p>
    `,
  });

const sendFinalReport = async (to: string, courseTitle: string, body: string) =>
  transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `[LMS] Final progress report – ${courseTitle}`,
    html: body,
  });

/* ---------- CRON 07:00 ---------- */
cron.schedule("0 18 * * *", async () => {
  //cron.schedule("34 17 * * *", async () => {
  try {
    /* 1. lấy mọi khóa open hết hạn */
    const expired = await db.course.findMany({
      where: { status: "open", endDate: { lt: new Date() } },
      include: {
        courseInstructor: true,
        ClassSessionRecord: { include: { user: true } },
      },
    });
    if (expired.length === 0) return;

    let totalSessionsUpdated = 0;

    /* 2. lặp từng khóa */
    for (const course of expired) {
      // 2.1. đóng khóa & unpublish
      await db.course.update({
        where: { id: course.id },
        data: { status: "closed", isPublished: false },
      });

      const isSelf = course.type === "Self Study";
      const updateData = isSelf
        ? { status: "finished", score: 100, progress: "100" }
        : { status: "failed", score: 0, progress: "0" };

      // // 2.2. cập-nhật session còn studying
      // const { count } = await db.classSessionRecord.updateMany({
      //   where: { courseId: course.id, status: "studying" },
      //   data: updateData,
      // });
      // totalSessionsUpdated += count;

      // // 2.3. lấy again toàn bộ session sau update
      // const sessions = await db.classSessionRecord.findMany({
      //   where: { courseId: course.id },
      //   include: { user: true },
      // });

      // /* --- gửi mail staff vừa bị cập nhật --- */
      // const targetStatus = isSelf ? "finished" : "failed";
      // const scoreVal = isSelf ? 100 : 0;

      // const affected = sessions.filter((s) => s.status === targetStatus);
      // for (const s of affected) {
      //   if (s.user?.email) {
      //     sendStatusMail(
      //       s.user.email,
      //       course.title,
      //       targetStatus as any,
      //       scoreVal
      //     ).catch((e) =>
      //       console.error("[CRON] sendStatusMail", s.user?.email, e)
      //     );
      //   }
      // }

      /* 2.2. lấy TRƯỚC các session đang studying */
  const studyingSessions = await db.classSessionRecord.findMany({
    where: { courseId: course.id, status: "studying" },
    include: { user: true },
  });

  /* 2.3. cập-nhật các session vừa lấy */
  if (studyingSessions.length) {
    await db.classSessionRecord.updateMany({
      where: { id: { in: studyingSessions.map((s) => s.id) } },
      data: updateData,
    });
  }
  totalSessionsUpdated += studyingSessions.length;

  /* 2.4. gửi mail CHỈ cho các session vừa cập-nhật */
  for (const s of studyingSessions) {
    if (s.user?.email) {
      sendStatusMail(
        s.user.email,
        course.title,
        updateData.status as "finished" | "failed",
        updateData.score as number
      ).catch((e) =>
        console.error("[CRON] sendStatusMail", s.user?.email, e)
      );
    }
  }

  /* 2.5. lấy lại toàn bộ session sau cập-nhật để lập báo cáo */
  const sessions = await db.classSessionRecord.findMany({
    where: { courseId: course.id },
    include: { user: true },
  });
      /* --- gửi báo cáo instructor --- */
      if (course.courseInstructor?.email) {
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
            Khóa học <strong>${
              course.title
            }</strong> đã được hệ thống tự động đóng lại.
            Dưới đây là báo cáo tiến độ cuối cùng của các nhân viên:
          </p>
          <table border="1" cellpadding="0" cellspacing="0"
                 style="border-collapse:collapse;width:100%;
                        font-family:'Times New Roman';font-size:12pt">
            <thead>
              <tr>
                <th style="padding:8px 18px">Tên nhân viên</th>
                <th style="padding:8px 18px">Kết quả</th>
                <th style="padding:8px 18px">Điểm số</th>
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

        try {
          await sendFinalReport(
            course.courseInstructor.email,
            course.title,
            htmlBody
          );
          // console.log(
          //   `[CRON] Report sent to ${course.courseInstructor.email} (${course.title})`
          // );
        } catch (e) {
          console.error("[CRON] Instructor mail error", e);
        }
      }
    }

    // console.log(
    //   `[CRON] Closed ${
    //     expired.length
    //   } courses – Updated ${totalSessionsUpdated} sessions – ${new Date().toISOString()}`
    // );
  } catch (err) {
    console.error("[CRON] Error while closing courses:", err);
  }
});

// console.log("[CRON] Scheduler initialised");
