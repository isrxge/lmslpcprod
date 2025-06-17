import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BasicNavbar } from "./_component/course-navbar";
import { db } from "@/lib/db";
import Image from "next/image";

const Ban = async () => {
  const { sessionClaims }: any = auth();
  if (!sessionClaims?.userId) {
    return redirect("/sign-in");
  }
  let userInfo = await db.user.findUnique({
    where: { id: sessionClaims.userId },
  });
  if (userInfo == undefined) {
    return redirect("/sign-in");
  }
  if (userInfo != undefined && userInfo.status == "approved") {
    return redirect("/");
  }

  return (
    <>
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <BasicNavbar userId={sessionClaims?.userId} />
      </div>
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-4xl mt-24">Cảnh Báo !!!</p>
          {/* <p className="mb-4">
            Your organization requires admin approval before you can access to
            LPC Learning System.
          </p> */}
          <p className="mb-4">
            Bạn Đã Bị Thu Hồi Quyền Truy Cập Vào Hệ Thống Do Vi Phạm Chính Sách.
          </p>
          <p className="mb-5">
            Vui Lòng Trao Đổi Với Quản Lý Cấp Trên Hoặc Admin Để Nhận Thêm Chỉ Dẫn.
          </p>
          
          <Image
            className="mx-auto my-auto mt-6"
            src="/warning.png"
            alt="Contact Administrator"
            width={200}
            height={200}
          />
         
        </div>
      </div>
    </>
  );
};

export default Ban;
