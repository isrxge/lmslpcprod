import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
<<<<<<< HEAD
 
import { db } from "@/lib/db";
 
export async function POST(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
    const { title, imageUrl, type, status } = await req.json();
    let userInfo: any = await db.user.findUnique({
      where: { id: userId, status: "approved" },
    });
 
=======

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
    const { title, imageUrl, type } = await req.json();
    let userInfo: any = await db.user.findUnique({
      where: { id: userId, status: "approved" },
    });

>>>>>>> 8b13b57 (commit)
    const date = new Date();
    const course = await db.course.create({
      data: {
        userId,
        title,
        imageUrl,
        type,
<<<<<<< HEAD
        status,
        startDate: date,
        isPublished: false,
        modules: {},
=======
        startDate: date,
        isPublished: false,
        modules: { }
>>>>>>> 8b13b57 (commit)
        // Module: {
        //   create: [
        //     {
        //       position: 1,
        //       isPublished: false,
        //       title: "Intro",
        //       type: "slide",
        //       userId,
        //     },
        //   ],
        // },
      },
    });
<<<<<<< HEAD
 
=======

>>>>>>> 8b13b57 (commit)
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
<<<<<<< HEAD
 
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const permission = await db.userPermission.findFirst({
      where: {
        userId:userId,
        permission: {
          title: "Advance report permission",
        },
       
      },
    });
    let course: any;
    let canViewAll = false;
    if (!permission) {
      course = await db.course.findMany({
        where: {
          // isPublished: true,
          courseInstructedBy: userId,
        },
        include: {
          courseInstructor: true,
          courseWithProgram: {
            include: {
              program: true,
            },
          },
          modules: {
            include: {
              module: {
                include: {
                  Slide: true,
                  examRecord: {
                    include: {
                      user: true,
                    },
                  },
                  UserProgress: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          // Module: {
          //   orderBy: {
          //     position: "asc",
          //   },
          //   include: {
          //     Slide: true,
          //     examRecord: {
          //       include: {
          //         user: true,
          //       },
          //     },
          //     UserProgress: {
          //       include: {
          //         user: true,
          //       },
          //     },
          //   },
          // },
 
          ClassSessionRecord: {
            include: {
              user: true,
              course:{
                include:{
                  examRecord:{
                    include:{
                      user:true,
                    },
                  
                  }
                }
              }
            },

          },
          CourseOnDepartment: {
            include: {
              Department: true,
            },
          },
          user: true,
          updatedUser: true,
        },
      });
      canViewAll = false;
    } else {
      course = await db.course.findMany({
        // where: {
        //   isPublished: true,
        // },
        include: {
          courseInstructor: true,
          courseWithProgram: {
            include: {
              program: true,
            },
          },
          modules: {
            include: {
              module: {
                include: {
                  Slide: true,
                  examRecord: {
                    include: {
                      user: true,
                    },
                  },
                  UserProgress: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          // Module: {
          //   orderBy: {
          //     position: "asc",
          //   },
          //   include: {
          //     Slide: true,
          //     examRecord: {
          //       include: {
          //         user: true,
          //       },
          //     },
          //     UserProgress: {
          //       include: {
          //         user: true,
          //       },
          //     },
          //   },
          // },
 
          ClassSessionRecord: {
            include: {
              user: true,
              course:{
                include:{
                  examRecord:{
                    include:{
                      user:true,
                    },
                  
                  }
                }
              }
            },

          },
          CourseOnDepartment: {
            include: {
              Department: true,
            },
          },
          user: true,
          updatedUser: true,
        },
      });
      canViewAll = true;
    }
 
    return NextResponse.json({course,canViewAll });
=======

    const course = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        courseInstructor: true,
        courseWithProgram: {
          include: {
            program: true,
          },
        },
        modules: {
          include: {
            module: {
              include: {
                Slide: true,
                examRecord: {
                  include: {
                    user: true,
                  },
                },
                UserProgress: {
                  include: {
                    user: true,
                  },
                },
              }
            }
          }
        },
        ClassSessionRecord: {
          include: {
            user: true,
          },
        },
        CourseOnDepartment: {
          include: {
            Department: true,
          },
        },
        user: true,
        updatedUser: true,
      },
    });

    return NextResponse.json(course);
>>>>>>> 8b13b57 (commit)
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 8b13b57 (commit)
