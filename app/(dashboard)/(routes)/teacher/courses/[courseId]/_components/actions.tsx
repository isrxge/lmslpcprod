// "use client";

// import axios from "axios";

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";
// import { ConfirmModal } from "@/components/modals/confirm-modal";
// import { Trash } from "lucide-react";
// import { useConfettiStore } from "@/hooks/use-confetti-store";

// interface ActionsProps {
//   disabled: boolean;
//   courseId: string;
//   isPublished: boolean;
//   title: string;
// }

// export const Actions = ({
//   disabled,
//   courseId,
//   isPublished,
//   title,
// }: ActionsProps) => {
//   const router = useRouter();
//   const confetti = useConfettiStore();
//   const [isLoading, setIsLoading] = useState(false);

//   const onClick = async () => {
//     try {
//       setIsLoading(true);

//       if (isPublished) {
//         await axios.patch(`/api/courses/${courseId}/unpublish`);
//         toast.success("Course unpublished");
//       } else {
//         await axios.patch(`/api/courses/${courseId}/publish`);
//         toast.success("Course published");

//         // var ably = new Ably.Realtime({
//         //   key: "n-gD0A.W4KQCg:GyPm6YTLBQsr4KhgPj1dLCwr0eg4y7OVFrBuyztiiWg",
//         // });
//         // const channelAbly = ably.channels.get("course-publish");
//         // let payload = {
//         //   type: "course-publish",
//         //   message: `<div style="border: 1px solid #ccc; border-radius: 10px; padding: 10px;"><strong>${title}</strong> has been published 🎉🎉🎉</div><br/>`,
//         //   link: `http://localhost:3000/courses/${courseId}`,
//         // };
//         // socket = io();
//         // socket.emit("course", payload);
//         // await channelAbly.publish("course-publish", payload);
//         // ably.close();
//         confetti.onOpen();
//       }

//       router.refresh();
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setIsLoading(true);
//       let getToken = await axios.get("/api/getToken");
//       let getCourse: any = await axios.get(`/api/courses/${courseId}`);
//       // await axios.delete(
//       //   `https://hcm01.vstorage.vngcloud.vn/v1/AUTH_1284e7f078154c0e8a25598be7cec675/Course/${getCourse.data.title}`,
//       //   {
//       //     headers: {
//       //       "Access-Control-Allow-Origin": "*",
//       //       "X-Auth-Token": getToken.data["x-subject-token"],
//       //     },
//       //   }
//       // );
//       await axios.delete(`/api/courses/${courseId}`);

//       toast.success("Course deleted");
//       router.refresh();
//       router.push(`/teacher/courses`);
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center gap-x-2">
//       <Button
//         onClick={onClick}
//         disabled={disabled || isLoading}
//         variant="outline"
//         size="sm"
//       >
//         {isPublished ? "Unpublish" : "Publish"}
//       </Button>
//       <ConfirmModal onConfirm={onDelete}>
//         <Button size="sm" disabled={isLoading}>
//           <Trash className="h-4 w-4" />
//         </Button>
//       </ConfirmModal>
//     </div>
//   );
// };

"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Trash } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useAuth } from "@clerk/clerk-react";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
  title: string;
  endDate?: string | null;  // ISO string hoặc null
  creatorId: string;
  canDeleteAny: boolean;
}

export const Actions = ({
  disabled,
  courseId,
  isPublished,
  title,
  endDate,
  creatorId,
  canDeleteAny
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const { userId } = useAuth(); // Assuming you have a way to get the current user
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = userId === creatorId;

  const showDelete = isOwner || canDeleteAny;

  // Tính xem course đã hết hạn chưa
  const isExpired = endDate
    ? new Date(endDate) <= new Date()
    : false;

  // Auto-unpublish ngay khi mount nếu hết hạn và vẫn đang published
  useEffect(() => {
    if (isExpired && isPublished) {
      axios
        .patch(`/api/courses/${courseId}/unpublish`)
        .then(() => {
          toast.success(`Course automatically unpublished (deadline passed)`);
          router.refresh();
        })
        .catch(() => {
          toast.error("Failed to auto-unpublish");
        });
    }
  }, [isExpired, isPublished, courseId, router]);

  const onClick = async () => {
    // Ngăn publish nếu đã hết hạn
    if (isExpired) {
      toast.error(
        "Cannot publish: the course deadline has passed. It remains unpublished."
      );
      return;
    }

    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Course deleted");
      router.push(`/teacher/courses`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading || isExpired}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      {/* <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
            <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal> */}
      {showDelete && (
        <ConfirmModal onConfirm={onDelete}>
          <Button size="sm" disabled={isLoading}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      )}
    </div>
  );
};
