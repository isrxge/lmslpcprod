"use client";
import { useState } from "react";
import { Pencil, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
<<<<<<< HEAD
import toast from "react-hot-toast";  

=======
>>>>>>> 8b13b57 (commit)
const UserInformation = ({ user }: any) => {
  const router = useRouter();
  const [isRoleEditing, setIsRoleEditing] = useState(false);
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isStatusEditing, setIsStatusEditing] = useState(false);
<<<<<<< HEAD
  const [isTypeUserEditing, setIsTypeUserEditing] = useState(false);
=======
>>>>>>> 8b13b57 (commit)

  const handleRoleEditClick = () => {
    setIsRoleEditing(!isRoleEditing);
  };

  const handleStatusEditClick = () => {
    setIsStatusEditing(!isStatusEditing);
  };

<<<<<<< HEAD
  const handleTypeUserEditClick = () => {
    setIsTypeUserEditing(!isTypeUserEditing);
  };

=======
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
    setIsTypeUserEditing(false);
    let values = {
      department: e.target.department.value,
      typeUser: e.target.typeUser.value,
      username: e.target.username.value,
      status: e.target.status.value,
    };
    const toastId = toast.loading("Saving changes…");
try {
    await axios.patch(`/api/user/${user?.id}`, values);
    toast.success("Saved successfully 🎉", { id: toastId });
    router.refresh();
  } catch (err: any) {
      // Attempt to grab a message from the response, fall back to generic
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Something went wrong, please try again";

      toast.error(`Save failed: ${message}`, { id: toastId });
    }
=======
    let values = {
      department: e.target.department.value,

      username: e.target.username.value,
      status: e.target.status.value,
    };

    await axios.patch(`/api/user/${user?.id}`, values);
    router.refresh();
>>>>>>> 8b13b57 (commit)
  };
  return (
    <form
      onSubmit={(e) => submitEdit(e)}
      className="text-black grid grid-cols-2 gap-4 p-4 rounded-md border bg-gradient-to-r from-blue-400 to-red-500 shadow-md"
    >
      {/* Left Column */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
<<<<<<< HEAD
          ID
=======
          ID:
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
          Full Name
=======
          Username:
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
          {/* <div
=======
          <div
>>>>>>> 8b13b57 (commit)
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleUsernameEditClick}
          >
            {isUsernameEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
<<<<<<< HEAD
          </div> */}
=======
          </div>
>>>>>>> 8b13b57 (commit)
        </div>
      </div>

      {/* Right Column */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
<<<<<<< HEAD
          Email
=======
          Email:
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
          Department
=======
          Department:
>>>>>>> 8b13b57 (commit)
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
          Star
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
<<<<<<< HEAD
          Status
=======
          Status:
>>>>>>> 8b13b57 (commit)
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
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
<<<<<<< HEAD
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type
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
            <option value="official">Official</option>
            <option value="probation">Probation</option>
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
=======
>>>>>>> 8b13b57 (commit)
      <div className="col-span-2 text-right">
        {isDepartmentEditing ||
        isRoleEditing ||
        isStatusEditing ||
<<<<<<< HEAD
        isTypeUserEditing ||
=======
>>>>>>> 8b13b57 (commit)
        isUsernameEditing ? (
          <button
            type="submit"
            className="bg-gradient-to-r from-black to-gray-800 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
};

export default UserInformation;
