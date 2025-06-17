import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BasicNavbar } from "./_component/course-navbar";
import { db } from "@/lib/db";
import "@/css/clock.css";

const StepTwo = async () => {
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
  if (userInfo != undefined && userInfo.status == "ban") {
    return redirect("/ban");
  }
  return (
    <>
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <BasicNavbar userId={sessionClaims?.userId} />
      </div>
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-4xl mt-24">Chào Mừng! 🎉🎉🎉</p>
          {/* <p className="mb-4">
            Your organization requires admin approval before you can access to
            LPC Learning System.
          </p> */}
          <p className="mb-4">
            Cảm Ơn Vì Đã Tham Gia Hệ Thống LMS. Hồ Sơ Của Bạn Đang Được Duyệt.
          </p>
          <p className="mb-10">Vui Lòng Quay Lại Sau.</p>
         
          <div className="flex justify-center items-center">
            <div className="loader"></div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default StepTwo;
