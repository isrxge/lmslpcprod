import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const { modules, courseId }: { modules: { moduleId: string }[]; courseId: string } =
//       await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Tạo một mảng để lưu các mối quan hệ module và khóa học
//     const createdModulesInCourse = [];

//     for (const { moduleId } of modules) {
//       // Kiểm tra xem mối quan hệ moduleId và courseId đã tồn tại trong ModuleInCourse chưa
//       const existingModuleInCourse = await db.moduleInCourse.findUnique({
//         where: {
//           moduleId_courseId: {
//             moduleId,
//             courseId,
//           },
//         },
//       });

//       if (!existingModuleInCourse) {
//         // Nếu chưa có, tạo mới mối quan hệ giữa module và khóa học
//         const newModuleInCourse = await db.moduleInCourse.create({
//           data: {
//             courseId,
//             moduleId,
//             position: 0, // Đặt vị trí mặc định là 1, có thể thay đổi sau
//           },
//         });
//         createdModulesInCourse.push(newModuleInCourse);
//       }
//     }

//     // Trả về các mối quan hệ module và khóa học đã được tạo
//     return NextResponse.json(createdModulesInCourse);
//   } catch (error) {
//     console.log("[MODULE_IN_COURSE_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const { userId } = auth(); // Lấy userId từ thông tin xác thực

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const url = new URL(req.url);

//     // Lấy tham số 'type' và 'search' từ query string
//     const type = url.searchParams.get("type");
//     const search = url.searchParams.get("search") || ""; // Tham số tìm kiếm (từ khóa)

//     // Truy vấn ModuleInCourse với việc lọc và lấy thông tin module
//     const modulesInCourse = await db.moduleInCourse.findMany({
//       // where: {
//       //   courseId: { // Nếu bạn cần lọc theo courseId, hãy thêm điều kiện này
//       //     // courseId: params.courseId,
//       //   }
//       // },
//       include: {
//         module: {
//           select: {
//             id: true,
//             title: true,
//             type: true,
//           },
//         },
//       },
//     });

//     // Lọc theo 'type' và 'search' ở đây
//     const filteredModules = modulesInCourse.filter(moduleInCourse => {
//       const module = moduleInCourse.module;
//       const matchesType = type ? module.type === type : true;
//       const matchesSearch = module.title.toLowerCase().includes(search.toLowerCase());
//       return matchesType && matchesSearch;
//     });

//     return NextResponse.json(filteredModules);
//   } catch (error) {
//     console.log("[MODULE API]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// GET - Lấy danh sách module đã liên kết với khóa học

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const {
      modules,
      courseId,
      position,
    }: { modules: {
      type: string;
      id: any;
      position: any; moduleId: string 
}[]; courseId: string; position: any } =
      await req.json();
 
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
 
    // Tạo một mảng để lưu các mối quan hệ module và khóa học
    const createdModulesInCourse = [];
    for(let i = 0; i < modules.length - 1; i++){
      let temp = 0
      if(modules[i].type === "Exam"){
        if(modules[i].position < modules[i + 1].position){
           temp = modules[i].position
           modules[i].position = modules[i + 1].position
           modules[i + 1].position = temp
        }
      }
      
    }
    console.log(modules,"this is the sorted modules with bubble sort")
    for (const moduleData of modules) {
     
      // Kiểm tra xem mối quan hệ moduleId và courseId đã tồn tại trong ModuleInCourse chưa
      const existingModuleInCourse = await db.moduleInCourse.findFirst({
        where: {
        
            moduleId: moduleData.moduleId,
            courseId,
          
        },
      });
     
 
      if (!existingModuleInCourse) {
        // Nếu chưa có, tạo mới mối quan hệ giữa module và khóa học
        const newModuleInCourse = await db.moduleInCourse.create({
          data: {
            courseId,
            moduleId:moduleData.moduleId,
            position: moduleData.position, // Đặt vị trí mặc định là 1, có thể thay đổi sau
          },
        });
        createdModulesInCourse.push(newModuleInCourse);
      }else{
        const updateModuleInCourse = await db.moduleInCourse.update({
          where: {
            moduleId_courseId: {
              courseId,
            moduleId:moduleData.moduleId,
            },
          },
          data: {
           
            position: moduleData.position, // Đặt vị trí mặc định là 1, có thể thay đổi sau
          },
        });
      }
    }
 
    // Trả về các mối quan hệ module và khóa học đã được tạo
    return NextResponse.json(createdModulesInCourse);
  } catch (error) {
    console.log("[MODULE_IN_COURSE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
 

export async function GET(req: Request) {
  try {
    const { userId } = auth(); // Lấy userId từ thông tin xác thực
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    // Lấy danh sách các module đã liên kết với khóa học và bao gồm thông tin về module
    const modulesInCourse = await db.moduleInCourse.findMany({
      where: { courseId: courseId },
      include: { module: true }, // Bao gồm thông tin module
    });

    // Trả về danh sách module với thông tin đầy đủ
    return NextResponse.json(modulesInCourse);
  } catch (error) {
    console.log("[MODULE IN COURSE API]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    const { position }: { position: number } = await req.json(); // Lấy dữ liệu từ request

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Cập nhật mối quan hệ giữa module và khóa học
    const updatedModuleInCourse = await db.moduleInCourse.update({
      where: {
        moduleId_courseId: {
          moduleId: params.moduleId,
          courseId: params.courseId,
        },
      },
      data: {
        position,  // Cập nhật vị trí nếu có
      },
    });

    return NextResponse.json(updatedModuleInCourse);
  } catch (error) {
    console.log("[MODULE_IN_COURSE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// export async function DELETE(req: Request) {
//   try {
//     const { userId } = auth();
//     const { moduleId, courseId } = await req.json();

//     // Xóa module khỏi ModuleInCourse
//     await db.moduleInCourse.delete({
//       where: {
//         moduleId_courseId: { // Cần đảm bảo rằng bạn có một unique constraint trên cặp (moduleId, courseId)
//           moduleId: moduleId,
//           courseId: courseId,
//         },
//       },
//     });

//     return NextResponse.json({ message: "Module removed from course" });
//   } catch (error) {
//     console.log("[MODULEINCORSE DELETE API]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

export async function DELETE(req: Request) {
  try {
    
    const { userId } = auth();
    const { moduleId, courseId }: { moduleId: string; courseId: string } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Kiểm tra xem mối quan hệ moduleId và courseId có tồn tại trong ModuleInCourse không
    const moduleInCourse = await db.moduleInCourse.findUnique({
      where: {
        moduleId_courseId: { moduleId, courseId },
      },
    });

    // Nếu không tìm thấy mối quan hệ, trả về lỗi
    if (!moduleInCourse) {
      return new NextResponse("Module not found in course", { status: 404 });
    }

    // Xóa mối quan hệ module và khóa học từ ModuleInCourse
    await db.moduleInCourse.delete({
      where: {
        moduleId_courseId: { moduleId, courseId },
      },
    });

    return NextResponse.json({ message: "Module removed from course successfully" });
  } catch (error) {
    console.log("[MODULE_IN_COURSE DELETE API]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
