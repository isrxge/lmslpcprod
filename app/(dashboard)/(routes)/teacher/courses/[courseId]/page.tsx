import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  SquareDashedBottomCode,
  UserPlus,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { TypeForm } from "./_components/type-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";

// import { PriceForm } from "./_components/price-form";
// import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { Prisma } from "@prisma/client";
import { CreditForm } from "./_components/credit-form";
import { DepartmentForm } from "./_components/department-form";
import { InstructorAssignForm } from "./_components/instructor-assign";
import { EndDateForm } from "./_components/enddate-form";
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const checkUser = await db.userPermission.findMany({
    where: {
      userId: userId,
    },
    include: {
      permission: true,
    },
  });
  if (
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit course permission") == -1
  ) {
    return redirect("/");
  }
  const course: any = await db.course.findUnique({
    where: {
      id: params.courseId,
      // userId,
    },
    include: {
      modules: {
        include: {
          module: {},
        },
        orderBy: {
          position: "desc",
        },
      },
      ClassSessionRecord: { include: { user: true } },
      CourseOnDepartment: {
        include: {
          Department: true,
        },
      },
      // attachments: {
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      // },
    },
  });

  const userDepartment: any = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Department: true,
    },
  });

  const department: any = await db.department.findMany({
    include: {
      User: true,
    },
  });
  //advance permission
  const checkUserPermissions = checkUser.map(
    (item: { permission: { title: any } }) => item.permission.title
  );

  const hasEditAdvancedPermission = checkUserPermissions.includes(
    "Edit advance course permission"
  );

  let filteredDepartment = [];

  if (hasEditAdvancedPermission) {
    // If the user has "Edit advance course permission", show all departments
    filteredDepartment = department;
  } else {
    // Otherwise, filter departments based on the user's department
    filteredDepartment = department.filter(
      (dept: any) => dept.id === userDepartment?.Department?.id
    );
  }

  // const filteredDepartment = department.filter(
  //   (dept:any) => dept.id === userDepartment?.Department?.id
  // );

  for (let i = 0; i < filteredDepartment.length; i++) {
    filteredDepartment[i]["isEnrolled"] = false;
    for (let j = 0; j < filteredDepartment[i]?.User.length; j++) {
      if (
        course.ClassSessionRecord.map((item: any) => item.userId).indexOf(
          filteredDepartment[i].User[j].id
        ) !== -1
      ) {
        filteredDepartment[i].User[j]["isEnrolled"] = true;
        filteredDepartment[i].User[j]["canUndo"] = false;
        filteredDepartment[i]["isEnrolled"] = true;
        filteredDepartment[i]["canUndo"] = false;
      } else {
        filteredDepartment[i].User[j]["isEnrolled"] = false;
        filteredDepartment[i].User[j]["canUndo"] = true;
        filteredDepartment[i]["isEnrolled"] = false;
        filteredDepartment[i]["canUndo"] = true;
      }
    }
  }

  // for (let i = 0; i < department.length; i++) {
  //   // if (
  //   //   course.CourseOnDepartment.map((item: any) => item.departmentId).indexOf(
  //   //     department[i].id
  //   //   ) !== -1
  //   // ) {

  //   // } else {

  //   // }
  //   department[i]["isEnrolled"] = false;
  //   for (let j = 0; j < department[i]?.User.length; j++) {
  //     if (
  //       course.ClassSessionRecord.map((item: any) => item.userId).indexOf(
  //         department[i].User[j].id
  //       ) !== -1
  //     ) {
  //       department[i].User[j]["isEnrolled"] = true;
  //       department[i].User[j]["canUndo"] = false;
  //       department[i]["isEnrolled"] = true;
  //       department[i]["canUndo"] = false;
  //     } else {
  //       department[i].User[j]["isEnrolled"] = false;
  //       department[i].User[j]["canUndo"] = true;
  //       department[i]["isEnrolled"] = false;
  //       department[i]["canUndo"] = true;
  //     }
  //   }
  // }

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    // course.description,
    course.imageUrl,
    course.credit,
    // course.departmentId,
    // course.price,
    // course.programId,
    // course.courseInstructedBy,
    // course.Module.some((chapter: { isPublished: any }) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const users: any = await db.user.findMany({
    where: {
      userPermission: {
        some: {
          permission: {
            title: "Instruction permission",
          },
        },
      },
    },
    include: {
      Department: true,
    },
  });
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == course.courseInstructedBy) {
      users[i]["isAssign"] = true;
    } else {
      users[i]["isAssign"] = false;
    }
  }

  if (course.type != "Self Study") {
    requiredFields.push(
      course.modules.some(
        (chapter: { module: any }) => chapter.module.type == "Exam"
      )
    );
  }
  const isComplete = requiredFields.every(Boolean);

  // console.log("Course modules ABCD:", course.modules.some((chapter: { module: any }) => chapter.module.type == "Exam"));
  // console.log("requiredFields:", requiredFields);
  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the staff." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <Link
              href={`/teacher/courses`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course
            </Link>
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            title={course.title}
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
            endDate={course.endDate}
            creatorId={course.userId}
            canDeleteAny={hasEditAdvancedPermission}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <div className="space-y-6 mt-4">
              <TitleForm initialData={course} courseId={course.id} />
              <TypeForm initialData={course} courseId={course.id} />
              <CreditForm initialData={course} courseId={course.id} />
              <DescriptionForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <div className="mt-4">
                <ChaptersForm
                  initialData={course}
                  courseType={course.type}
                  courseId={course.id}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Target} />
                <h2 className="text-xl">Deadline</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Note: The course will end at 00:00 on the end date.
              </p>
              <div>
                <EndDateForm
                  initialData={course}
                  courseId={course.id}
                  // deadline={endDate}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPlus} />
                <h2 className="text-xl">
                  Assign staff & instructor for this course
                </h2>
              </div>
              <div className="mt-4">
                <DepartmentForm
                  initialData={course}
                  courseId={course.id}
                  department={filteredDepartment}
                />
                <InstructorAssignForm
                  initialData={course}
                  courseId={course.id}
                  Instructor={users}
                />
              </div>
            </div>
            {/* <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPlus} />
                <h2 className="text-xl">Assign instructor for this course</h2>
              </div>
              <div className="mt-4">
                <InstructorAssignForm
                  initialData={course}
                  courseId={course.id}
                  Instructor={users}
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
