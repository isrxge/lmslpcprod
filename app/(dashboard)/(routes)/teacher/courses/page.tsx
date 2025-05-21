import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {
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

  const userDepartment: any = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Department: true,
    },
  });

  if (
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Edit course permission") == -1 &&
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Create course permission") == -1
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("View course permission") == -1
  ) {
    return redirect("/");
  }

  const hasEditAdvancedPermission = checkUser
    .map((item: { permission: { title: any } }) => item.permission.title)
    .indexOf("Edit advance course permission") !== -1;

  const hasManageAllCoursePermission = checkUser
    .map((item: { permission: { title: any } }) => item.permission.title)
    .indexOf("Manage all course permission") !== -1;

  let courses;

  // if (
  //   // userDepartment.title !== "BOD" && // User is not in BOD department
  //   !hasManageAllCoursePermission // User does not have "Manage all course permission"
  // ) {
  //   // User can only see courses within their own department
  //   courses = await db.course.findMany({
  //     where: {
  //       OR: [
  //         {
  //           userId: userId,
  //         },
  //         {
  //           CourseOnDepartment: {
  //             some: {
  //               departmentId: userDepartment?.Department?.id,
  //             },
  //           },
  //         }
  //         // {
  //         //   updatedBy: userId,
  //         // },
  //       ],
  //       // CourseOnDepartment: {
  //       //   some: {
  //       //     departmentId: userDepartment?.Department?.id,
  //       //   },
  //       // },
  //     },
  //     orderBy: {
  //       startDate: "desc",
  //     },
  //     include: {
  //       user: true,
  //       updatedUser: true,
  //       courseInstructor: true,
  //       modules: {},
  //       CourseOnDepartment: {
  //         include: {
  //           Department: true, // Include department information
  //         },
  //       },
  //     },
  //   });
  // } else if (hasEditAdvancedPermission) {
  //   // If the user has "Edit advance course permission", show all courses
  //   courses = await db.course.findMany({
  //     orderBy: {
  //       startDate: "desc",
  //     },
  //     include: {
  //       user: true,
  //       updatedUser: true,
  //       courseInstructor: true,
  //       modules: {},
  //       CourseOnDepartment: {
  //         include: {
  //           Department: true, // Include department information
  //         },
  //       },
  //     },
  //   });
  // } else {
  //   // If the user doesn't have the necessary permissions, show their department's courses
  //   courses = await db.course.findMany({
  //     where: {
  //       // CourseOnDepartment: {
  //       //   some: {
  //       //     departmentId: userDepartment?.Department?.id,
  //       //   },
  //       // },
  //       OR: [
  //         {
  //           userId: userId,
  //         },
  //         {
  //           CourseOnDepartment: {
  //             some: {
  //               departmentId: userDepartment?.Department?.id,
  //             },
  //           },
  //         }
  //         // {
  //         //   updatedBy: userId,
  //         // },
  //       ],
  //     },
  //     orderBy: {
  //       startDate: "desc",
  //     },
  //     include: {
  //       user: true,
  //       updatedUser: true,
  //       courseInstructor: true,
  //       modules: {},
  //       CourseOnDepartment: {
  //         include: {
  //           Department: true, // Include department information
  //         },
  //       },
  //     },
  //   });
  // }

  if (
    hasManageAllCoursePermission 
  ) {
    // User can only see courses within their own department
    courses = await db.course.findMany({
      orderBy: {
        startDate: "desc",
      },
      include: {
        user: true,
        updatedUser: true,
        courseInstructor: true,
        modules: {},
        CourseOnDepartment: {
          include: {
            Department: true, // Include department information
          },
        },
      },
    });
  } else if (hasEditAdvancedPermission) {
    // If the user has "Edit advance course permission", show all courses
    courses = await db.course.findMany({
      where: {
      OR: [
        { userId },
        {
          CourseOnDepartment: {
            some: { departmentId: userDepartment?.Department?.id },
          },
        },
      ],
    },
      orderBy: {
        startDate: "desc",
      },
      include: {
        user: true,
        updatedUser: true,
        courseInstructor: true,
        modules: {},
        CourseOnDepartment: {
          include: {
            Department: true, // Include department information
          },
        },
      },
    });
  } else {
    // If the user doesn't have the necessary permissions, show their department's courses
    courses = await db.course.findMany({
      where: {
        // CourseOnDepartment: {
        //   some: {
        //     departmentId: userDepartment?.Department?.id,
        //   },
        // },
        userId
      },
      orderBy: {
        startDate: "desc",
      },
      include: {
        user: true,
        updatedUser: true,
        courseInstructor: true,
        modules: {},
        CourseOnDepartment: {
          include: {
            Department: true, // Include department information
          },
        },
      },
    });
  }

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={courses}
        canCreate={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Create course permission") != -1
        }
        canEdit={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Edit course permission") != -1
        }
      />
    </div>
  );
};

export default CoursesPage;
