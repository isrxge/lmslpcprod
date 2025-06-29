import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";

const UserCollection = async () => {
  const { sessionClaims }: any = auth();

  if (!sessionClaims.userId) {
    return redirect("/");
  }

  const users: any = await db.user.findUnique({
    where: { id: sessionClaims.userId },
    include: {
      ClassSessionRecord: {
        where: { status: "finished" },
        include: {
          course: true,
        },
      },
    },
  });

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="text-center">
        <Image
          className="mx-auto my-auto mt-6"
          src="/barrier.png"
          alt="Under maintenance"
          width={250}
          height={250}
        />
        <p className="mb-4 text-4xl mt-6">Đang Bảo Trì 🛠</p>
        Chức Năng Này Đang Được Bảo Trì
        <div className="relative w-full h-90 flex items-center justify-center rounded overflow-hidden mt-4"></div>
        {/* <SignOutButton /> */}
      </div>
    </div>
  );
};

export default UserCollection;
