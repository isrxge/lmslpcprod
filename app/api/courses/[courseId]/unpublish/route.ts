import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false,
        updateDate: new Date(),
        updatedBy: userId,
      },
    });
     const getCourse: any = await db.course.findFirst({
      where: {
        id: params.courseId,
      },
      include: {
        courseInstructor: {},
        updatedUser: {},
        ClassSessionRecord: {
          include: {
            user: {},
          },
        },
      },
    });
    // gửi mail cho người thực hiện update khóa học
    const emailContentForUpdate = {
      from: "webmaster@lp.com.vn",
      to: getCourse.updatedUser.email, // Gửi tới người dùng
      subject: `[LMS] thông báo phát hành khóa học: ${getCourse.title}`,
      text: `Khóa học ${getCourse.title} đã được phát hành.`,
      html: `
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Khóa học ${getCourse.title} đã được thu hồi.</p>`,
    };

    let mailRepList = [];
    for (let i = 0; i < getCourse.ClassSessionRecord.length; i++) {
      mailRepList.push(getCourse.ClassSessionRecord[i].user.email);
    }
    // Gửi email

    // gửi mail cho người tham gia khóa học
    const emailContentForStaff = {
      from: "webmaster@lp.com.vn",
      to: getCourse.updatedUser.email, // Gửi tới người dùng
      subject: `[LMS] thông báo phát hành khóa học: ${getCourse.title}`,
      text: `Khóa học ${getCourse.title} đã được phát hành.`,
      html: `
        <p style="font-family: 'Times New Roman', serif; font-size: 12pt;">Khóa học ${getCourse.title} đã được thụ hồi, bạn sẽ không thể truy cập khóa học.</p>`,
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
    await transporter.sendMail(emailContentForUpdate);
    await transporter.sendMail(emailContentForStaff);
    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
