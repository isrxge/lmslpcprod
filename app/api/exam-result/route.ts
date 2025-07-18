import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
import { db } from "@/lib/db";
/**
 * Body JSON mong đợi:
 * {
 *   "courseName"   : string,
 *   "moduleName"   : string,          // (tùy chọn) tên bài thi/chương
 *   "username"     : string,
 *   "emailAddress" : string,
 *   "score"        : number,          // 0‒100
 *   "passed"       : boolean,
 *   "attempt"      : number,
 *   "date"         : string | Date    // ISO
 * }
 */
export async function POST(req: Request) {
  try {
    const {
        userId,
      courseTitle,
      moduleTitle,
      username,
      emailAddress,
      score,
      passed,
      attempt,
      date,
    } = await req.json();

    let address  = emailAddress;
    let fullname = username;

    if ((!address || !fullname) && userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) {
        console.error("❌ ERROR: userId not found");
        return new NextResponse("User not found", { status: 404 });
      }
      address  = address  || user.email;
      fullname = fullname || user.username || "Learner";
    }

    /* Validate */
    if (!address) {
      console.error("❌ ERROR: No recipient email");
      return new NextResponse("No recipient email", { status: 400 });
    }
    if (!fullname) {
      console.error("❌ ERROR: No username");
      return new NextResponse("No username", { status: 400 });
    }

    /* -------------------- 1. Tạo transporter SMTP (Outlook) -------------------- */
    const transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        secureConnection: false,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: { ciphers: "SSLv3" },
      })
    );
    /* -------------------- 2. Nội dung mail -------------------- */
    const subject = `[LMS] Kết quả thi – ${courseTitle}`;
    const status  = passed ? "Passed" : "Failed";
    const examDate = new Date(date).toLocaleString();

    const text = `
Dear ${fullname},

Bạn vừa hoàn thành bài thi "${moduleTitle || courseTitle}" trong khóa học "${courseTitle}".

Kết quả của bạn như sau:
• Điểm: ${score}%
• Kết quả: ${status}
• Số lần: ${attempt}
• Ngày: ${examDate}

${passed ? "Chúc mừng bạn!" : "Chúc bạn may mắn lần sau."}

Regards,
Learning Management System Administration
`.trim();

    const html = `
<p style="font-family:'Times New Roman',serif;font-size:12pt;">Dear ${fullname},</p>
<p style="font-family:'Times New Roman',serif;font-size:12pt;">Bạn vừa hoàn thành bài thi <strong>${moduleTitle || courseTitle}</strong> trong khóa học <strong>${courseTitle}</strong>.</p>

<table style="font-family:'Times New Roman',serif;font-size:12pt;border-collapse:collapse;margin:8px 0;">
  <tr><td><strong>Điểm&nbsp;</strong></td><td>${score}%</td></tr>
  <tr><td><strong>Kết quả&nbsp;</strong></td><td>${status}</td></tr>
  <tr><td><strong>Số lần&nbsp;</strong></td><td>${attempt}</td></tr>
  <tr><td><strong>Ngày&nbsp;</strong></td><td>${examDate}</td></tr>
</table>

<p style="font-family:'Times New Roman',serif;font-size:12pt;">
  ${passed ? "Chúc mừng bạn!" : "Chúc bạn may mắn lần sau."}
</p>

<p style="font-family:'Times New Roman',serif;font-size:12pt;">Best regards,<br/>Learning Management System Administration</p>
`;

    /* -------------------- 3. Gửi mail -------------------- */
    await transporter.sendMail({
      from: "webmaster@lp.com.vn",
      to: address,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("EXAM_RESULT_MAIL_ERROR", error);
    return new NextResponse("Failed to send email", { status: 500 });
  }
}
