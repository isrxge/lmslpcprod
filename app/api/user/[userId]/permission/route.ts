import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();
    const { permissionList } = await req.json();
    const currentPermissionList = await db.userPermission.findMany({
      where: {
        userId: params.userId,
      },
    });
    for (const permission of currentPermissionList) {
      if (
        permissionList
          .map((item: { permissionId: any }) => item.permissionId)
          .indexOf(permission.permissionId) == -1
      ) {
        await db.userPermission.delete({
          where: {
            id: permission.id,
            permissionId: permission.permissionId,
            userId: params.userId,
          },
        });
      }
    }
    for (const permission of permissionList) {
      const checkPermission = await db.userPermission.findFirst({
        where: {
          permissionId: permission.permissionId,
          userId: params.userId,
        },
      });
      if (checkPermission) {
      } else {
        await db.userPermission.create({
          data: {
            permissionId: permission.permissionId,
            userId: params.userId,
          },
        });
      }
    }

    return NextResponse.json("success");
  } catch (error) {
    console.log("[ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth(); // Lấy userId từ Clerk
    
    // Kiểm tra nếu không có userId, trả về lỗi Unauthorized
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Lấy quyền của người dùng từ cơ sở dữ liệu (giả sử có bảng userPermission)
    const userPermissions = await db.userPermission.findMany({
      where: {
        userId: userId, // Tìm quyền theo userId
      },
      include: {
        permission: true, // Bao gồm thông tin quyền
      },
    });

    // Chỉ lấy tên quyền từ kết quả
    const permissions = userPermissions.map((userPermission) => userPermission.permission.title);

    // Trả về danh sách quyền dưới dạng JSON
    return NextResponse.json(permissions);
  } catch (error) {
    console.error("[PERMISSIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
