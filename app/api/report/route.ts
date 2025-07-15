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
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: "webmaster@lp.com.vn",
        pass: "yqpcfbbvhfrvfbwz",
      },
    });

    await transporter.sendMail({
      from: "webmaster@lp.com.vn",
      to: "khoa.nguyendang@lp.com.vn",
      subject: `[LMS Feedback] User Report`,
      html: `
        <p><strong>Người gửi:</strong> ${email}</p>
        <p><strong>Nội dung:</strong></p>
        <p>${message}</p>
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error sending report:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
