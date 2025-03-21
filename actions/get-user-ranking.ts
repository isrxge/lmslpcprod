import { db } from "@/lib/db";

export const getUserRanking = async (): Promise<any> => {
  try {
    const users: any = await db.user.findMany({
      where: {
        status: {
          not: "inActive",
        },
        Department: {
            title: {
                not: "BOD",
            },
        }
      },
      include: {
        Department: true,
        userPermission: true,
        userExamReport: {
          include: {
            course: true,
            module: true,
          },
          where: {
            isInExam: true,
          },
        },
      },
    });
    for (let i = 0; i < users.length; i++) {
      users[i]["department"] = users[i]["Department"]["title"];
    }

    return users;
  } catch (error) {
    console.log("[GET_USER]", error);
    return 0;
  }
};
