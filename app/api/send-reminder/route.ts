import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import exp from "constants";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

// 1. Setup transporter
const transporter = nodemailer.createTransport(
  smtpTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
      user: "webmaster@lp.com.vn",
      pass: "yqpcfbbvhfrvfbwz",
    },
    tls: {
      ciphers: "SSLv3",
    },
  })
);

// 2. Send reminder email
const sendReminderEmail = async (userEmail: string, courseTitle: string) => {
  const emailContent = {
    from: "webmaster@lp.com.vn",
    to: userEmail,
    subject: `[LMS] Reminder: ${courseTitle} is about to end!`,
    html: `
      <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Dear staff,</p>
      <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">This is a reminder that the course '<strong>${courseTitle}</strong>' is about to end. Please complete your course before the deadline.</p>
      <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Best regards,</p>
      <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Learning Management System Administration</p>
    `,
  };

  await transporter.sendMail(emailContent);
};

// 3. Send report email
const sendInstructorReportEmail = async (
  email: string,
  title: string,
  html: string
) => {
  await transporter.sendMail({
    from: "webmaster@lp.com.vn",
    to: email,
    subject: `[LMS] Learners still in progress – ${title}`,
    html: `
      <p style="font-family:'Times New Roman',serif;font-size:12pt;">
        Dear instructor,<br/>
        This daily snapshot lists ONLY the staff whose status is still “studying” in <strong>${title}</strong>.<br/>
        Please review and encourage them to complete the course.
      </p>
      ${html}
      <p style="font-family:'Times New Roman',serif;font-size:12pt;">Best regards,<br/>Learning Management System Administration</p>
    `,
  });
};

// 4. Tính ngày reminder
const calculateReminderDate = (endDate: Date | null, notifyDate: number): string => {
  if (!endDate) throw new Error("End date is required");
  const reminderDate = new Date(endDate);
  reminderDate.setDate(reminderDate.getDate() - notifyDate);
  return reminderDate.toISOString().split("T")[0];
};

// 5. Main logic
const handleReminder = async () => {
  const logs: string[] = [];
  const todayStr = new Date().toISOString().split("T")[0];
  const todayStart = new Date(todayStr);
  const todayEnd = new Date(todayStr);
  todayEnd.setHours(23, 59, 59, 999);

  logs.push(`[Reminder] Script started at ${new Date().toISOString()}`);

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      status: "open",
      endDate: { gte: new Date() },
    },
    include: {
      courseInstructor: true,
      ClassSessionRecord: {
        where: { status: "studying" },
        include: { user: true },
      },
    },
  });

  logs.push(`[Reminder] Found ${courses.length} open courses`);

  for (const course of courses) {
    const reminderDateStr = calculateReminderDate(course.endDate, course.notifyDate || 0);
    const reminderDate = new Date(reminderDateStr);

    if (new Date().toDateString() !== reminderDate.toDateString()) {
      logs.push(`[Reminder] ⏩ Today is NOT reminder day for "${course.title}", skipping`);
      continue;
    }

    // if (new Date().toDateString() === reminderDate.toDateString()) {
      for (const record of course.ClassSessionRecord) {
        const user = record.user;
        if (user?.email) {
          const existed = await db.notificationLog.findFirst({
            where: {
              userId: user.id,
              courseId: course.id,
              type: "reminder",
              sentDate: { gte: todayStart, lt: todayEnd },
            },
          });
          if (!existed) {
            await sendReminderEmail(user.email, course.title);
            await db.notificationLog.create({
              data: {
                userId: user.id,
                courseId: course.id,
                type: "reminder",
                sentDate: new Date(),
              },
            });
            logs.push(`[Reminder] ✅ Sent reminder to ${user.email} for "${course.title}"`);
          }
          else {
            logs.push(`[Reminder] ⏩ Already reminded ${user.email}, skipping`);
          }
        }
      }

      if (
        course.courseInstructor?.email &&
        course.ClassSessionRecord.length > 0
      ) {
        const reportRows = course.ClassSessionRecord
          .map(
            (r) => `
              <tr>
                <td>${r.user?.username ?? r.user?.email}</td>
                <td>${r.progress ?? "—"}</td>
                <td>${r.status ?? "—"}</td>
              </tr>`
          )
          .join("");

        const reportHtml = `
          <table border="1" cellpadding="4" style="font-family:'Times New Roman',serif;font-size:12pt;border-collapse:collapse">
            <thead><tr><th>Staff</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>${reportRows}</tbody>
          </table>`;

        const reportExisted = await db.notificationLog.findFirst({
          where: {
            userId: course.courseInstructor.id,
            courseId: course.id,
            type: "instructor_report",
            sentDate: { gte: todayStart, lt: todayEnd },
          },
        });

        if (!reportExisted) {
          console.log(`[Reminder] Sending report to instructor ${course.courseInstructor.email} for course "${course.title}"`);
          await sendInstructorReportEmail(
            course.courseInstructor.email,
            course.title,
            reportHtml
          );
          await db.notificationLog.create({
            data: {
              userId: course.courseInstructor.id,
              courseId: course.id,
              type: "instructor_report",
              sentDate: new Date(),
            },
          });
          logs.push(`[Reminder] ✅ Sent instructor report to ${course.courseInstructor.email} for "${course.title}"`);
        } else {
          logs.push(`[Reminder] ⏩ Already sent instructor report to ${course.courseInstructor.email}, skipping`);
        }
    //   } else {
    //   console.log(`[Reminder] Today is NOT the reminder day for course "${course.title}", skipping`);
    // // }
    }
  }
  logs.push(`[Reminder] ✅ Finished at ${new Date().toISOString()}`);
  return logs;
};

export const dynamic = "force-dynamic"; // ✅ Force dynamic rendering for this route
// ✅ App Router requires named export
export async function GET(req: NextRequest) {
  try {
    console.log("[API] /api/send-reminder called");
    const logs = await handleReminder();
    await handleReminder(); // ✅ Chỉ chạy khi được gọi
    return NextResponse.json({ message: "Reminder process completed",
      details: logs, });
  } catch (error) {
    console.error("Reminder error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
