import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get("email")?.toString() || "Không cung cấp";
    const message = formData.get("message")?.toString() || "Không có nội dung";

    const images = formData.getAll("images") as File[];

    const attachments = await Promise.all(
      images.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          filename: file.name,
          content: buffer,
        };
      })
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: (process.env.PRD_MEMBER || "")
        .split(",")
        .map(addr => addr.trim())
        .filter(Boolean),
      cc: process.env.PRD_TEAM_LEAD,
      subject: `[LMS Feedback] User Report`,
      html: `
        <div style="font-family:'Times New Roman',serif;font-size:12pt;">
          <p><strong>Người gửi:</strong> ${email}</p>
          <p><strong>Nội dung:</strong></p>
          <p>${message}</p>
        </div>
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error sending report:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
