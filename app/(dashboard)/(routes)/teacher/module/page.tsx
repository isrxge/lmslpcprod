import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";
const ModulePage = async () => {
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
    //   .indexOf("Edit resource permission") == -1 &&
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Create resource permission") == -1
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("View resource permission") == -1
  ) {
    return redirect("/");
  }
  let modules: any = [];
  modules = await db.module.findMany({
    include: {
      // department: {},
      // ModuleInCourse: {
      //   include: {
      //     course: true,
      //   },
      // },
    },
  });

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={modules}
        canCreate={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Create resource permission") != -1
        }
        canEdit={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Edit resource permission") != -1
        }
      />
    </div>
  );
};

export default ModulePage;
