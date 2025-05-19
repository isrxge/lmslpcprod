// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { getChapter } from "@/actions/get-chapter";
// import { Banner } from "@/components/banner";
// import { Preview } from "@/components/preview";
// import Exam from "./_components/exam";
// import Slide from "./_components/slide";
// import Link from "next/link";
// import { db } from "@/lib/db";
// import { AlertInExam } from "@/components/ui/alert-in-exam";
// const ChapterIdPage = async ({
//   params,
// }: {
//   params: { courseId: string; chapterId: string };
// }) => {
//   const { userId } = auth();

//   if (!userId) {
//     return redirect("/");
//   }

//   // 1) Kiểm tra xem user có record trong ClassSessionRecord (tức được assign vào course) không
//   const session = await db.classSessionRecord.findUnique({
//     where: {
//       courseId_userId: {
//         courseId: params.courseId,
//         userId,
//       },
//     },
//   });

//    // 2) Nếu chưa được assign => chỉ hiển thị description hoặc redirect
//    if (!session) {
//     // Nếu bạn muốn redirect thẳng về homepage:
//     return redirect("/");

//     // Hoặc nếu có trang course riêng để show description, dùng redirect về đó:
//     // return redirect(`/courses/${params.courseId}`);

//     // Hoặc nếu bạn đã có component CourseDescription, render luôn phần mô tả bên dưới
//     // let course = await db.course.findUnique({
//     //   where: { id: params.courseId },
//     // });
//     // if (!course) return redirect("/");
//     // return <CourseDescription course={course} />;
//   }

//   let userInfo: any = await db.user.findUnique({
//     where: { id: userId },
//     include: {
//       userExamReport: {},
//     },
//   });
//   const {
//     chapter,
//     course,
//     preChapter,
//     nextChapter,
//     userProgress,
//     purchase,
//   }: any = await getChapter({
//     userId,
//     moduleId: params.chapterId,
//     courseId: params.courseId,
//   });

//   if (!chapter || !course) {
//     return redirect("/");
//   }
// let chapter1 = chapter.module
//   console.log("COURASSSS ", chapter.module);

//   return chapter.module.type == "Exam" ? (
//     <>
//       <Exam
//         chapter={chapter.module}
//         nextChapterId={nextChapter}
//         courseId={params.courseId}
//         course={course}
//         isCompleted={
//           userProgress?.status != undefined ? userProgress?.status : "studying"
//         }
//       />
//     </>
//   ) : (userInfo.userExamReport[0]?.isInExam && chapter.module.type != "Exam") ||
//     (userInfo.userExamReport[0]?.isInExam &&
//       chapter.module.type == "Exam" &&
//       chapter.module.id != userInfo.userExamReport[0]?.moduleId) ? (
//     <AlertInExam
//       courseId={userInfo.userExamReport[0]?.courseId}
//       moduleId={userInfo.userExamReport[0]?.moduleId}
//     ></AlertInExam>
//   ) : (
//     <div className="pl-6 pt-3">
//       {userProgress?.status == "finished" && (
//         <Banner variant="success" label="You already completed this Module." />
//       )}

