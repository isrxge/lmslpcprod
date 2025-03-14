import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

export async function POST(req: Request) {
  try {
    const { username, emailAddress } = await req.json();

    // Thiết lập nội dung email
    // const emailContent = {
    //   from: "webmaster@lp.com.vn",
    //   to: emailAddress, // Gửi tới người dùng
    //   subject: `LMS: Your account has been approved`, // Subject for approval notification
    //   text: `Hello ${username},\n\nYour account has been successfully approved, and you now have access to the system. You can log in and start using the platform.`,
    //   html: `
    //     <p>Hello ${username},</p>
    //     <p>Your account has been successfully approved, and you now have access to the system. You can log in and start using the platform.</p>
    //     <p>If you have any questions, feel free to reach out to us.</p>
    //   `,
    // };

    const emailContent = {
      from: "webmaster@lp.com.vn",
      to: emailAddress, // Gửi tới người dùng
      subject: `[LMS] Your account has been approved and activated`, // Subject for approval notification
      text: `Dear ${username},\n\nYour account has been successfully approved, and you now have access to the system. You can log in and start using the platform.\n\nIf you have any questions or require assistance, please feel free to reach out.\n\nBest regards,\nLearning Management System Administration`,
      html: `
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Dear ${username},</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Your account has been successfully approved, and you now have access to the system. You can log in and start using the platform.</p>
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
          pass: "yqpcfbbvhfrvfbwz", // Use secure authentication credentials
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
