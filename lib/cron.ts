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
    host: "smtp-mail.outlook.com",
    port: 587,
    secureConnection: false,
    auth: { user: "webmaster@lp.com.vn", pass: "yqpcfbbvhfrvfbwz" },
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
    from: "webmaster@lp.com.vn",
    to: email,
    subject: `[LMS] Course ${courseTitle} closed – Status: ${status}`,
    html: `
      <p style="font-family:'Times New Roman';font-size:12pt">
        Dear staff,<br/>
        The course <strong>${courseTitle}</strong> has been closed.<br/>
        Your final status: <strong>${status}</strong> (score ${score}).<br/>
        ${
          status === "failed"
            ? "Please contact your instructor for further guidance."
            : "Congratulations on completing the course!"
        }
      </p>
      <p style="font-family:'Times New Roman';font-size:12pt">
        Best regards,<br/>Learning Management System Administration
      </p>
    `,
  });

const sendFinalReport = async (to: string, courseTitle: string, body: string) =>
  transporter.sendMail({
    from: "webmaster@lp.com.vn",
    to,
    subject: `[LMS] Final progress report – ${courseTitle}`,
    html: body,
  });

/* ---------- CRON 07:00 ---------- */
cron.schedule("45 9 * * *", async () => {
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

      // 2.2. cập-nhật session còn studying
      const { count } = await db.classSessionRecord.updateMany({
        where: { courseId: course.id, status: "studying" },
        data: updateData,
      });
      totalSessionsUpdated += count;

      // 2.3. lấy again toàn bộ session sau update
      const sessions = await db.classSessionRecord.findMany({
        where: { courseId: course.id },
        include: { user: true },
      });

      /* --- gửi mail staff vừa bị cập nhật --- */
      const targetStatus = isSelf ? "finished" : "failed";
      const scoreVal = isSelf ? 100 : 0;

      const affected = sessions.filter((s) => s.status === targetStatus);
      for (const s of affected) {
        if (s.user?.email) {
          sendStatusMail(
            s.user.email,
            course.title,
            targetStatus as any,
            scoreVal
          ).catch((e) =>
            console.error("[CRON] sendStatusMail", s.user?.email, e)
          );
        }
      }

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
            Dear instructor,<br/>
            The course <strong>${
              course.title
            }</strong> has been automatically closed.
            Below is the final progress of your staff.
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
          console.log(
            `[CRON] Report sent to ${course.courseInstructor.email} (${course.title})`
          );
        } catch (e) {
          console.error("[CRON] Instructor mail error", e);
        }
      }
    }

    console.log(
      `[CRON] Closed ${
        expired.length
      } courses – Updated ${totalSessionsUpdated} sessions – ${new Date().toISOString()}`
    );
  } catch (err) {
    console.error("[CRON] Error while closing courses:", err);
  }
});

console.log("[CRON] Scheduler initialised");
