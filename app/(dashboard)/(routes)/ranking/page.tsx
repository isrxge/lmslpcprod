// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

// import { db } from "@/lib/db";

// import { DataTable } from "./_components/data-table";
// import { columns } from "./_components/columns";
// import { getUserRanking } from "@/actions/get-user-ranking";

// const UserRank = async () => {
//   const { sessionClaims }: any = auth();

//   if (!sessionClaims.userId) {
//     return redirect("/");
//   }

//   const users: any = await getUserRanking();
//   return (
//     <div className="p-6">
//       <DataTable
//         columns={columns}
//         data={users.sort(
//           (a: { star: number }, b: { star: number }) => b.star - a.star
//         )}
//       />
//     </div>
//   );
// };

// export default UserRank;


import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUserRanking } from "@/actions/get-user-ranking";

const UserRank = async () => {
  // 1️⃣  Authenticate
  const { sessionClaims }: any = auth();
  if (!sessionClaims?.userId) return redirect("/");

  // 2️⃣  Fetch the current user with department info
  const currentUser = await db.user.findUnique({
    where: { id: sessionClaims.userId },
    include: { Department: true },
  });

  if (!currentUser) return redirect("/");

  // 3️⃣  Get the full ranking list
  let users: any[] = await getUserRanking();

  // 4️⃣  Restrict to the current user’s department unless it’s “BOD”
  if (currentUser.Department?.title !== "BOD") {
    users = users.filter(
      (u: { departmentId: string | null }) =>
        u.departmentId === currentUser.departmentId
    );
  }

  // 5️⃣  Render
  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={users.sort(
          (a: { star: number }, b: { star: number }) => b.star - a.star
        )}
      />
    </div>
  );
};

export default UserRank;
