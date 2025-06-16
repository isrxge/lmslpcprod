<<<<<<< HEAD
// import { Program, Course } from "@prisma/client";
// import { CourseCardComplete } from "./ui/course-card-complete";
// import { CheckCircle, Focus } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// type CourseWithProgressWithCategory = Course & {
//   programs: Program | null;
//   modules: { id: string }[];
//   progress: string | null;
//   course: any;
//   BookMark: { length: number; id: string };
// };

// interface CompletedCourseProps {
//   items: CourseWithProgressWithCategory[];
// }

// export const CompletedCourse = ({ items }: CompletedCourseProps) => {
//   return items.length == 0 ? (
//     <>
//       <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
//         <CheckCircle className="mr-2" />
//         Completed Course
//       </h2>
//       <p className="mb-4 italic">No history</p>
//     </>
//   ) : (
//     <div>
//       <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
//         <CheckCircle className="mr-2" />
//         Completed Course
//       </h2>
//       <Carousel
//         opts={{
//           align: "start",
//         }}
//       >
//         <CarouselContent>
//           {items.map((item) => (
//             <CarouselItem
//               key={item?.course.id}
//               className="md:basis-1/3 lg:basis-1/4"
//             >
//               <CourseCardComplete
//                 key={item?.course.id}
//                 id={item?.course.id}
//                 title={item?.course.title}
//                 imageUrl={item?.course.imageUrl!}
//                 chaptersLength={item?.course.modules?.length}
//                 chapters={item?.course.modules}
//                 bookmark={item?.course.BookMark}
//                 endDate={item?.course.endDate}
//                 // progress={item?.progress}
//                 isLocked={false}
//                 description={item?.course.description}
//               />
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious />
//         <CarouselNext />
//       </Carousel>
//     </div>
//   );
// };

=======
>>>>>>> 8b13b57 (commit)
import { Program, Course } from "@prisma/client";
import { CourseCardComplete } from "./ui/course-card-complete";
import { CheckCircle, Focus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
<<<<<<< HEAD
 
=======

>>>>>>> 8b13b57 (commit)
type CourseWithProgressWithCategory = Course & {
  programs: Program | null;
  modules: { id: string }[];
  progress: string | null;
  course: any;
  BookMark: { length: number; id: string };
};
<<<<<<< HEAD
 
interface CompletedCourseProps {
  items: CourseWithProgressWithCategory[];
}
 
export const CompletedCourse = ({ items }: CompletedCourseProps) => {
  // console.log(items, "Failed course");
=======

interface CompletedCourseProps {
  items: CourseWithProgressWithCategory[];
}

export const CompletedCourse = ({ items }: CompletedCourseProps) => {
>>>>>>> 8b13b57 (commit)
  return items.length == 0 ? (
    <>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <CheckCircle className="mr-2" />
<<<<<<< HEAD
        Studied Course
=======
        Completed Course
>>>>>>> 8b13b57 (commit)
      </h2>
      <p className="mb-4 italic">No history</p>
    </>
  ) : (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <CheckCircle className="mr-2" />
<<<<<<< HEAD
        Studied Course
=======
        Completed Course
>>>>>>> 8b13b57 (commit)
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem
              key={item?.course.id}
              className="md:basis-1/3 lg:basis-1/4"
            >
              <CourseCardComplete
                key={item?.course.id}
                id={item?.course.id}
                title={item?.course.title}
                imageUrl={item?.course.imageUrl!}
                chaptersLength={item?.course.modules?.length}
                chapters={item?.course.modules}
                bookmark={item?.course.BookMark}
                endDate={item?.course.endDate}
<<<<<<< HEAD
                status={item?.status == "failed" ? false : true}
=======
>>>>>>> 8b13b57 (commit)
                // progress={item?.progress}
                isLocked={false}
                description={item?.course.description}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 8b13b57 (commit)
