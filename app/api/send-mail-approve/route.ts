import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

export async function POST(req: Request) {
  try {
    const { username, emailAddress } = await req.json();

    // Thiết lập nội dung email
    // const emailContent = {
    //   from: process.env.SMTP_USER,
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
      from: process.env.SMTP_USER,
      to: emailAddress, // Gửi tới người dùng
      subject: `[LMS] Tài khoản của bạn đã được phê duyệt và kích hoạt`, // Subject for approval notification
      text: `Dear ${username},\n\nTài khoản của bạn đã được phê duyệt thành công và hiện đã có quyền truy cập vào hệ thống. Bạn có thể đăng nhập và bắt đầu sử dụng nền tảng.\n\nNếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi.\n\n🔗 Truy cập hệ thống tại: http://lms.lp.local\n\nBest regards,\nLearning Management System Administration`,
      html: `
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Dear ${username},</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Tài khoản của bạn đã được phê duyệt thành công và hiện đã có quyền truy cập vào hệ thống. Bạn có thể đăng nhập và bắt đầu sử dụng nền tảng.</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi.</p>
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;"><strong>🔗 Đường dẫn truy cập hệ thống:</strong> <a href="http://lms.lp.local">http://lms.lp.local</a></p>
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
    return NextResponse.json({ success: false, message: "Failed to send email" });
  }
}
