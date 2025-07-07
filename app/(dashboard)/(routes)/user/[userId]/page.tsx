// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

// import { db } from "@/lib/db";
// import Avatar from "./_components/avatar";
// import Star from "./_components/star";
// import UserInformation from "./_components/infomation-form";
// import CourseHistory from "./_components/courses-history";
// import { DataTable } from "./_components/data-table";
// import { columns } from "./_components/columns";
// import { title } from "process";
// import { select } from "@nextui-org/react";

// interface userValue {
//   userId: string;
//   star: number;
//   imageUrl: string;
//   role: string;
//   permissionRole: string;
// }
// const UserPage = async ({ params }: { params: { userId: string } }) => {
//   const { userId } = auth();

//   if (!userId) {
//     return redirect("/");
//   }
//   const checkUser = await db.userPermission.findMany({
//     where: {
//       userId: userId,
//     },
//     include: {
//       permission: true,
//     },
//   });
//   if (
//     checkUser
//       .map((item: { permission: { title: any } }) => item.permission.title)
//       .indexOf("User personal management permission") == -1
//   ) {
//     return redirect("/");
//   }
//   const user: userValue | any = await db.user.findUnique({
//     where: {
//       id: userId,
//     },
//     include: {
//       Department: true,
//     },
//   });

//   const courses = await db.course.findMany({
//     where: {
//       ClassSessionRecord: {
//         some: {
//           userId,
//         },
//       },
//     },
//     orderBy: {
//       startDate: "desc",
//     },
//     include: {
//       ClassSessionRecord: {
//         where: {
//           userId: userId,
//         },
//       },
//       modules: {
//         include: {
//           module: {
//             select: {
//               // type: "Exam",
//               title: true,
//               type: true,
//               UserProgress: 
//               {
//                 where: {
//                   userId: userId,
//                 },
//                 select: {
//                   score: true,
//                   status: true
//                 }
//               },
//             },
//           },
//         }
//       }
      
//     },
//   });

//   return (
//     user && (
//       <div className="p-6">
//         <div className="flex flex-col items-center">
//           <Avatar imageUrl={user?.imageUrl} className="w-32 h-32" />
//           <p className="mt-2 mb-3 text-lg font-semibold">
//             Information about {user?.username}
//           </p>
//         </div>
//         <UserInformation user={user} />
//         <CourseHistory userId={params.userId} coursesJoined={courses} />
//         <DataTable
//           user={user}
//           columns={columns}
//           data={courses}
//           canPrintReport={
//             checkUser
//               .map(
//                 (item: { permission: { title: any } }) => item.permission.title
//               )
//               .indexOf("Create personal report") != -1
//           }
//         />
//       </div>
//     )
//   );
// };

// export default UserPage;

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
 
import { db } from "@/lib/db";
import Avatar from "./_components/avatar";
import Star from "./_components/star";
import UserInformation from "./_components/infomation-form";
import CourseHistory from "./_components/courses-history";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { title } from "process";
import { select } from "@nextui-org/react";
 
interface userValue {
  userId: string;
  star: number;
  imageUrl: string;
  role: string;
  permissionRole: string;
}
const UserPage = async ({ params }: { params: { userId: string } }) => {
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
      .indexOf("User personal management permission") == -1
  ) {
    return redirect("/");
  }
  const user: userValue | any = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Department: true,
    },
  });
 
  const courses = await db.course.findMany({
    where: {
      ClassSessionRecord: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
    include: {
      ClassSessionRecord: {
        where: {
          userId: userId,
        },
      },
      modules: {
        include: {
          module: {
            select: {
              // type: "Exam",
              title: true,
              type: true,
              UserProgress: {
                where: {
                  userId: userId,
                },
                select: {
                  score: true,
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return (
    user && (
      <div className="p-6">
        <div className="flex flex-col items-center">
          <Avatar imageUrl={user?.imageUrl} className="w-32 h-32" />
          <p className="mt-2 mb-3 text-lg font-semibold">
            Thông tin về {user?.username}
          </p>
        </div>
        <UserInformation user={user} />
        <CourseHistory userId={params.userId} coursesJoined={courses} />
        <DataTable
          user={user}
          columns={columns}
          data={courses}
          canPrintReport={
            checkUser
              .map(
                (item: { permission: { title: any } }) => item.permission.title
              )
              .indexOf("Create personal report") != -1
          }
        />
      </div>
    )
  );
};
 
export default UserPage;