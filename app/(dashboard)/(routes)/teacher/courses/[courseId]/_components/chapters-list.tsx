// import { Module, ModuleInCourse } from "@prisma/client";
// import { useEffect, useState } from "react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import { Grip, Trash } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// // import axios from "axios"

// interface ChaptersListProps {
//   items: Module[];
//   onReorder: (updateData: { id: string; position: number }[]) => void;
// }

// const deleteModule = async (moduleId: string, courseId: string) => {
//   try {
//     const response = await fetch("/api/moduleincourse", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         moduleId,
//         courseId,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete the module");
//     }

//     const data = await response.json();
//     console.log("Module removed:", data);
//     return data;
//   } catch (error) {
//     console.error("Error deleting module:", error);
//     return null;
//   }
// };

// export const ChaptersList = ({ items, onReorder }: ChaptersListProps) => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [chapters, setChapters] = useState(items);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const onDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const items = Array.from(chapters);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     const startIndex = Math.min(result.source.index, result.destination.index);
//     const endIndex = Math.max(result.source.index, result.destination.index);

//     const updatedChapters = items.slice(startIndex, endIndex + 1);

//     setChapters(items);

//     const bulkUpdateData = updatedChapters.map((chapter) => ({
//       id: chapter.id,
//       position: items.findIndex((item) => item.id === chapter.id),
//     }));

//     onReorder(bulkUpdateData);
//   };

//   const handleDelete = async (moduleId: string, courseId: string) => {
//     const result = await deleteModule(moduleId, courseId);
//     if (result) {
//       setChapters((prevChapters) =>
//         prevChapters.filter((chapter) => chapter.id !== moduleId)
//       );
//     }
//   };

//   if (!isMounted) {
//     return null;
//   }
//   console.log(chapters);
//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="chapters">
//         {(provided) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             {chapters.map((chapter: any, index) => (
//               <Draggable
//                 key={chapter.module.id}
//                 draggableId={chapter.module.id}
//                 index={index}
//               >
//                 {(provided) => (
//                   <div
//                     className={cn(
//                       `flex items-center gap-x-2  border-slate-200 border rounded-md mb-4 text-sm`,
//                       chapter.module.isPublished && `bg-sky-100 border-sky-200 `
//                     )}
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                   >
//                     <div
//                       className={cn(
//                         "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition dark:text-black",
//                         chapter.module.isPublished &&
//                           `border-r-sky-200 hover:bg-sky-200 `
//                       )}
//                       {...provided.dragHandleProps}
//                     >
//                       <Grip className="h-5 w-5" />
//                     </div>
//                     <div
//                       className={cn(
//                         "dark:text-black",
//                         chapter.module.isPublished
//                       )}
//                     >
//                       {chapter.module.title}
//                     </div>

//                     <div className="ml-auto pr-2 flex items-center gap-x-2">
//                       <Badge
//                         className={cn(
//                           "",
//                           "bg-slate-500",
//                           chapter.module.isPublished && `dark:text-slate-50`
//                         )}
//                       >
//                         {chapter.module.isPublished ? "Published" : "Draft"}
//                       </Badge>

//                       <button
//                         onClick={() =>
//                           handleDelete(chapter.module.id, chapter.courseId)
//                         }
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <Trash className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

import { Module } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ChaptersListProps {
  items: Module[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
}

const deleteModule = async (moduleId: string, courseId: string) => {
  try {
    const response = await fetch("/api/moduleincourse", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        moduleId,
        courseId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete the module");
    }

    const data = await response.json();
    console.log("Module removed:", data);
    return data;
  } catch (error) {
    console.error("Error deleting module:", error);
    return null;
  }
};

export const ChaptersList = ({ items, onReorder }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  const handleDelete = async (moduleId: string, courseId: string) => {
    const result = await deleteModule(moduleId, courseId);
    if (result) {
      // Loại bỏ module khỏi danh sách trong state chapters ngay lập tức
      setChapters((prevChapters) => {
        // Loại bỏ module có id bằng moduleId
        const updatedChapters = prevChapters.filter(
          (chapter) => chapter.id !== moduleId
        );
        return updatedChapters; // Cập nhật lại state
      });
      toast.success("Module has been removed successfully!");
      router.refresh();
    } else {
      // Hiển thị thông báo toast lỗi nếu xóa thất bại
      toast.error("Failed to remove module!");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter: any, index) => (
              <Draggable
                key={chapter.module.id}
                draggableId={chapter.module.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      `flex items-center gap-x-2  border-slate-200 border rounded-md mb-4 text-sm`,
                      chapter.module.isPublished && `bg-sky-100 border-sky-200 `
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition dark:text-black",
                        chapter.module.isPublished &&
                          `border-r-sky-200 hover:bg-sky-200 `
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    <div
                      className={cn(
                        "dark:text-black",
                        chapter.module.isPublished
                      )}
                    >
                      {chapter.module.title}
                    </div>

                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "",
                          "bg-slate-500",
                          chapter.module.isPublished && `dark:text-slate-50`
                        )}
                      >
                        {chapter.module.isPublished ? "Published" : "Draft"}
                      </Badge>

                      <button
                        onClick={() =>
                          handleDelete(chapter.module.id, chapter.courseId)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
