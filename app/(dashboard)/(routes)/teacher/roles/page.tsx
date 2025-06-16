import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const RolesPage = async () => {
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
<<<<<<< HEAD
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Edit role permission") == -1 &&
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Create role permission") == -1
      checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("View role permission") == -1
=======
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit role permission") == -1 &&
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Create role permission") == -1
>>>>>>> 8b13b57 (commit)
  ) {
    return redirect("/");
  }
  const roles = await db.role.findMany({});

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={roles}
        canCreate={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
<<<<<<< HEAD
            .indexOf("Create role permission") != -1
=======
            .indexOf("Create program permission") != -1
>>>>>>> 8b13b57 (commit)
        }
        canEdit={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
<<<<<<< HEAD
            .indexOf("Edit role permission") != -1
=======
            .indexOf("Edit program permission") != -1
>>>>>>> 8b13b57 (commit)
        }
      />
    </div>
  );
};

export default RolesPage;
