"use client";
import { useState } from "react";
import { Pencil, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import toast from "react-hot-toast";  

const UserInformation = ({ user }: any) => {
  const router = useRouter();
  const [isRoleEditing, setIsRoleEditing] = useState(false);
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isStatusEditing, setIsStatusEditing] = useState(false);
  const [isTypeUserEditing, setIsTypeUserEditing] = useState(false);

  const handleRoleEditClick = () => {
    setIsRoleEditing(!isRoleEditing);
  };

  const handleStatusEditClick = () => {
    setIsStatusEditing(!isStatusEditing);
  };

  const handleTypeUserEditClick = () => {
    setIsTypeUserEditing(!isTypeUserEditing);
  };

  const handleDepartmentEditClick = () => {
    setIsDepartmentEditing(!isDepartmentEditing);
  };

  const handleUsernameEditClick = () => {
    setIsUsernameEditing(!isUsernameEditing);
  };

  const submitEdit = async (e: any) => {
    e.preventDefault();
    setIsRoleEditing(false);
    setIsDepartmentEditing(false);
    setIsUsernameEditing(false);
    setIsStatusEditing(false);
    setIsTypeUserEditing(false);
    let values = {
      department: e.target.department.value,
      typeUser: e.target.typeUser.value,
      username: e.target.username.value,
      status: e.target.status.value,
    };
    const toastId = toast.loading("Đang lưu thay đổi…");
try {
    await axios.patch(`/api/user/${user?.id}`, values);
    toast.success("Lưu thành công 🎉", { id: toastId });
    router.refresh();
  } catch (err: any) {
      // Attempt to grab a message from the response, fall back to generic
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Đã xảy ra lỗi, vui lòng thử lại";

      toast.error(`Lưu thất bại: ${message}`, { id: toastId });
    }
  };
  return (
    <form
      onSubmit={(e) => submitEdit(e)}
      className="text-black grid grid-cols-2 gap-4 p-4 rounded-md border bg-gradient-to-r from-blue-400 to-red-500 shadow-md"
    >
      {/* Left Column */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          ID
        </label>
        <input
          type="text"
          value={user?.id}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none "
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Họ và tên
        </label>
        <div className="relative">
          <input
            type="text"
            name="username"
            autoCapitalize={"characters"}
            defaultValue={user?.username}
            readOnly={!isUsernameEditing}
            className={`w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none${
              isUsernameEditing ? "border-blue-500" : ""
            }`}
          />
          {/* <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleUsernameEditClick}
          >
            {isUsernameEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div> */}
        </div>
      </div>

      {/* Right Column */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="text"
          value={user?.email}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Phòng ban
        </label>
        <div className="relative">
          <input
            type="text"
            name="department"
            autoCapitalize={"characters"}
            defaultValue={user?.Department.title}
            readOnly={!isDepartmentEditing}
            className={`w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none${
              isDepartmentEditing ? "border-blue-500" : ""
            }`}
          />
          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleDepartmentEditClick}
          >
            {isDepartmentEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Điểm
        </label>
        <input
          type="text"
          value={user?.star}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Trạng thái
        </label>
        <div className="relative bg-gray-100 border border-gray-300 rounded-md  text-black">
          <select
            defaultValue={user?.status}
            name="status"
            disabled={!isStatusEditing}
            // style={{backgroundColor:"#f3f4f6",textColor:"#11111"}}
            className={`appearance:none w-full bg-gray-100 border border-gray-300 rounded-md p-2 ${
              isStatusEditing ? "border-blue-500" : ""
            }`}
          >
            <option value="approved">Đã xác thực</option>
            <option value="pending">Chờ xác thực</option>
          </select>

          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleStatusEditClick}
          >
            {isStatusEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Loại nhân viên
        </label>
        <div className="relative bg-gray-100 border border-gray-300 rounded-md  text-black">
          <select
            defaultValue={user?.typeUser}
            name="typeUser"
            disabled={!isTypeUserEditing}
            // style={{backgroundColor:"#f3f4f6",textColor:"#11111"}}
            className={`appearance:none w-full bg-gray-100 border border-gray-300 rounded-md p-2 ${
              isTypeUserEditing ? "border-blue-500" : ""
            }`}
          >
            <option value="official">Chính thức</option>
            <option value="probation">Thử việc</option>
          </select>

          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleTypeUserEditClick}
          >
            {isTypeUserEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 text-right">
        {isDepartmentEditing ||
        isRoleEditing ||
        isStatusEditing ||
        isTypeUserEditing ||
        isUsernameEditing ? (
          <button
            type="submit"
            className="bg-gradient-to-r from-black to-gray-800 text-white py-2 px-4 rounded-md"
          >
            Lưu
          </button>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
};

export default UserInformation;
