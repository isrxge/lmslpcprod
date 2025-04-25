import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const PermissionsPage = async () => {
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
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Edit department permission") == -1 &&
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Create department permission") == -1
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("View department permission") == -1
  ) {
    return redirect("/");
  }

  let departments;
  if (
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Advance department permission") == -1
  ) {
    departments = await db.department.findMany({
      where: {
        User: { some: { id: userId } },
      },
      include: {
        User: true,
      },
    });
  } else {
     departments = await db.department.findMany({
      
      include: {
        User: true,
      },
    });
  }

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={departments}
        canCreate={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Create department permission") != -1
        }
        canEdit={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Edit department permission") != -1
        }
      />
    </div>
  );
};

export default PermissionsPage;
