import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
// export async function PATCH(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { userId } = auth();
//     const { departmentList, assignList }: any = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     const course: any = await db.course.findUnique({
//       where: {
//         id: params.courseId,
//       },
//     });
//     const deleteAllLink = await db.courseOnDepartment.deleteMany({
//       where: {
//         courseId: params.courseId,
//       },
//     });
//     const date = new Date();
//     for (let i = 0; i < departmentList.length; i++) {
//       if (departmentList[i].isEnrolled && departmentList[i].canUndo) {
//         const updateCourse = await db.courseOnDepartment.create({
//           data: {
//             courseId: params.courseId,
//             departmentId: departmentList[i].id,
//           },
//         });
//       } else {
//       }
//     }
//     for (let i = 0; i < assignList.length; i++) {
//       if (assignList[i].isEnrolled && assignList[i].canUndo) {
//         let checkIfExist = await db.classSessionRecord.findFirst({
//           where: {
//             userId: assignList[i].id,
//             courseId: params.courseId,
//           },
//         });
//         if (
//           checkIfExist?.status == "studying" ||
//           checkIfExist?.status == "finished"
//         ) {
//           // If the user is already assigned and their status is studying or finished, skip
//           continue;
//         } else {
//           const emailMessage = {
//             from: "Webmaster@lp.com.vn",
//             to: assignList[i].email,
//             cc: "",
//             subject: `You have been assigned to course ${course.title}`,
//             text: `You have been assigned to course ${course.title}.`,
//             html: `<p>You have been assigned to course ${course.title}</p>`,
//           };

//           let transporter = nodemailer.createTransport(
//             smtpTransport({
//               host: "smtp-mail.outlook.com",
//               secureConnection: false, // TLS requires secureConnection to be false
//               port: 587, // port for secure SMTP
//               auth: {
//                 user: "Webmaster@lp.com.vn",
//                 pass: "Lpc@236238$",
//               },
//               tls: {
//                 ciphers: "SSLv3",
//               },
//             })
//           );

//           try {
//             // Send email notification to the assigned user
//             await transporter.sendMail(emailMessage);
//           } catch (emailError) {
//             console.error("Error sending email to", assignList[i].email, emailError);
//           }
//           // }
//           await db.classSessionRecord.createMany({
//             data: {
//               userId: assignList[i].id,
//               courseId: params.courseId,
//               progress: "0%",
//               status: "studying",
//               startDate: date,
//             },
//             skipDuplicates: true,
//           });
//         }
//       }
//     }

//     return NextResponse.json("");
//   } catch (error) {
//     console.log("DEPARTMENT_ERROR", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { departmentList, assignList }: any = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Lấy thông tin khóa học
    const course: any = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    // Xóa các bản ghi liên quan đến khóa học trước
    await db.courseOnDepartment.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Thực hiện gán khóa học cho các phòng ban
    for (let i = 0; i < departmentList.length; i++) {
      // Kiểm tra nếu phòng ban đã được phân công hoặc có thành viên được phân công
      const departmentHasAssignedMember = departmentList[i].User.some((user: any) => user.isEnrolled);

      // Nếu phòng ban có thành viên được phân công (hoặc toàn bộ phòng ban được phân công)
      if (departmentList[i].isEnrolled || departmentHasAssignedMember) {
        // Kiểm tra nếu đã có bản ghi trong courseOnDepartment cho khóa học và phòng ban này
        const existingCourseOnDepartment = await db.courseOnDepartment.findFirst({
          where: {
            courseId: params.courseId,
            departmentId: departmentList[i].id,
          },
        });

        if (existingCourseOnDepartment) {
          console.log(`Course ${params.courseId} is already assigned to department ${departmentList[i].id}`);
          continue; // Nếu đã có bản ghi, bỏ qua
        }

        // Nếu chưa có bản ghi, tạo bản ghi mới
        const updateCourse = await db.courseOnDepartment.create({
          data: {
            courseId: params.courseId,
            departmentId: departmentList[i].id,
          },
        });
      }
    }

    // Thực hiện gán khóa học cho từng người dùng
    const date = new Date();
    for (let i = 0; i < assignList.length; i++) {
      if (assignList[i].isEnrolled && assignList[i].canUndo) {
        let checkIfExist = await db.classSessionRecord.findFirst({
          where: {
            userId: assignList[i].id,
            courseId: params.courseId,
          },
        });

        // Kiểm tra nếu người dùng đã tham gia khóa học
        if (checkIfExist?.status == "studying" || checkIfExist?.status == "finished") {
          continue; // Nếu người dùng đã có khóa học và đang học hoặc đã hoàn thành, bỏ qua
        }

        // Gửi email thông báo cho người dùng được phân công
        const emailMessage = {
          from: "Webmaster@lp.com.vn",
          to: assignList[i].email,
          cc: "",
          subject: `You have been assigned to course ${course.title}`,
          text: `You have been assigned to course ${course.title}.`,
          html: `<p>You have been assigned to course ${course.title}</p>`,
        };

        let transporter = nodemailer.createTransport(
          smtpTransport({
            host: "smtp-mail.outlook.com",
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
              user: "Webmaster@lp.com.vn",
              pass: "Lpc@236238$",
            },
            tls: {
              ciphers: "SSLv3",
            },
          })
        );

        try {
          // Gửi email thông báo
          await transporter.sendMail(emailMessage);
        } catch (emailError) {
          console.error("Error sending email to", assignList[i].email, emailError);
        }

        // Tạo bản ghi session cho người dùng
        await db.classSessionRecord.createMany({
          data: {
            userId: assignList[i].id,
            courseId: params.courseId,
            progress: "0%",
            status: "studying",
            startDate: date,
          },
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json("");
  } catch (error) {
    console.log("DEPARTMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

