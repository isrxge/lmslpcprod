"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
<<<<<<< HEAD
import { Asterisk, Loader, Pencil } from "lucide-react";
=======
import { Loader, Pencil } from "lucide-react";
>>>>>>> 8b13b57 (commit)
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
interface DepartmentProps {
  id: string;
  title: string;
}
interface DepartmentFormProps {
  initialData: { Department: DepartmentProps[]; Course: any };
  courseId: string;
  department: DepartmentProps[];
<<<<<<< HEAD
  readOnly?: boolean;
=======
>>>>>>> 8b13b57 (commit)
}
const Department = z.object({
  id: z.string(),
  title: z.string(),
});
const formSchema = z.array(Department);

<<<<<<< HEAD
export const DepartmentForm = ({
  initialData,
  courseId,
  department,
  readOnly = false,
}: any) => {
=======
export const DepartmentForm = ({ initialData, courseId, department }: any) => {
>>>>>>> 8b13b57 (commit)
  const [isEditing, setIsEditing] = useState(false);
  const [departmentList, setDepartmentList] = useState([...department]);
  const [assignList, setAssignList]: any = useState([]);
  const [triggerAlert, setTriggerAlert] = useState(false);

  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const toggleEdit = () => !readOnly && setIsEditing((current) => !current);
=======
  const toggleEdit = () => setIsEditing((current) => !current);
>>>>>>> 8b13b57 (commit)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData.Department,
  });
  useEffect(() => {
    let newAssignList: any = [...assignList];
<<<<<<< HEAD
    const filteredDepartments = department.filter(
      (dept: any) => dept.title !== "BOD" 
    );
    for (let i = 0; i < filteredDepartments.length; i++) {
      let users = filteredDepartments[i].User;
=======
    for (let i = 0; i < departmentList.length; i++) {
      let users = departmentList[i].User;
>>>>>>> 8b13b57 (commit)
      for (let j = 0; j < users.length; j++) {
        newAssignList.push(users[j]);
      }
    }
    setAssignList(newAssignList);
<<<<<<< HEAD
    setDepartmentList(filteredDepartments);
=======
>>>>>>> 8b13b57 (commit)
  }, []);
  const onChangeDepartmentList = (index: any) => {
    // e.preventDefault();

    let newList = [...departmentList];
    let newAssignList: any = [...assignList];

    if (newList[index].isEnrolled) {
      if (newList[index].canUndo) {
        newList[index].isEnrolled = false;
        for (let i = 0; i < newList[index].User.length; i++) {
          newList[index].User[i].isEnrolled = false;
          newAssignList[
            newAssignList
              .map((item: { id: any }) => item.id)
              .indexOf(newList[index].User[i].id)
          ].isEnrolled = false;
        }
      } else {
        alert("Cannot commit this action!!!");
        return;
      }
    } else {
      if (newList[index].User.length == 0) {
        alert("No user to assign!!!");
        return;
      }
      newList[index].isEnrolled = true;
      newList[index].canUndo = true;
      for (let i = 0; i < newList[index].User.length; i++) {
        newList[index].User[i].isEnrolled = true;
        newList[index].User[i].canUndo = true;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[index].User[i].id)
        ].isEnrolled = true;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[index].User[i].id)
        ].canUndo = true;
      }
    }
    setAssignList([...newAssignList]);

    setDepartmentList([...newList]);
  };
  const onChangeStudentList = async (i: any, j: any) => {
    let newList = [...departmentList];
    let newAssignList: any = [...assignList];
    if (newList[i].User[j].isEnrolled) {
      if (newList[i].User[j].canUndo) {
        newList[i].User[j].isEnrolled = false;
        newList[i].isEnrolled = false;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[i].User[j].id)
        ].isEnrolled = false;
      } else {
<<<<<<< HEAD
        alert("Cannot commit this action!!!");
=======
        alert("Không Thể Thực Hiện Hành Động Này!!!");
>>>>>>> 8b13b57 (commit)
        return;
      }
    } else {
      newList[i].User[j].isEnrolled = true;
      newList[i].User[j].canUndo = true;
      newAssignList[
        newAssignList
          .map((item: { id: any }) => item.id)
          .indexOf(newList[i].User[j].id)
      ].isEnrolled = true;
      newAssignList[
        newAssignList
          .map((item: { id: any }) => item.id)
          .indexOf(newList[i].User[j].id)
      ].canUndo = true;
    }
    setAssignList(newAssignList);
    if (
      newList[i].User.map((item: any) => item.isEnrolled).indexOf(false) == -1
    ) {
      newList[i].isEnrolled = true;
      newList[i].canUndo = true;
    }
    setDepartmentList(newList);
  };
  // const { isSubmitting, isValid } = form.formState;
  function cancel() {
    setTriggerAlert(false);

    router.refresh();
  }
  const onSubmit = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/courses/${courseId}/department`, {
        departmentList,
        assignList,
      });

      for (let user of assignList) {
        if (user.isEnrolled && user.canUndo) {
          await axios.post("/api/send-email", {
            courseName: initialData.title,
            username: user.username,
            emailAddress: user.email,
          });
        }
      }

<<<<<<< HEAD
      toast.success("Course updated");
=======
      toast.success("Khóa Học Đã Được Cập Nhật");
>>>>>>> 8b13b57 (commit)
      setLoading(false);
      setTriggerAlert(false);
      toggleEdit();
      router.refresh();
    } catch {
<<<<<<< HEAD
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  
=======
      toast.error("Đã Có Lỗi Xảy Ra, Vui Lòng Thử Lại Sau");
      setLoading(false);
    }
  };
>>>>>>> 8b13b57 (commit)
  const onConfirm = () => {
    let canSubmit = false;
    for (let i = 0; i < assignList.length; i++) {
      if (assignList[i].isEnrolled == true && assignList[i].canUndo == true) {
        canSubmit = true;
      }
    }
    if (canSubmit) {
      setTriggerAlert(true);
    } else {
<<<<<<< HEAD
      alert("No new staffs assigned to this course!!!");
=======
      alert("Chưa Có Nhân Viên Được Cấp Quyền Truy Cập Khóa Học!!!");
>>>>>>> 8b13b57 (commit)
      return;
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <AlertDialog
        open={triggerAlert}
        onOpenChange={() => {
          setTimeout(() => (document.body.style.pointerEvents = ""), 100);
        }}
      >
        <AlertDialogContent className="AlertDialogContent">
          <AlertDialogTitle className="AlertDialogTitle">
            Submit Staff Assignment
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
<<<<<<< HEAD
            Are you sure you want to add these staff members to the course?
            <span className="text-red-500 text-xs font-medium">
              **Once submitted, the assignment cannot be undone as per our
              policy. Already assigned staff will not be affected.**
=======
            Bạn Có Muốn Cấp Quyền Truy Cập Khóa Học Cho Các Nhân Viên Sau?
            <span className="text-red-500 text-xs font-medium">
              **Vì Lý Do Chính Sách, Các Nhân Viên Sau Khi Đã Được Cấp Quyền
              Truy Cập Sẽ Không Được Thu Hồi.**
>>>>>>> 8b13b57 (commit)
            </span>
            <br />
            <br />
            <div className="grid grid-cols-2 gap-0">
              {assignList
                .filter(
                  (item: any) => item.isEnrolled == true && item.canUndo == true
                )
<<<<<<< HEAD
                .map(
                  (
                    item: { id: any; username: any; typeUser: string },
                    index: any
                  ) => {
                    const isProbationary = item.typeUser === "probation";
                    return (
                      <div key={item.id}>
                        {index + 1}. {item.username}{" "}
                        {isProbationary && "(Thử việc)"}
                      </div>
                    );
                  }
                )}
            </div>
          </AlertDialogDescription>

          <AlertDialogCancel onClick={() => cancel()}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              className="Button red"
              onClick={() => onSubmit()}
              disabled={loading}
            >
              Confirm {loading ? <Loader className="animate-spin" /> : <></>}
=======
                .map((item: { id: any; username: any }, index: any) => {
                  return (
                    <div key={item.id}>
                      {index + 1}. {item.username}
                    </div>
                  );
                })}
            </div>
          </AlertDialogDescription>

          <AlertDialogCancel onClick={() => cancel()}>
            Từ Chối
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button className="Button red" onClick={() => onSubmit()}>
              Xác Nhận {loading ? <Loader className="animate-spin" /> : <></>}
>>>>>>> 8b13b57 (commit)
            </button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
<<<<<<< HEAD
        <div className="flex items-center">
          Staff
          <Asterisk className="size-4" color="red" />
        </div>
        {!readOnly && (
          <Button onClick={toggleEdit} variant="ghost" disabled={readOnly}>
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        )}
      </div>

      {!isEditing && (
        <div className="mt-3 space-y-1 pl-1 dark:text-slate-50 text-sm">
          {assignList.filter((item: any) => item.isEnrolled).length === 0 ? (
            <span className="italic text-slate-500">No staff assigned.</span>
          ) : (
            assignList
              .filter((item: any) => item.isEnrolled)
              .map(
                (
                  item: { id: any; username: any; typeUser: string },
                  index: any
                ) => {
                  const isProbationary = item.typeUser === "probation";
                  return (
                    <div key={item.id}>
                      {index + 1}. {item.username}{" "}
                      {isProbationary && "(Thử việc)"}
                    </div>
                  );
                }
              )
          )}
        </div>
      )}

=======
        Department
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Từ Chối</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh Sửa
            </>
          )}
        </Button>
      </div>
>>>>>>> 8b13b57 (commit)
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {departmentList.map((item: any, i: any) => {
              return (
                <div key={item.id} className=" justify-between">
                  <Accordion>
                    <AccordionItem
                      className=" dark:text-slate-50"
                      key={item.id}
                      aria-label={item.title}
                      startContent={
                        <>
                          <input
                            className="h-6 w-6"
                            id={"department " + item.id}
                            onChange={(e) => onChangeDepartmentList(i)}
                            disabled={isEditing ? false : true}
                            value={item.title}
                            type="checkbox"
                            checked={item.isEnrolled}
                            defaultChecked={item.isEnrolled}
                          />{" "}
                          {item.title}
                        </>
                      }
                    >
                      <div
                        key={"department-user " + item.id}
                        className="grid grid-cols-2 gap-2 w-full"
                      >
                        {item.User.length == 0
<<<<<<< HEAD
                          ? "NO USER"
                          : item.User.map((item: any, j: any) => {
                            const isProbationary = item.typeUser === "probation";
=======
                          ? "Chưa Có Người Dùng"
                          : item.User.map((item: any, j: any) => {
>>>>>>> 8b13b57 (commit)
                              return (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-2 p-2 dark:text-slate-50 bg-white dark:bg-gray-800 rounded-lg shadow"
                                >
                                  <input
                                    id={"user " + item.id}
                                    onChange={(e) => onChangeStudentList(i, j)}
                                    disabled={isEditing ? false : true}
                                    value={item.title}
                                    type="checkbox"
                                    className="form-checkbox h-6 w-6 text-blue-600 dark:text-blue-400 "
                                    checked={item.isEnrolled}
                                    defaultChecked={item.isEnrolled}
                                  />
<<<<<<< HEAD
                                  <span>{item.username} {isProbationary && "(Thử việc)"}</span>
=======
                                  <span>{item.username}</span>
>>>>>>> 8b13b57 (commit)
                                </div>
                              );
                            })}
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}

            <div className="flex items-center gap-x-2">
<<<<<<< HEAD
              <Button onClick={() => onConfirm()} disabled={loading}>
                Save
              </Button>
=======
              <Button onClick={() => onConfirm()}>Lưu</Button>
>>>>>>> 8b13b57 (commit)
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
