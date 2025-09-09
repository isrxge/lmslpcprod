import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.update({
      where: { id: params.userId },
      data: {
        status: values.status,
      },
    });
    // const mess = {
    //   from: process.env.SMTP_USER,
    //   to: user.email,
    //   cc: "",
    //   subject: `you have been ${values.status} the system`,
    //   text: `
    //   you have been ${values.status} the system
    //   `,
    //   html: `
    //     <p>you have been ${values.status} the system.</p>

    //   `,
    // };
    const mess = {
      from: process.env.SMTP_USER,
      to: user.email,
      cc: "",
      subject: `Tài khoản của bạn đã được ${values.status} trên hệ thống`,
      text: `
Dear bạn,

Tài khoản của bạn đã được ${values.status} trên hệ thống.

Nếu bạn có bất kỳ thắc mắc nào hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.

Best regards,  
Learning Management System Administration
  `,
      html: `
    <p>Dear bạn,</p>

    <p>Tài khoản của bạn đã được <strong>${values.status}</strong> trên hệ thống.</p>

    <p>Nếu bạn có bất kỳ thắc mắc nào hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.</p>

    <p>Best regards,<br/>
    <strong>Learning Management System Administration</strong></p>
  `,
    };

    let transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          ciphers: "SSLv3",
        },
      })
    );

    try {
      //send email
      const res = await transporter.sendMail(mess);

      // return res.status(200).json({ success: true });
    } catch (err) {
      console.log("Mail send: ", err);
    }
    return NextResponse.json(user);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: params.userId },
      include: {
        ClassSessionRecord: {
          where: {
            userId: params.userId,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
