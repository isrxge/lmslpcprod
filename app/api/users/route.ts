import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
import { db } from "@/lib/db";
 
import { clerkClient } from "@clerk/nextjs";
 
export async function GET(req: Request) {
  try {
    const { userId }: any = auth();
 
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const permissionId = await db.permission.findUnique({
      where: {
        title:"Advance report permission"
      }});
    const permission = await db.userPermission.findFirst({
      where: {
        AND:{
          userId: userId,
          permissionId: permissionId?.id,
        }
      },
    });
    let users: any;
    if (!permission) {
      
      const user:any = await db.user.findUnique({
        where: { id: userId },
        include: {
          Department: {},
        },
      });
      users = await db.user.findMany({
        where: {
          status: {
            not: "inActive",
          },
          Department: {
            id: user.Department.id,
          },
        },
        include: {
          ClassSessionRecord: {
            include: {
              course: {
                include: {
                  modules: {
                    include: {
                      module: {
                        // orderBy: { position: "asc" },
                        include: {
                          UserProgress: {
                            include: {
                              module: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            where: {
              course: {
                // isPublished: true,
              },
            },
          },
          Department: true,
          UserProgress: true,
        },
      });
      return NextResponse.json({
        users,
        canViewAll: false,
      });

    } else {
      users = await db.user.findMany({
        where: {
          status: {
            not: "inActive",
          },
        },
        include: {
          ClassSessionRecord: {
            include: {
              course: {
                include: {
                  modules: {
                    include: {
                      module: {
                        // orderBy: { position: "asc" },
                        include: {
                          UserProgress: {
                            include: {
                              module: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            where: {
              course: {
                // isPublished: true,
              },
            },
          },
          Department: true,
          UserProgress: true,
        },
      });
    }
    
    return NextResponse.json({users,canViewAll: true,});
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}