//       <div className="flex flex-col pb-20 overflow-x-hidden">
//         <div>
//           <Slide
//             slide={chapter.module.Slide}
//             chapter={chapter.module}
//             nextChapterId={nextChapter}
//             preChapter={preChapter}
//             courseId={params.courseId}
//             course={course}
//             isCompleted={userProgress?.status}
//           ></Slide>
//           {/* Extra resources:{" "}
//           <ul className="list-decimal">
//             {chapter.Resource.map((item: any) => (
//               <li key={item.attachment}>
//                 <Link key={item.attachment} href={item.attachment} className="text-blue-600 hover:underline">
//                   {item.attachment.split("/").pop() as string}
//                 </Link>
//               </li>
//             ))}
//           </ul> */}
//         </div>
//         <div>
//           <div>
//             <Preview value={chapter.module.description!} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChapterIdPage;

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import Exam from "./_components/exam";
import Slide from "./_components/slide";
import Link from "next/link";
import { db } from "@/lib/db";
import { AlertInExam } from "@/components/ui/alert-in-exam";
const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
 
  if (!userId) {
    return redirect("/");
  }
 
  // 1) Kiểm tra xem user có record trong ClassSessionRecord (tức được assign vào course) không
  const session = await db.classSessionRecord.findUnique({
    where: {
      courseId_userId: {
        courseId: params.courseId,
        userId,
      },
    },
  });
 
  // 2) Nếu chưa được assign => chỉ hiển thị description hoặc redirect
  if (!session) {
    // Nếu bạn muốn redirect thẳng về homepage:
    return redirect("/");
 
    // Hoặc nếu có trang course riêng để show description, dùng redirect về đó:
    // return redirect(`/courses/${params.courseId}`);
 
    // Hoặc nếu bạn đã có component CourseDescription, render luôn phần mô tả bên dưới
    // let course = await db.course.findUnique({
    //   where: { id: params.courseId },
    // });
    // if (!course) return redirect("/");
    // return <CourseDescription course={course} />;
  }
 
  let userInfo: any = await db.user.findUnique({
    where: { id: userId },
    include: {
      userExamReport: {},
    },
  });
  const {
    chapter,
    course,
    preChapter,
    nextChapter,
    userProgress,
    purchase,
  }: any = await getChapter({
    userId,
    moduleId: params.chapterId,
    courseId: params.courseId,
  });
 
  if (!chapter || !course) {
    return redirect("/");
  }
 
  let currentDate: any = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  let dateGap = userInfo.typeUser == "probation" ? 3 : 7;
  let period = (currentDate - userProgress?.date) / oneDay;
  let ifInSameCourseAndFailed =
    userProgress?.courseId == params.courseId &&
    userProgress?.result == "failed";
  let ifInSameCourseAndCompleted =
    userProgress?.courseId == params.courseId &&
    userProgress?.result == "completed";
  let ifFailedAndDateGapBellowPolicy = period >= dateGap;
  console.log(
    ifInSameCourseAndFailed ||
      ifInSameCourseAndCompleted ||
      (!ifInSameCourseAndFailed && ifFailedAndDateGapBellowPolicy)
  );
  return chapter.module.type == "Exam" ? (
    <>
      <Exam
        chapter={chapter.module}
        nextChapterId={nextChapter}
        courseId={params.courseId}
        course={course}
        isCompleted={
          ifInSameCourseAndFailed ||
          ifInSameCourseAndCompleted ||
          (!ifInSameCourseAndFailed && ifFailedAndDateGapBellowPolicy)
        }
      />
    </>
  ) : (userInfo.userExamReport[0]?.isInExam && chapter.module.type != "Exam") ||
    (userInfo.userExamReport[0]?.isInExam &&
      chapter.module.type == "Exam" &&
      chapter.module.id != userInfo.userExamReport[0]?.moduleId) ? (
    <AlertInExam
      courseId={userInfo.userExamReport[0]?.courseId}
      moduleId={userInfo.userExamReport[0]?.moduleId}
    ></AlertInExam>
  ) : (
    <div className="pl-6 pt-3">
      {userProgress?.status == "finished" && (
        <Banner variant="success" label="You already completed this Module." />
      )}
 
      <div className="flex flex-col pb-20 overflow-x-hidden">
        <div>
          <Slide
            slide={chapter.module.Slide}
            chapter={chapter.module}
            nextChapterId={nextChapter}
            preChapter={preChapter}
            courseId={params.courseId}
            course={course}
            isCompleted={
              ifInSameCourseAndFailed ||
              ifInSameCourseAndCompleted ||
              (!ifInSameCourseAndFailed && ifFailedAndDateGapBellowPolicy)
            }
          ></Slide>
          {/* Extra resources:{" "}
          <ul className="list-decimal">
            {chapter.Resource.map((item: any) => (
              <li key={item.attachment}>
                <Link key={item.attachment} href={item.attachment} className="text-blue-600 hover:underline">
                  {item.attachment.split("/").pop() as string}
                </Link>
              </li>
            ))}
          </ul> */}
        </div>
        <div>
          <div>
            <Preview value={chapter.module.description!} />
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ChapterIdPage;