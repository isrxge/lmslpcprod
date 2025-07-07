"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface PermissionProps {
  id: string;
  title: string;

  status: string;
}
interface PermissionFormProps {
  initialData: PermissionProps[];
  permissionId: string;
  role: PermissionProps[];
}
const Permission = z.object({
  id: z.string(),
  title: z.string(),
});
const formSchema = z.array(Permission);

export const PermissionForm = ({
  initialData,
  userId,
  role,
  permission,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [roleList, setRoleList] = useState(role);

  const [permissionList, setPermissionList] = useState(
    initialData.userPermission
  );
  useEffect(() => {
    for (let i = 0; i < role.length; i++) {
      if (role[i].rolePermission.length == permissionList.length) {
        setCurrentRole(role[i].title);
        break;
      }
    }
  }, []);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const onChangePermissionList = (e: any, permission: any) => {
    // debugger;

    // e.preventDefault();
    let newPermissionList = [...permissionList];

    if (
      newPermissionList
        .map((item) => item.permissionId)
        .indexOf(permission.id) != -1
    ) {
      newPermissionList.splice(
        newPermissionList
          .map((item) => item.permissionId)
          .indexOf(permission.id),
        1
      );
      setPermissionList([...newPermissionList]);
    } else {
      for (let i = 0; i < roleList.length; i++) {
        for (let j = 0; j < roleList[i].rolePermission.length; j++) {
          if (roleList[i].rolePermission[j].permissionId == permission.id) {
            let newItem = {
              permissionId: permission.id,
              permission: permission,
              roleId: roleList[i].id,
              userId: userId,
            };

            setPermissionList([...permissionList, newItem]);
          }
        }
      }
    }
  };

  const onChangePermissionListByRole = (e: any, role: any) => {
    if (currentRole == role.title) {
      setCurrentRole("");
      let newPermissionList = [...permissionList];
      for (let i = 0; i < newPermissionList.length; i++) {
        if (
          role.rolePermission
            .map((item: any) => item.permissionId)
            .indexOf(newPermissionList[i].permissionId) != -1
        ) {
          newPermissionList.splice(i, 1);
          i--;
        }
      }

      setPermissionList([...newPermissionList]);
    } else {
      setCurrentRole(role.title);
      setPermissionList([]);
      for (let i = 0; i < role.rolePermission.length; i++) {
        let newItem = {
          permissionId: role.rolePermission[i].permissionId,
          permission: role.rolePermission[i].permission,
          roleId: role.rolePermission[i].roleId,
          userId: userId,
        };

        setPermissionList((list: any) => [...list, newItem]);
      }
    }

    // e.preventDefault();
  };

  // const onChangeDepartmentList = (e: any, department: DepartmentProps) => {

  // };
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/user/${userId}/permission`, {
        permissionList,
      });
      toast.success("Quyền hạn đã được cập nhật");
      // toggleEdit();
      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };
  useEffect(() => {
    for (let i = 0; i < role.length; i++) {
      checkRole(role[i].title, role[i].rolePermission);
    }
  }, []);
  const checkRole = (title: any, permissions: any) => {
    let mapPermissions = permissions.map(
      (item: { permissionId: any }) => item.permissionId
    );
    let mapPermissionList = [...permissionList].map(
      (item: { permissionId: any }) => item.permissionId
    );

    if (JSON.stringify(mapPermissionList) === JSON.stringify(mapPermissions)) {
      if (currentRole == "") {
        setCurrentRole(title);
      }
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <h2 className="text-lg">Quyền hạn</h2>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <div className="dark:text-zinc-50 mt-4">
          <h3 className="text-md font-semibold">
            Thiết lập quyền dựa trên vai trò
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {roleList.map((item: any, i: any) => {
              return (
                <div
                  key={i + "-" + item.id}
                  className="dark:text-slate-50 flex items-center space-x-2"
                >
                  <input
                    onChange={(e) => onChangePermissionListByRole(e, item)}
                    disabled={isEditing ? false : true}
                    value={item.title}
                    type="checkbox"
                    checked={currentRole == item.title ? true : false}
                  />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
          <h3 className="text-md font-semibold mt-6">
            Hoặc tùy chỉnh quyền hạn
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {permission.map((item: any, i: any) => {
              return (
                <div
                  key={i + "-" + item.id}
                  className="dark:text-slate-50 flex items-center space-x-2"
                >
                  <input
                    onChange={(e) => onChangePermissionList(e, item)}
                    disabled={isEditing ? false : true}
                    value={item.title}
                    type="checkbox"
                    checked={
                      permissionList
                        .map((val: any) => val.permissionId)
                        .indexOf(item.id) != -1
                        ? true
                        : false
                    }
                  />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-x-2 mt-4">
            <Button onClick={onSubmit} type="button" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
