"use client";

import axios from "axios";

import { useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { useState } from "react";

export const CellUserExamStatus = ({ row }: any) => {
  const { id, userExamReport } = row.original;

  const router = useRouter();
  const [note, setNote] = useState("");

  const { userId }: any = useAuth();

  const fetchUserCourse = async () => {
    const { data } = await axios.get(`/api/user/${id}/coursesSession`);
    return data;
  };

  const { data, error, isLoading } = useQuery("userCourse", fetchUserCourse, {
    refetchOnWindowFocus: false,
  });
  async function onChangeStatus(id: string): Promise<void> {
    let examRecord = userExamReport[0].examRecord;
    examRecord["isEmergency"] = true;
    await axios.patch(`/api/user/${id}/isInExam`, {
      id,
      values: {
        examRecord,
        note: note,
      },
    });

    router.refresh();
  }

  if (isLoading) {
    return <></>;
  } else {
    return !userExamReport[0]?.isInExam ? (
      <div className="font-bold ml-2 rounded-lg">
        Người Dùng Này Đang Không Trong Bài Kiểm Tra
      </div>
    ) : (
      <AlertDialog
        onOpenChange={() => {
          setTimeout(() => (document.body.style.pointerEvents = ""), 100);
        }}
      >
        <AlertDialogTrigger className="flex justify-center items-center">
          <div className="font-bold ml-2 rounded-lg">
            This user is taking the {userExamReport[0].module.title} of{" "}
            {userExamReport[0].course.title}
          </div>
        </AlertDialogTrigger>
       
      </AlertDialog>
    );
  }
};
