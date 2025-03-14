// /pages/api/send-email.ts

import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

export async function POST(req: Request) {
  try {
    const { courseName, username, emailAddress } = await req.json();

    // Thiết lập nội dung email
    // const emailContent = {
    //   from: "webmaster@lp.com.vn",
    //   to: emailAddress, // Gửi tới người dùng
    //   subject: `You have been assigned to the course: ${courseName}`,
    //   text: `Hello ${username},\n\nYou have been successfully assigned to the course: ${courseName}.`,
    //   html: `
    //     <p>Hello ${username},</p>
    //     <p>You have been successfully assigned to the course: <strong>${courseName}</strong>.</p>
    //     <p>If you have any questions, feel free to reach out.</p>
    //   `,
    // };

    const emailContent = {
      from: "webmaster@lp.com.vn",
      to: emailAddress, // Gửi tới người dùng
      subject: `[LMS] You've been assigned to the course: ${courseName}`,
      text: `Dear ${username},\n\nYou have been successfully assigned to the course: ${courseName}.\n\nPlease access the learning system at your earliest convenience to review course materials and further instructions.\nIf you have any questions or require assistance, please feel free to reach out.\n\nBest regards,\nLearning Management System Administration`,
      html: `
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Dear ${username},</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">You have been successfully assigned to the course: <strong>${courseName}</strong>.</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Please access the learning system at your earliest convenience to review course materials and further instructions.</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">If you have any questions or require assistance, please feel free to reach out.</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Best regards,</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Learning Management System Administration</p>
      `,
    };

    // Cấu hình nodemailer
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

    // Gửi email
    await transporter.sendMail(emailContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" });
  }
}
