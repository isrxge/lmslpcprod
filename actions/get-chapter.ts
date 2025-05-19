// import { db } from "@/lib/db";

// interface GetChapterProps {
//   userId: string;
//   courseId: string;
//   moduleId: string;
// }

// export const getChapter = async ({
//   userId,
//   moduleId,
//   courseId,
// }: GetChapterProps) => {
//   try {
//     // Truy vấn khóa học với thông tin modules
//     const course: any = await db.course.findUnique({
//       where: {
//         isPublished: true,
//         id: courseId,
//       },
//       include: {
//         ClassSessionRecord: {
//           where: {
//             userId,
//             courseId,
//           },
//         },
//         modules: {
//           where: {
//             courseId: courseId,
//           },
//           orderBy: {
//             position: "asc",
//           },
//           include: {
//             module: {
//               include: {
//                 UserProgress: true
//               }
//               // select: {
//               //   id: true,
//               //   title: true,
//               //   isPublished: true,
//               // }
//             },
//           },
//         },
//       },
//     });

//     console.log("Course data: ", course);  // Kiểm tra dữ liệu khóa học

//     if (!course) {
//       throw new Error("Course not found");
//     }

//     // Kiểm tra xem moduleId có hợp lệ không
//     console.log("Module ID: ", moduleId);  // Kiểm tra giá trị moduleId
//     console.log("Course ID: ", courseId);  // Kiểm tra giá trị courseId


//     // Truy vấn moduleInCourse để lấy chapter (chương học)
//     const chapter: any = await db.moduleInCourse.findUnique({
//       where: {
//         moduleId_courseId: {
//           moduleId: moduleId,
//           courseId: courseId,
//         },
//         module:{
//           isPublished: true
//         }

//       },
//       include: {
//         module: {
//           include: {
//             UserProgress: true,
//             Slide: {
//               where: {
//                 moduleId: moduleId,
//               },
//               orderBy: {
//                 position: "asc",
//               },
//             },
//             Category: {
//               where: {
//                 moduleId: moduleId,
//               },
//               include: {
//                 Exam: true,
//               },
//             },
//             Resource: true,
//           }
//         }
//       },
//     });
//             // Slide: {
//             //   where: {
//             //     moduleId: moduleId,
//             //   },
//             //   orderBy: {
//             //     position: "asc",
//             //   },
//             // },
//             // Category: {
//             //   where: {
//             //     moduleId: moduleId,
//             //   },
//             //   include: {
//             //     Exam: true,
//             //   },
//             // },
//             // Resource: true,
//     console.log("Chapter data: ", chapter);  // Kiểm tra dữ liệu chương học (chapter)

//     if (!chapter) {
//       throw new Error("Chapter not found");
//     }

//     // Lấy chỉ số vị trí của chương hiện tại trong danh sách modules
//     const currentChapterPos = course.modules.map(
//       (item: { module: { id: string } }) => item.module.id
//     ).indexOf(moduleId);
//     console.log("Current chapter position: ", currentChapterPos);  // Kiểm tra vị trí của chương hiện tại


//     // Tính toán chương tiếp theo và chương trước đó
//     const nextChapter = course.modules.map(
//       (item: { module: { id: string } }) => item.module.id
//     )[currentChapterPos + 1];
//     const preChapter = course.modules.map(
//       (item: { module: { id: string } }) => item.module.id
//     )[currentChapterPos > 0 ? currentChapterPos - 1 : -1];

//     // Lấy thông tin về tiến độ của người dùng trong module
//     const userProgress = await db.userProgress.findUnique({
//       where: {
//         moduleId_userId: {
//           userId,
//           moduleId,
//         },
//       },
//     });
//     return {
//       chapter,
//       course,
//       nextChapter,
//       userProgress,
//       preChapter,
//     };
//   } catch (error) {
//     console.log("[GET_CHAPTER]", error);
//     return {
//       chapter: null,
//       course: null,
//       preChapter: null,
//       nextChapter: null,
//       userProgress: null,
//     };
//   }
// };

import { db } from "@/lib/db";
 
interface GetChapterProps {
  userId: string;
  courseId: string;
  moduleId: string;
}
 
export const getChapter = async ({
  userId,
  moduleId,
  courseId,
}: GetChapterProps) => {
  try {
    // Truy vấn khóa học với thông tin modules
    const course: any = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      include: {
        ClassSessionRecord: {
          where: {
            userId,
            courseId,
          },
        },
        modules: {
          where: {
            courseId: courseId,
          },
          orderBy: {
            position: "asc",
          },
          include: {
            module: {
              include: {
                UserProgress: true,
              },
              // select: {
              //   id: true,
              //   title: true,
              //   isPublished: true,
              // }
            },
          },
        },
      },
    });
 
    console.log("Course data: ", course); // Kiểm tra dữ liệu khóa học
 
    if (!course) {
      throw new Error("Course not found");
    }
 
    // Kiểm tra xem moduleId có hợp lệ không
    console.log("Module ID: ", moduleId); // Kiểm tra giá trị moduleId
    console.log("Course ID: ", courseId); // Kiểm tra giá trị courseId
 
    // Truy vấn moduleInCourse để lấy chapter (chương học)
    const chapter: any = await db.moduleInCourse.findUnique({
      where: {
        moduleId_courseId: {
          moduleId: moduleId,
          courseId: courseId,
        },
        module: {
          isPublished: true,
        },
      },
      include: {
        module: {
          include: {
            UserProgress: true,
            Slide: {
              where: {
                moduleId: moduleId,
              },
              orderBy: {
                position: "asc",
              },
            },
            Category: {
              where: {
                moduleId: moduleId,
              },
              include: {
                Exam: true,
              },
            },
            Resource: true,
          },
        },
      },
    });
    // Slide: {
    //   where: {
    //     moduleId: moduleId,
    //   },
    //   orderBy: {
    //     position: "asc",
    //   },
    // },
    // Category: {
    //   where: {
    //     moduleId: moduleId,
    //   },
    //   include: {
    //     Exam: true,
    //   },
    // },
    // Resource: true,
    console.log("Chapter data: ", chapter); // Kiểm tra dữ liệu chương học (chapter)
 
    if (!chapter) {
      throw new Error("Chapter not found");
    }
 
    // Lấy chỉ số vị trí của chương hiện tại trong danh sách modules
    const currentChapterPos = course.modules
      .map((item: { module: { id: string } }) => item.module.id)
      .indexOf(moduleId);
    console.log("Current chapter position: ", currentChapterPos); // Kiểm tra vị trí của chương hiện tại
 
    // Tính toán chương tiếp theo và chương trước đó
    const nextChapter = course.modules.map(
      (item: { module: { id: string } }) => item.module.id
    )[currentChapterPos + 1];
    const preChapter = course.modules.map(
      (item: { module: { id: string } }) => item.module.id
    )[currentChapterPos > 0 ? currentChapterPos - 1 : -1];
 
    // Lấy thông tin về tiến độ của người dùng trong module
    const userProgress = await db.userExamRecord.findFirst({
      where: {
        moduleId: moduleId,
        userId: userId,
        courseId: courseId,
      },
    });
    return {
      chapter,
      course,
      nextChapter,
      userProgress,
      preChapter,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      preChapter: null,
      nextChapter: null,
      userProgress: null,
    };
  }
};