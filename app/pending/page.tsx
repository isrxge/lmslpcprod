// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { BasicNavbar } from "./_component/course-navbar";
// import { db } from "@/lib/db";
// import "@/css/clock.css";

// const StepTwo = async () => {
//   const { sessionClaims }: any = auth();
//   if (!sessionClaims?.userId) {
//     return redirect("/sign-in");
//   }
//   let userInfo = await db.user.findUnique({
//     where: { id: sessionClaims.userId },
//   });
//   if (userInfo == undefined) {
//     return redirect("/sign-in");
//   }
//   if (userInfo != undefined && userInfo.status == "approved") {
//     return redirect("/");
//   }
//   if (userInfo != undefined && userInfo.status == "ban") {
//     return redirect("/ban");
//   }
//   return (
//     <>
//       <div className="h-[80px] fixed inset-y-0 w-full z-50">
//         <BasicNavbar userId={sessionClaims?.userId} />
//       </div>
//       <div className="p-6 flex items-center justify-center">
//         <div className="text-center">
//           <p className="mb-4 text-4xl mt-24">Successful! 🎉🎉🎉</p>
//           {/* <p className="mb-4">
//             Your organization requires admin approval before you can access to
//             LPC Learning System.
//           </p> */}
//           <p className="mb-4">
//             Thank you for your submission. Your request is currently under
//             review.
//           </p>
//           <p className="mb-10">Please come back later.</p>
//           {/* <p>
//             Please contact your
//             <a
//               href={`mailto:khoa.nguyendang@lp.com.vn,phu.nguyen@lp.com.vn?cc=huy.nguyen@lp.com.vn&subject=Request%20for%20LPC%20Learning%20System%20Access&body=Dear%20Administrator,%0A%0AI%20am%20writing%20to%20request%20access%20to%20the%20LPC%20Learning%20System.%20Please%20approve%20my%20request%20so%20that%20I%20can%20begin%20using%20the%20system.%0A%0AThank%20you.`}
//               className="text-blue-500"
//             >
//               {" "}
//               administrator
//             </a>{" "}
//             for permission.
//           </p> */}
//           {/* <Image
//             className="mx-auto my-auto mt-6"
//             src="/hourglass.png"
//             alt="Contact Administrator"
//             width={200}
//             height={200}
//           /> */}
//           <div className="flex justify-center items-center">
//             <div className="loader"></div>
//           </div>
//           {/* <div className="relative w-full h-90 flex items-center justify-center rounded overflow-hidden mt-4">
//             <Image
//               src="https://media.giphy.com/media/l3vR1tvIhCrrZsty0/giphy.gif"
//               alt="blog"
//               height={400}
//               width={400}
//               className="select-none object-cover rounded-md border-2 border-white shadow-md drop-shadow-md w-150 h-full"
//             />
//           </div> */}
//           {/* <SignOutButton /> */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default StepTwo;


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@clerk/nextjs";

const StepTwo = () => {
  const { sessionClaims }: any = auth();
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!sessionClaims?.userId) {
      router.push("/sign-in");
      return;
    }

    const userId = sessionClaims.userId;
    
    // Kiểm tra trạng thái người dùng mỗi 5 giây bằng cách gọi API hiện tại (ví dụ /api/user/{id})
    const interval = setInterval(async () => {
      try {
        // Thay đổi URL này cho phù hợp với API của bạn (API lấy thông tin trạng thái người dùng)
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();

        if (data.status) {
          setUserStatus(data.status); // Cập nhật trạng thái người dùng
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    }, 5000); // Kiểm tra mỗi 5 giây

    // Dừng Polling khi component bị hủy
    return () => clearInterval(interval);
  }, [sessionClaims, router]);

  useEffect(() => {
    if (userStatus === "approved") {
      router.push("/"); // Nếu trạng thái là "approved", chuyển hướng người dùng đến trang chính
    } else if (userStatus === "ban") {
      router.push("/ban"); // Nếu người dùng bị cấm, chuyển hướng đến trang bị cấm
    } else {
      setIsLoading(false); // Nếu chưa phê duyệt hoặc trạng thái khác, không làm gì
    }
  }, [userStatus, router]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-4xl mt-24">Successful! 🎉🎉🎉</p>
          <p className="mb-4">Your request is currently under review.</p>
          <p className="mb-10">Please come back later.</p>
          <div className="flex justify-center items-center">
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StepTwo;
