// const cron = require("node-cron");
// const nodemailer = require("nodemailer");
// const smtpTransport = require("nodemailer-smtp-transport");
// import { db } from "@/lib/db";

// const transporter = nodemailer.createTransport(
//   smtpTransport({
//     host: process.env.SMTP_HOST,
//     secureConnection: false,
//     port: 587,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//     tls: {
//       ciphers: "SSLv3", // Thiết lập cipher
//     },
//   })
// );

// // Hàm gửi email nhắc nhở
// const sendReminderEmail = async (
//   userEmail: string,
//   courseTitle: string
// ): Promise<void> => {
//   const emailContent = {
//     from: process.env.SMTP_USER, // Địa chỉ email gửi
//     to: userEmail, // Địa chỉ người nhận
//     subject: `[LMS] Reminder: ${courseTitle} is about to end!`,
//     text: `Dear staff,\n\nThis is a reminder that the course '${courseTitle}' is about to end. Please complete your course before the deadline.`,
//     html: `
//       <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Dear staff,</p>
//       <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">This is a reminder that the course '<strong>${courseTitle}</strong>' is about to end. Please complete your course before the deadline.</p>
//       <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Best regards,</p>
//       <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Learning Management System Administration</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(emailContent);
//     // console.log(`Reminder sent to: ${userEmail}`);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// // Hàm cron job
// const scheduleReminder = (reminderDate: string): void => {
//   cron.schedule("30 08 * * *", async () => {
//     // Chạy vào 18h06 mỗi ngày
//     const today = new Date();
//     const reminderDateObj = new Date(reminderDate);

//     // Kiểm tra nếu hôm nay là ngày nhắc nhở hoặc sau ngày nhắc nhở
//     if (today >= reminderDateObj) {
//       // console.log("Running cron job to send reminder emails...");

//       const courses = await db.course.findMany({
//         where: {
//           endDate: { gte: new Date(reminderDate) }, // endDate phải lớn hơn hoặc bằng ngày nhắc nhở
//           isPublished: true,
//           status: "open",
//         },
//         include: {
//           courseInstructor: true,
//           ClassSessionRecord: {
//             where: {
//               status: "studying", // Chỉ lấy các user có trạng thái "studying"
//             },
//             include: {
//               user: true, // Lấy thông tin user
//             },
//           },
//         },
//       });

//       // Lưu trữ email đã gửi để tránh gửi nhiều lần
//       const sentUsers = new Set<string>(); // Set để lưu trữ các email đã gửi

//       // Duyệt qua tất cả khóa học và lớp học
//       for (const course of courses) {
//         for (const classRecord of course.ClassSessionRecord) {
//           const user = classRecord.user;

//           // Kiểm tra xem người dùng đã nhận email chưa
//           if (user && user.email && !sentUsers.has(user.id)) {
//             // Gửi email nhắc nhở cho user nếu chưa gửi trước đó
//             await sendReminderEmail(user.email, course.title);
//             sentUsers.add(user.id); // Đánh dấu user đã nhận email
//           }
//         }

//         // // 2) Soạn & gửi báo cáo cho giảng viên
//         // if (course.courseInstructor?.email) {
//         //   const rows = course.ClassSessionRecord
//         //     .map((r) => {
//         //       return `
//         //         <tr>
//         //           <td>${r.user?.username ?? r.user?.email ?? "N/A"}</td>
//         //           <td>${r.progress ?? "—"}</td>
//         //           <td>${r.status ?? "—"}</td>
//         //         </tr>`;
//         //     })
//         //     .join("");

//         //   const reportHtml = `
//         //     <table border="1" cellpadding="4" style="border-collapse:collapse;font-family:'Times New Roman',serif;font-size:12pt;">
//         //       <thead>
//         //         <tr><th>Staff</th><th>Progress</th><th>Status</th></tr>
//         //       </thead>
//         //       <tbody>${rows}</tbody>
//         //     </table>`;

//         //   await sendInstructorReportEmail(
//         //     course.courseInstructor.email,
//         //     course.title,
//         //     reportHtml,
//         //   );
//         // }
//         // 2) Soạn & gửi báo cáo cho giảng viên — CHỈ KHI CÓ NGƯỜI ĐANG STUDYING
//         const studyingRecords = course.ClassSessionRecord; // đã được where { status:"studying" }
//         if (
//           studyingRecords.length > 0 && // ← điều kiện mới
//           course.courseInstructor?.email
//         ) {
//           const rows = studyingRecords
//             .map(
//               (r) => `
//       <tr>
//         <td>${r.user?.username ?? r.user?.email ?? "N/A"}</td>
//         <td>${r.progress ?? "—"}</td>
//         <td>${r.status ?? "—"}</td>
//       </tr>`
//             )
//             .join("");

//           const reportHtml = `
//     <table border="1" cellpadding="4" style="border-collapse:collapse;font-family:'Times New Roman',serif;font-size:12pt;">
//       <thead>
//         <tr><th>Staff</th><th>Progress</th><th>Status</th></tr>
//       </thead>
//       <tbody>${rows}</tbody>
//     </table>`;

//           await sendInstructorReportEmail(
//             course.courseInstructor.email,
//             course.title,
//             reportHtml
//           );
//         } else {
//           // Không còn ai đang học → không gửi báo cáo
//           // optional: console.log(`[LMS] No learners in progress for ${course.title}, skip report.`);
//         }
//       }
//     }
//   });
// };

// const sendInstructorReportEmail = async (
//   instructorEmail: string,
//   courseTitle: string,
//   reportHtml: string
// ): Promise<void> => {
//   const emailContent = {
//     from: process.env.SMTP_USER,
//     to: instructorEmail,
//     subject: `[LMS] Learners still in progress – ${courseTitle}`,
//     text: `Progress report for "${courseTitle}". See HTML version in a mail client that supports it.`,
//     html: `
//       <p style="font-family:'Times New Roman',serif;font-size:12pt;">
//         Dear instructor,<br/>
//         This daily snapshot lists ONLY the staff whose status is still “studying” in <strong>${courseTitle}</strong>.<br/>
//         Please review and encourage them to complete the course.
//       </p>
//       ${reportHtml}
//       <p style="font-family:'Times New Roman',serif;font-size:12pt;">Best regards,<br/>Learning Management System Administration</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(emailContent);
//     // console.log(`Instructor report sent to: ${instructorEmail}`);
//   } catch (error) {
//     console.error("Error sending instructor email:", error);
//   }
// };

// // Hàm tính toán ngày nhắc nhở
// const calculateReminderDate = (
//   endDate: Date | null,
//   notifyDate: number
// ): string => {
//   if (!endDate) {
//     throw new Error("End date is required");
//   }
//   const reminderDate = new Date(endDate);
//   reminderDate.setDate(reminderDate.getDate() - notifyDate); // Trừ notifyDate từ endDate
//   return reminderDate.toISOString().split("T")[0]; // Trả về định dạng YYYY-MM-DD
// };

// // Lấy dữ liệu khóa học từ database và lên lịch cron job cho mỗi khóa học
// export const sendReminders = async (): Promise<void> => {
//   const courses = await db.course.findMany({
//     where: {
//       endDate: { gte: new Date() }, // Kiểm tra các khóa học có endDate chưa qua
//     },
//   });

//   for (const course of courses) {
//     const reminderDate = calculateReminderDate(
//       course.endDate,
//       course.notifyDate || 0
//     );
//     scheduleReminder(reminderDate); // Lên lịch cron job cho ngày nhắc nhở
//   }
// };

// // Gọi hàm để chạy
// // sendReminders();

// // console.log("Cron job setup complete.");
