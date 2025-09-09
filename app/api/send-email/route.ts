// /pages/api/send-email.ts

import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

export async function POST(req: Request) {
  try {
    const { courseName, username, emailAddress, courseId  } = await req.json();
    const courseUrl = `http://lms.lp.local/courses/${courseId }`;

    // Thiết lập nội dung email
    // const emailContent = {
    //   from: process.env.SMTP_USER,
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
      from: process.env.SMTP_USER,
      to: emailAddress, // Gửi tới người dùng
      subject: `[LMS] Bạn đã được phân công vào khóa học: ${courseName}`,
      text: `Dear ${username},\n\nBạn đã được phân công vào khóa học: ${courseName}.\n\nHãy truy cập hệ thống học tập để bắt đầu xem tài liệu và hướng dẫn của khóa học tại đường dẫn:\n${courseUrl}\n\nMọi thắc mắc, bạn vui lòng trao đổi với người hướng dẫn hoặc bộ phận hỗ trợ.\n\nBest regards,\nLearning Management System Administration`,
      html: `
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Dear ${username},</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Bạn đã được phân công vào khóa học: <strong>${courseName}</strong>.</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Hãy truy cập hệ thống học tập để bắt đầu xem tài liệu và hướng dẫn của khóa học tại liên kết sau:</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">
          <a href="${courseUrl}" target="_blank" style="color: #1a73e8; text-decoration: underline;">Truy cập tại đây</a>
        </p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Mọi thắc mắc, bạn vui lòng trao đổi với người hướng dẫn hoặc bộ phận hỗ trợ.</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Best regards,</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Learning Management System Administration</p>
      `,
    };

    // Cấu hình nodemailer
    const transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        secureConnection: false,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
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
    return NextResponse.json({
      success: false,
      message: "Failed to send email",
    });
  }
}
