"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "react-query";

export const IsTeacher = ({ userId }: any) => {
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}`);
    return data;
  };
  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );

  if (error) {
    return <></>;
  }
  if (isLoading) {
    return <></>; }

// // Kiểm tra nếu người dùng có cả 2 quyền: "Create course permission" và "Create course report"
// const hasCreateCoursePermission =
// data.userPermission.some(
//   (item: { permission: { title: string } }) =>
//     item.permission.title === "Create course permission"
// );

// const hasCreateCourseReport =
// data.userPermission.some(
//   (item: { permission: { title: string } }) =>
//     item.permission.title === "Create course report"
// );

// // Nếu người dùng không có đủ 2 quyền, không hiển thị nút
// if (!hasCreateCoursePermission || !hasCreateCourseReport) {
// return <></>;
// }

// Kiểm tra nếu người dùng có quyền "Advance mode permission"
const hasAdvanceModePermission = data.userPermission.some(
  (item: { permission: { title: string } }) =>
    item.permission.title === "Advance mode permission"
);

// Nếu người dùng không có quyền, không hiển thị nút
if (!hasAdvanceModePermission) {
  return <></>;
}

return (
<Link href="/teacher/courses">
  <Button size="sm" variant="ghost">
    Admin mode
  </Button>
</Link>
);
};
//   } else {
//     return data.userPermission.length <= 2 &&
//       data.userPermission
//         .map((item: { permission: { title: any } }) => item.permission.title)
//         // .indexOf("Create personal report") != -1 &&
//         .indexOf("Create course permission") != -1 &&

//       data.userPermission
//         .map((item: { permission: { title: any } }) => item.permission.title)
//         // .indexOf("User personal management permission") != -1 ? (
//         .indexOf("Create course report") != -1 ? (
//       <></>
//     ) : (
//       <Link href="/teacher/programs">
//         <Button size="sm" variant="ghost">
//           Teacher mode
//         </Button>
//       </Link>
//     );
//   }
// };

