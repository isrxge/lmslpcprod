import { Module, ModuleInCourse } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import axios from "axios"


interface ChaptersListProps {
  
  items: Module[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
}

export const ChaptersList = ({ items, onReorder }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);
  
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

  if (!isMounted) {
    return null;
  }
  console.log(chapters)
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter : any, index) => (
              <Draggable key={chapter.module.id} draggableId={chapter.module.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      `flex items-center gap-x-2  border-slate-200 border rounded-md mb-4 text-sm`,
                      chapter.module.isPublished &&
                        `bg-sky-100 border-sky-200 `
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
                          chapter.module.isPublished &&
                         `dark:text-slate-50`
                        )}
                      >
                        {chapter.module.isPublished ? "Published" : "Draft"}
                      </Badge>
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
