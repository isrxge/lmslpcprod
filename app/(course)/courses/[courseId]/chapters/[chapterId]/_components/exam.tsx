<<<<<<< HEAD
// "use client";
// import { Countdown } from "@/hooks/use-countdown";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { BookmarkCheck, Timer } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import { useRouter } from "next/navigation";
// import { useConfettiStore } from "@/hooks/use-confetti-store";
// import shuffleArray from "@/lib/shuffle";
// import DoughnutChart from "@/components/ui/doughnut-chart";
// import Image from "next/image";
// import { Prisma } from "@prisma/client";
// var CryptoJS = require("crypto-js");
// const Exam = ({
//   chapter,
//   nextChapterId,
//   courseId,
//   course,
//   isCompleted,
// }: any) => {
//   const router = useRouter();
//   const confetti = useConfettiStore();

//   // State chung
//   const [isPassed, setIsPassed] = useState(true);
//   const [finishedExam, setFinishedExam] = useState(false);
//   const [finalScore, setFinalScore] = useState(0); // kết quả từ server
//   const [examMaxScore, setExamMaxScore] = useState(100); // hiển thị chart
//   const [timeLimit, setTimeLimit]: any = useState(chapter.timeLimit);
//   const [timeLimitRecord, setTimeLimitRecord]: any = useState(
//     chapter.timeLimit * 60
//   );
//   const [maxAttempt, setMaxAttempt]: any = useState(chapter.maxAttempt);

//   // Xử lý questions
//   const [questions, setQuestions]: any = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswers, setSelectedAnswers]: any = useState([]);
//   const [categoryList, setCategoryList]: any = useState([...chapter.Category]);

//   // Các biến khác
//   const [onFinish, setOnFinish] = useState(false);
//   const [exemRecord, setExamRecord]: any = useState([]);
//   const [isGeneratingExam, setIsGeneratingExam] = useState(false);
//   const [reportId, setReportId] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentAttempt, setCurrentAttempt] = useState(1);
//   const [startDate, setStartDate]: any = useState(null);

//   useEffect(() => {
//     const getHistory = async () => {
//       const moduleId = chapter.id;
//       // Lấy user, examRecord, check if userIsInExam...
//       let currentUser = await axios.get(`/api/user`);
//       setCurrentUserId(currentUser.data.id);

//       // Lấy data exam + userProgress
//       let getLatestTestResult: any = await axios.get(
//         `/api/module/${chapter.id}/category/exam`
//       );

//       setFinishedExam(
//         getLatestTestResult?.data?.UserProgress[0]?.status === "finished" &&
//           getLatestTestResult !== undefined
//       );

//       setCurrentAttempt(
//         getLatestTestResult?.data?.UserProgress[0]?.retakeTime || 0
//       );
//       setFinalScore(getLatestTestResult?.data?.UserProgress[0]?.score || 0);
//       setCategoryList(getLatestTestResult?.data?.Category);

//       // Lấy examRecord
//       let getLatestExamRecord: any = await axios.get(
//         `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`
//       );
//       setExamRecord(getLatestExamRecord.data);

//       // Kiểm tra user IsInExam
//       let chekIfUserIsInExam: any = await axios.get(
//         `/api/user/${currentUser.data.id}/isInExam`
//       );

//       if (
//         chekIfUserIsInExam?.data?.isInExam === true &&
//         chapter.id == chekIfUserIsInExam?.data?.moduleId
//       ) {
//         setReportId(chekIfUserIsInExam.data.id);
//         const examObj: any = chekIfUserIsInExam.data
//           .examRecord as Prisma.JsonObject;

//         setQuestions(examObj.questionList || []);
//         setCurrentQuestion(examObj.currentQuestion || 0);

//         if (!examObj.isEmergency) {
//           setStartDate(examObj?.startDate);
//           setTimeLimit(examObj.timePassed * 60);
//           setTimeLimitRecord(examObj.timePassed);
//         } else {
//           setStartDate(examObj?.startDate);
//           setTimeLimit(chapter.timeLimit);
//           setTimeLimitRecord(chapter.timeLimit * 60);
//         }

//         setSelectedAnswers(examObj.selectedAnswers || []);
//         setCurrentAttempt(examObj.currentAttempt || 1);
//       }
//     };
//     getHistory();
//   }, [chapter.id, courseId]);

//   // Xử lý countdown

//   // useEffect(() => {
//   //   const getHistory = async () => {
//   //     const moduleId = chapter.id;

//   //     // 1) Lấy user hiện tại
//   //     let currentUser = await axios.get(`/api/user`);
//   //     setCurrentUserId(currentUser.data.id);

//   //     // 2) Kiểm tra user IsInExam
//   //     let chekIfUserIsInExam: any = await axios.get(
//   //       `/api/user/${currentUser.data.id}/isInExam`
//   //     );

//   //     // Nếu user đang thi & moduleId khớp => khôi phục state exam
//   //     let inExam = false;
//   //     if (
//   //       chekIfUserIsInExam?.data?.isInExam === true &&
//   //       chapter.id == chekIfUserIsInExam?.data?.moduleId
//   //     ) {
//   //       inExam = true;
//   //     }

//   //     // 3) Nếu user đang thi => Gọi API lấy exam + userProgress
//   //     let getLatestTestResult: any = null;
//   //     if (inExam) {
//   //       getLatestTestResult = await axios.get(
//   //         `/api/module/${moduleId}/category/exam`
//   //       );

//   //       setFinishedExam(
//   //         getLatestTestResult?.data?.UserProgress[0]?.status === "finished" &&
//   //           getLatestTestResult !== undefined
//   //       );

//   //       setCurrentAttempt(
//   //         getLatestTestResult?.data?.UserProgress[0]?.retakeTime || 0
//   //       );
//   //       setFinalScore(getLatestTestResult?.data?.UserProgress[0]?.score || 0);
//   //       setCategoryList(getLatestTestResult?.data?.Category);
//   //     } else {
//   //       // Nếu user không ở trạng thái exam,
//   //       // có thể gán giá trị mặc định hoặc setCategoryList([])
//   //       setCategoryList(chapter.Category || []);
//   //     }

//   //     // 4) Lấy examRecord (lịch sử) - tuỳ bạn
//   //     let getLatestExamRecord: any = await axios.get(
//   //       `/api/user/${currentUser.data.id}/examRecord/${moduleId}`
//   //     );
//   //     setExamRecord(getLatestExamRecord.data);

//   //     // 5) Nếu user đang thi => khôi phục questionList, v.v.
//   //     if (inExam) {
//   //       setReportId(chekIfUserIsInExam.data.id);
//   //       const examObj: any = chekIfUserIsInExam.data.examRecord as Prisma.JsonObject;

//   //       setQuestions(examObj.questionList || []);
//   //       setCurrentQuestion(examObj.currentQuestion || 0);

//   //       if (!examObj.isEmergency) {
//   //         setStartDate(examObj?.startDate);
//   //         setTimeLimit(examObj.timePassed * 60);
//   //         setTimeLimitRecord(examObj.timePassed);
//   //       } else {
//   //         setStartDate(examObj?.startDate);
//   //         setTimeLimit(chapter.timeLimit);
//   //         setTimeLimitRecord(chapter.timeLimit * 60);
//   //       }

//   //       setSelectedAnswers(examObj.selectedAnswers || []);
//   //       setCurrentAttempt(examObj.currentAttempt || 1);
//   //     }
//   //   };

//   //   getHistory();
//   // }, [chapter.id, courseId]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       window.addEventListener("beforeunload", alertUser);
//     }
//     const interval = setInterval(() => {
//       setTimeLimitRecord((prev: number) => {
//         if (questions.length > 0) {
//           if (prev === 0) {
//             clearInterval(interval);
//             setOnFinish(true);
//             setQuestions([]);
//             onTimeOut();
//             return prev;
//           }
//           return prev - 1;
//         }
//         return prev;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLimitRecord, questions]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       window.addEventListener("beforeunload", alertUser);
//       return () => {
//         window.removeEventListener("beforeunload", alertUser);
//       };
//     }
//   }, [questions, reportId, selectedAnswers, timeLimitRecord, currentQuestion]);

//   // Gửi data khi user đóng tab
//   const alertUser = async (e: any) => {
//     if (questions.length > 0) {
//       navigator.sendBeacon(
//         `/api/user/${currentUserId}/isInExam`,
//         JSON.stringify({
//           id: reportId,
//           isInExam: true,
//           note: "Sudden tabs or browser close.",
//           moduleId: chapter.id,
//           courseId,
//           date: new Date(),
//           examRecord: {
//             startDate: startDate,
//             date: new Date(),
//             timePassed: timeLimitRecord,
//             questionList: questions,
//             timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
//             currentQuestion: currentQuestion,
//             selectedAnswers: selectedAnswers,
//             isEmergency: false,
//             currentAttempt: currentAttempt,
//           },
//         })
//       );
//       e.preventDefault();
//       e.returnValue = "";
//     }
//   };

//   // (A) HÀM GỌI API SUBMIT EXAM Ở SERVER
//   const submitExamToServer = async () => {
//     try {
//       // Tạo payload answers: [ { examId, selected: [answerId1, answerId2] }, ... ]
//       const answersPayload = questions.map((q: any) => {
//         // "chooseAnswer": [ { id, text, ...}, ...]
//         // Chỉ cần array ID
//         return {
//           examId: q.id, // q.id = examId
//           selected: q.chooseAnswer
//             ? q.chooseAnswer.map((ans: any) => ans.id)
//             : [],
//         };
//       });

//       // Gọi API /submit
//       const response = await axios.post(
//         `/api/module/${chapter.id}/category/exam/submit`,
//         { answers: answersPayload }
//       );

//       // Kết quả server
//       const { score, passed } = response.data;

//       return { finalScore: score, passed };
//     } catch (error) {
//       console.error("submitExamToServer error:", error);
//       return { finalScore: 0, passed: false };
//     }
//   };

//   // (B) HÀM KHI HẾT THỜI GIAN
//   const onTimeOut: any = async () => {
//     if (questions.length === 0) {
//       // Không có câu hỏi => return
//       return;
//     }
//     // Gọi server để lấy finalScore, passed
//     const { finalScore, passed } = await submitExamToServer();
//     handleFinalizeExam(finalScore, passed);
//   };

//   // (C) HÀM XỬ LÝ EXAM Ở CÂU CUỐI CÙNG (NÚT SUBMIT)
//   const handleExamSubmit = async () => {
//     // Gọi server
//     const { finalScore, passed } = await submitExamToServer();
//     handleFinalizeExam(finalScore, passed);
//   };

//   //(D) XỬ LÝ KHI CÓ finalScore, passed
//   const handleFinalizeExam = async (finalScore: number, passed: boolean) => {
//     if (!finishedExam) {
//       // Giữ nguyên logic cũ
//       const date = new Date();
//       const totalScore = finalScore;
//       const courseCredit = course.credit || 0; // fallback
//       const finalResult = CryptoJS.AES.encrypt(
//         JSON.stringify({
//           status:
//             totalScore >= chapter.scoreLimit && passed ? "finished" : "failed",
//           score: parseInt(totalScore + ""),
//           progress: totalScore >= chapter.scoreLimit && passed ? "100%" : "0%",
//           endDate: date,
//           retakeTime: currentAttempt,
//         }),
//         "4Qz!9vB#xL7$rT8&hY2^mK0@wN5*pS1Zx!a2Lz"
//       ).toString();
//       // 1) Cập nhật progress chapter
//       if (currentAttempt >= maxAttempt) {
//         await axios.put(
//           `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
//           {
//             finalResult: finalResult,
//           }
//         );
//       } else {
//         await axios.put(
//           `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
//           {
//             finalResult: finalResult,
//           }
//         );
//       }

//       const courseResult = CryptoJS.AES.encrypt(
//         JSON.stringify({
//           status:
//           totalScore >= chapter.scoreLimit && passed
//             ? "finished"
//             : "failed",
//         progress:
//           totalScore >= chapter.scoreLimit && passed
//             ? "100%"
//             : "0%",
//         endDate: date,
//         score: parseInt(totalScore + ""),
//         }),
//         "4Qz!9vB#xL7$rT8&hY2^mK0@wN5*pS1Zx!a2Lz"
//       ).toString();

//       if (totalScore >= chapter.scoreLimit && passed) {
//         await axios.put(`/api/courses/${courseId}/progress`, {
//           courseResult : courseResult,
//         });

//         let currentUser = await axios.get(`/api/user`);
//         await axios.patch(`/api/user/${currentUser.data.id}/score`, {
//           star: parseInt(currentUser.data.star) + parseInt(courseCredit),
//           starUpdateDate: new Date(),
//         });
//       } else {
//         // Fail -> update course
//         await axios.put(`/api/courses/${courseId}/progress`, {
//           courseResult : courseResult,
//         });
//       }

//       // 2) Nếu đậu => update course, user star
//       // if (totalScore >= chapter.scoreLimit && passed) {
//       //   await axios.put(`/api/courses/${courseId}/progress`, {
//       //     status: "finished",
//       //     progress: "100%",
//       //     endDate: date,
//       //     score: parseInt(totalScore + ""),
//       //   });

//       //   let currentUser = await axios.get(`/api/user`);
//       //   await axios.patch(`/api/user/${currentUser.data.id}/score`, {
//       //     star: parseInt(currentUser.data.star) + parseInt(courseCredit),
//       //     starUpdateDate: new Date(),
//       //   });
//       // } else {
//       //   // Fail -> update course
//       //   await axios.put(`/api/courses/${courseId}/progress`, {
//       //     status: "failed",
//       //     progress: "0%",
//       //     endDate: date,
//       //     score: parseInt(totalScore + ""),
//       //   });
//       // }

//       // 3) Gửi thông báo isInExam => false
//       await axios.post(
//         `/api/user/${currentUserId}/isInExam`,
//         JSON.stringify({
//           id: reportId,
//           isInExam: false,
//           note: "Finished Exam.",
//           moduleId: chapter.id,
//           courseId,
//           date: new Date(),
//           examRecord: {
//             startDate: startDate,
//             date: new Date(),
//             timePassed: timeLimitRecord,
//             questionList: questions,
//             timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
//             currentQuestion: currentQuestion,
//             selectedAnswers: selectedAnswers,
//             currentAttempt: currentAttempt,
//           },
//         })
//       );
//     }

//     // 4) Cập nhật state hiển thị
//     setOnFinish(true);
//     setQuestions([]);
//     setFinalScore(finalScore);
//     setIsPassed(passed);

//     // Cuối cùng, patch user isInExam => false
//     let currentUser = await axios.get(`/api/user`);
//     await axios.patch(`/api/user/${currentUser.data.id}/isInExam`, {
//       id: reportId,
//       values: {
//         isInExam: false,
//         moduleId: chapter.id,
//         courseId,
//       },
//     });

//     await axios.post("/api/exam-result", {
//       userId: currentUserId,
//       courseTitle: course.title,
//       moduleTitle: chapter.title,
//       score: finalScore,
//       passed: passed,
//       attempt: currentAttempt,
//       date: new Date(),
//     });

//     router.refresh();
//   };

//   // const handleFinalizeExam = async (finalScore: number, passed: boolean) => {
//   //   // 1. Cập nhật UI
//   //   setOnFinish(true);
//   //   setQuestions([]);
//   //   setFinalScore(finalScore);
//   //   setIsPassed(passed);

//   //   // 2. Đánh dấu người dùng không còn ở trạng thái thi
//   //   const currentUser = await axios.get("/api/user");
//   //   await axios.patch(`/api/user/${currentUser.data.id}/isInExam`, {
//   //     id: reportId,
//   //     values: { isInExam: false, moduleId: chapter.id, courseId },
//   //   });

//   //   // (tuỳ chọn) log examRecord lần cuối – KHÔNG ghi điểm
//   //   await axios.post(`/api/user/${currentUserId}/isInExam`, {
//   //     id: reportId,
//   //     isInExam: false,
//   //     note: "Finished Exam.",
//   //     moduleId: chapter.id,
//   //     courseId,
//   //     date: new Date(),
//   //   });

//   //   router.refresh();
//   // };

//   const accept = async () => {
//     setFinalScore(0);
//     setOnFinish(false);
//     setCurrentQuestion(0);
//     setSelectedAnswers([]);
//     setIsPassed(true);
//     setStartDate(new Date());
//     setIsGeneratingExam(true);

//     const moduleId = chapter.id;

//     // 1) Gọi API đánh dấu isInExam = true TRƯỚC KHI gọi /shuffle
//     const currentUser = await axios.get(`/api/user`);
//     const report = await axios.post(
//       `/api/user/${currentUser.data.id}/isInExam`,
//       {
//         id: "0",
//         examRecord: {
//           questionList: [], // Để rỗng hoặc tuỳ
//           timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
//           currentQuestion: 0,
//           selectedAnswers: [],
//           currentAttempt: currentAttempt,
//         },
//         note: "",
//         isInExam: true,
//         moduleId: chapter.id,
//         date: new Date(),
//         courseId,
//       }
//     );
//     setReportId(report.data.id);

//     // 2) Nếu chưa finishedExam => tăng số lần Attempt
//     if (!finishedExam) {
//       setCurrentAttempt(currentAttempt + 1);
//     }

//     // 3) Gọi API /shuffle để lấy đề
//     let questionList = await axios.get(
//       `/api/module/${moduleId}/category/exam/shuffle`
//     );
//     let questionLists = shuffleArray(questionList.data.ExamList);
//     setQuestions(questionLists);

//     // 4) Các cập nhật state còn lại
//     setIsGeneratingExam(false);
//     setTimeLimit(chapter.timeLimit);
//     setTimeLimitRecord(chapter.timeLimit * 60);
//   };

//   // Khi user chọn đáp án
//   const handleAnswerClick = async (question: any, option: any) => {
//     const updatedAnswers: any = [...selectedAnswers];

//     if (
//       "chooseAnswer" in question &&
//       question["chooseAnswer"].some((ans: any) => ans.id === option.id)
//     ) {
//       // Bỏ chọn
//       question["chooseAnswer"] = question["chooseAnswer"].filter(
//         (ans: any) => ans.id !== option.id
//       );
//       updatedAnswers[currentQuestion] = question;
//     } else {
//       // Chọn thêm
//       if (question.type === "singleChoice") {
//         question["chooseAnswer"] = [option];
//       } else {
//         if (!("chooseAnswer" in question)) {
//           question["chooseAnswer"] = [];
//         }
//         question["chooseAnswer"] = [...question["chooseAnswer"], option];
//       }
//       updatedAnswers[currentQuestion] = question;
//     }
//     setSelectedAnswers(updatedAnswers);

//     // Cập nhật isInExam
//     await axios.post(
//       `/api/user/${currentUserId}/isInExam`,
//       JSON.stringify({
//         id: reportId,
//         isInExam: true,
//         note: "",
//         moduleId: chapter.id,
//         courseId,
//         date: new Date(),
//         examRecord: {
//           startDate: startDate,
//           date: new Date(),
//           timePassed: timeLimitRecord,
//           questionList: questions,
//           timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
//           currentQuestion: currentQuestion,
//           selectedAnswers: updatedAnswers,
//           currentAttempt: currentAttempt,
//         },
//       })
//     );
//   };

//   // Nhảy câu hỏi kế
//   const handleNextClick = async () => {
//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < questions.length) {
//       setCurrentQuestion(nextQuestion);
//       // Cập nhật isInExam
//       await axios.post(
//         `/api/user/${currentUserId}/isInExam`,
//         JSON.stringify({
//           id: reportId,
//           isInExam: true,
//           note: "",
//           moduleId: chapter.id,
//           courseId,
//           date: new Date(),
//           examRecord: {
//             startDate: startDate,
//             date: new Date(),
//             timePassed: timeLimitRecord,
//             questionList: questions,
//             timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
//             currentQuestion: nextQuestion,
//             selectedAnswers: selectedAnswers,
//             currentAttempt: currentAttempt,
//           },
//         })
//       );
//     } else {
//       // Câu cuối => Submit exam
//       // Kiểm tra unanswered
//       const unanswered = questions.filter((q: any) => {
//         if (q.type === "singleChoice" || q.type === "multiChoice") {
//           return !q.chooseAnswer || q.chooseAnswer.length === 0;
//         }
//         return false;
//       });
//       if (unanswered.length > 0) {
//         toast.error("Please answer all questions before submitting.");
//         return;
//       }

//       // Gọi server submit
//       // (vẫn ghi log examRecord)
//       if (isCompleted !== "finished") {
//         await axios.post(
//           `/api/user/${currentUserId}/examRecord/${chapter.id}`,
//           JSON.stringify({
//             moduleId: chapter.id,
//             courseId,
//             date: new Date(),
//             examRecord: {
//               questionList: questions,
//               selectedAnswers: selectedAnswers,
//             },
//           })
//         );
//       }

//       // Submit exam => chấm server
//       await handleExamSubmit();
//     }
//   };

//   // Quay lại câu trước
//   const handlePreviousClick = () => {
//     const previousQuestion = currentQuestion - 1;
//     if (previousQuestion >= 0) {
//       setCurrentQuestion(previousQuestion);
//     }
//   };

//   // setBookmark
//   const setBookmark = (index: any) => {
//     let newArr = [...questions];
//     if (newArr[index]?.bookmark) {
//       newArr[index].bookmark = false;
//     } else {
//       newArr[index].bookmark = true;
//     }
//     setQuestions(newArr);
//   };

//   // onLeaving
//   const onLeaving = () => {
//     setOnFinish(false);
//     if (nextChapterId != null) {
//       router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
//     } else {
//       router.push(`/`);
//     }
//     router.refresh();
//   };

//   // Format time
//   const minutes = Math.floor(timeLimitRecord / 60);
//   const seconds = timeLimitRecord % 60;
//   const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
//     seconds
//   ).padStart(2, "0")}`;

//   // Render
//   return questions.length === 0 ? (
//     <>
//       {/* Giao diện chờ/bắt đầu exam */}
//       <div className="max-w-6xl mx-auto p-6 mt-5">
//         <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
//           <h2 className="text-2xl font-bold mb-4">Welcome to the Exam</h2>
//           <p className="text-lg mb-4">
//             Before you begin, please take a moment to review the following
//             information about the exam.
//           </p>
//           <ul className="list-disc pl-5 mb-4">
//             <li className="mb-2">
//               This exam consists of multiple-choice questions.
//             </li>
//             {isCompleted === "finished" ? null : (
//               <li className="mb-2">
//                 You will have{" "}
//                 <span className="text-red-600">
//                   {chapter.maxAttempt - currentAttempt < 0
//                     ? 0
//                     : chapter.maxAttempt - currentAttempt}{" "}
//                   times
//                 </span>{" "}
//                 to do the exam.
//               </li>
//             )}
//             <li className="mb-2">
//               You will have{" "}
//               <span className="text-red-600">{chapter.timeLimit} minutes</span>{" "}
//               to complete the exam.
//             </li>
//             <li className="mb-2">
//               You need at least{" "}
//               <span className="text-red-600">{chapter.scoreLimit}%</span> to
//               pass the exam.
//             </li>
//             <li className="mb-2">
//               Make sure you are in a quiet environment to avoid distractions.
//             </li>
//           </ul>

//           <AlertDialog open={onFinish}>
//             {/* ... AlertDialog hiển thị kết quả ... */}
//             <AlertDialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto p-6">
//               <AlertDialogTitle className="text-center">
//                 <div
//                   className={`${
//                     (finalScore >= chapter.scoreLimit && isPassed) ||
//                     finishedExam
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                   } text-white p-6 rounded-t-lg`}
//                 >
//                   <h2 className="text-2xl font-semibold">
//                     Your score is{" "}
//                     <span className="text-4xl font-bold">{finalScore}</span>
//                   </h2>
//                 </div>

//                 <div className="p-6 text-center">
//                   <p className="text-lg mb-4">
//                     {(finalScore >= chapter.scoreLimit && isPassed) ||
//                     finishedExam
//                       ? nextChapterId !== null
//                         ? "Congratulations on completing the exam!"
//                         : "You have successfully completed the exam."
//                       : "Sorry, you have failed. Better luck next time!"}
//                   </p>

//                   {(finalScore >= chapter.scoreLimit && isPassed) ||
//                   finishedExam ? (
//                     <div className="flex justify-center mt-4">
//                       <Image
//                         src="/congratulationLPC.svg"
//                         alt="Congratulations"
//                         height={300}
//                         width={500}
//                         className="object-cover rounded-md border-4 border-white shadow-lg"
//                       />
//                     </div>
//                   ) : (
//                     <div className="flex justify-center mt-4">
//                       <Image
//                         src="/failurewh.png"
//                         alt="Failure"
//                         height={300}
//                         width={500}
//                         className="object-cover rounded-md border-4 border-white shadow-lg"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </AlertDialogTitle>

//               <div className="flex justify-between p-6">
//                 {isCompleted === "failed" && currentAttempt < maxAttempt ? (
//                   <AlertDialogCancel
//                     onClick={() => accept()}
//                     className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md"
//                   >
//                     Retake Exam
//                   </AlertDialogCancel>
//                 ) : isCompleted === "failed" && currentAttempt >= maxAttempt ? (
//                   <span className="text-red-500 font-semibold">
//                     Sorry, please wait for the exam reset to retake this test.
//                   </span>
//                 ) : null}

//                 {isCompleted === "failed" ? (
//                   <AlertDialogCancel
//                     onClick={() => setOnFinish(false)}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md"
//                   >
//                     Close
//                   </AlertDialogCancel>
//                 ) : null}

//                 {(finalScore >= chapter.scoreLimit && isPassed) ||
//                 finishedExam ? (
//                   <AlertDialogAction asChild>
//                     <button
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md"
//                       onClick={() => onLeaving()}
//                     >
//                       {nextChapterId != null ? "Next" : "Leave"}
//                     </button>
//                   </AlertDialogAction>
//                 ) : null}
//               </div>
//             </AlertDialogContent>
//           </AlertDialog>

//           <div className="mt-6">
//             <p className="text-lg mb-4">Include:</p>
//             <ul className="list-disc pl-5">
//               {chapter.Category.map((item: any) => {
//                 return (
//                   <li key={item.id} className="mb-2">
//                     {item.title}:{" "}
//                     {Math.floor(
//                       (parseInt(item.numOfAppearance) /
//                         parseInt(
//                           chapter.Category.reduce(
//                             (n: number, { numOfAppearance }: any) =>
//                               n + numOfAppearance,
//                             0
//                           )
//                         )) *
//                         100
//                     )}
//                     %
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>

//           <AlertDialog>
//             <div className="font-bold ml-2 rounded-lg">
//               {isGeneratingExam ? (
//                 <div>Please wait while we generate your exam...</div>
//               ) : isCompleted === "failed" &&
//                 currentAttempt >= maxAttempt ? null : (
//                 <AlertDialogTrigger className="flex justify-center items-center">
//                   <>👉Take an exam</>
//                 </AlertDialogTrigger>
//               )}
//               {isCompleted === "failed" && currentAttempt >= maxAttempt ? (
//                 <span className="text-red-500">
//                   Sorry, please wait for the exam reset to retake this test
//                 </span>
//               ) : null}
//             </div>
//             <AlertDialogContent className="AlertDialogContent">
//               <AlertDialogTitle className="AlertDialogTitle">
//                 Exam note
//               </AlertDialogTitle>
//               <AlertDialogDescription className="AlertDialogDescription">
//                 {!finishedExam && isCompleted === "studying" ? (
//                   <>Do you want to do the exam?</>
//                 ) : isCompleted === "failed" && currentAttempt >= maxAttempt ? (
//                   <>Please wait until admin reset</>
//                 ) : (
//                   <>Do you want to retake this exam?</>
//                 )}
//               </AlertDialogDescription>
//               <div
//                 style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
//               >
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction asChild>
//                   {isCompleted === "failed" &&
//                   currentAttempt >= maxAttempt ? null : (
//                     <button className="Button red" onClick={() => accept()}>
//                       Yes
//                     </button>
//                   )}
//                 </AlertDialogAction>
//               </div>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </div>
//       {/* Score hiển thị */}
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
//           <h2 className="text-2xl font-bold mb-6">Exam Score</h2>
//           <div className="mb-6">
//             <DoughnutChart score={finalScore} maxScore={examMaxScore} />
//           </div>
//           {finishedExam ? (
//             <div>
//               <p className="text-lg mb-2">
//                 You finished the exam. Retakes will not count.
//               </p>
//             </div>
//           ) : (
//             <div>
//               <p className="text-lg mb-2">Your current score. Keep going!</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* <AlertDialog>
//         {exemRecord.length > 0 ? (
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
//               <h2 className="text-2xl font-bold mb-6">Exam History</h2>
//               <p className="text-lg mb-6">
//                 You have taken this test for: {exemRecord.length} times
//               </p>
//               <div className="space-y-6">
//                 {exemRecord[0]?.examRecord?.questionList?.map((item: any) => {
//                   return (
//                     <div key={item.id} className="p-4 rounded-lg bg-green-100">
//                       <h3 className="text-base font-semibold text-green-700">
//                         {item.question}
//                       </h3>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
//               <h2 className="text-2xl font-bold mb-6">Exam History</h2>
//               <div className="mb-6">
//                 <p>No record found.</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </AlertDialog> */}
//     </>
//   ) : (
//     // Giao diện thi
//     <main className="min-h-full items-center">
//       <div className="flex">
//         <div className="w-3/4 p-8">
//           <div className="p-6 shadow-md rounded-md border border-blue-500">
//             <div className="flex flex-col">
//               <div className="flex flex-row items-center my-2.5">
//                 <span>
//                   {currentQuestion + 1} of {questions.length} questions
//                 </span>
//                 <div className="flex ml-auto rounded-full bg-blue-500 p-2 text-white">
//                   <Timer />
//                   <span className="mr-2"></span>
//                   {formattedTime}
//                 </div>
//               </div>
//               <hr className="my-3" />
//               <p className="text-2xl font-bold mb-4 flex items-center select-none">
//                 {currentQuestion + 1}. {questions[currentQuestion]?.question}{" "}
//                 {questions[currentQuestion]?.type === "multiChoice"
//                   ? "(Multiple choices)"
//                   : ""}
//                 <div className="ml-auto">
//                   <BookmarkCheck
//                     className={`${
//                       questions[currentQuestion]?.bookmark
//                         ? "bg-yellow-400"
//                         : ""
//                     }`}
//                     cursor={"pointer"}
//                     onClick={() => setBookmark(currentQuestion)}
//                   />
//                 </div>
//               </p>
//               <ul>
//                 {questions[currentQuestion]?.answer?.map(
//                   (option: any, index: any) => (
//                     <li
//                       key={index}
//                       onClick={() =>
//                         handleAnswerClick(questions[currentQuestion], option)
//                       }
//                       className={`cursor-pointer py-2 px-4 mb-2 border ${
//                         selectedAnswers[currentQuestion] &&
//                         selectedAnswers[currentQuestion]?.chooseAnswer?.some(
//                           (ans: any) => ans.id === option.id
//                         )
//                           ? "border-blue-600 text-white bg-blue-600"
//                           : "border-gray-300 text-black dark:text-white"
//                       } rounded-md hover:border-blue-600 hover:bg-blue-600 hover:text-white select-none`}
//                     >
//                       {(index + 10).toString(36).toUpperCase() +
//                         ". " +
//                         option.text}
//                     </li>
//                   )
//                 )}
//               </ul>
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={handlePreviousClick}
//                   className={`py-2 px-4 bg-gray-500 text-white rounded-md ${
//                     currentQuestion === 0 ? "hidden" : ""
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={handleNextClick}
//                   className={`py-2 px-4 bg-green-500 text-white rounded-md ml-auto${
//                     currentQuestion === questions.length - 1 ? "hidden" : ""
//                   }`}
//                 >
//                   {currentQuestion + 1 < questions.length ? "Next" : "Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-1/4 p-8">
//           <div className="shadow-md rounded-md border border-blue-500">
//             <div className="p-4 flex flex-wrap">
//               {questions.map((item: any, index: any) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentQuestion(index)}
//                   className={`w-8 h-8 flex items-center justify-center text-white rounded-full transition-colors duration-150 focus:outline-none mb-4 mx-1
//                     ${
//                       item.bookmark
//                         ? "bg-yellow-400"
//                         : item?.chooseAnswer?.length > 0
//                         ? "bg-green-600"
//                         : ""
//                     }
//                     ${
//                       currentQuestion === index ? "bg-blue-700" : "bg-gray-500"
//                     }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="flex items-center">
//               <div className="w-6 h-6 rounded-full bg-gray-500 mr-2" />
//               <strong>: Not answered</strong>
//             </div>
//             <div className="flex items-center mt-2">
//               <div className="w-6 h-6 rounded-full bg-green-600 mr-2" />
//               <strong>: Answered</strong>
//             </div>
//             <div className="flex items-center mt-2">
//               <div className="w-6 h-6 rounded-full bg-yellow-400 mr-2" />
//               <strong>: Bookmarks</strong>
//             </div>
//             <div className="flex items-center mt-2">
//               <div className="w-6 h-6 rounded-full bg-blue-600 mr-2" />
//               <strong>: Selected</strong>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Exam;

=======
>>>>>>> 8b13b57 (commit)
"use client";
import { Countdown } from "@/hooks/use-countdown";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookmarkCheck, Timer } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import shuffleArray from "@/lib/shuffle";
import DoughnutChart from "@/components/ui/doughnut-chart";
import Image from "next/image";
import { Prisma } from "@prisma/client";
<<<<<<< HEAD
var CryptoJS = require("crypto-js");
=======

>>>>>>> 8b13b57 (commit)
const Exam = ({
  chapter,
  nextChapterId,
  courseId,
  course,
  isCompleted,
<<<<<<< HEAD
  isFailed,
  dateRemain,
  isSameCourseAndFailed
}: any) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  // State chung
  const [isPassed, setIsPassed] = useState(true);
  const [finishedExam, setFinishedExam] = useState(false);
  const [finalScore, setFinalScore] = useState(0); // kết quả từ server
  const [examMaxScore, setExamMaxScore] = useState(100); // hiển thị chart
  const [timeLimit, setTimeLimit]: any = useState(chapter.timeLimit);
  const [timeLimitRecord, setTimeLimitRecord]: any = useState(
    chapter.timeLimit * 60
  );

  // Xử lý questions
  const [questions, setQuestions]: any = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers]: any = useState([]);
  const [categoryList, setCategoryList]: any = useState([...chapter.Category]);

  // Các biến khác
=======
}: any) => {
  const router = useRouter();
  const [isPassed, setIsPassed] = useState(true);
  const [categoryList, setCategoryList]: any = useState([...chapter.Category]);
  const [finishedExam, setFinishedExam] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLimit, setTimeLimit]: any = useState(chapter.timeLimit);
  const [maxAttempt, setMaxAttempt]: any = useState(chapter.maxAttempt);
  const [timeLimitRecord, setTimeLimitRecord]: any = useState(
    chapter.timeLimit * 60
  );
  const [questions, setQuestions]: any = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examMaxScore, setExamMaxSocre] = useState(0);
  const [selectedAnswers, setSelectedAnswers]: any = useState([]);
>>>>>>> 8b13b57 (commit)
  const [onFinish, setOnFinish] = useState(false);
  const [exemRecord, setExamRecord]: any = useState([]);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [reportId, setReportId] = useState("");
<<<<<<< HEAD
  const [currentUserId, setCurrentUserId] = useState(null);

  const [startDate, setStartDate]: any = useState(null);

  useEffect(() => {
    const getHistory = async () => {
      const moduleId = chapter.id;
      // Lấy user, examRecord, check if userIsInExam...
      let currentUser = await axios.get(`/api/user`);
      setCurrentUserId(currentUser.data.id);

      // Lấy data exam + userProgress
      let getLatestTestResult: any = await axios.get(
        `/api/module/${chapter.id}/category/exam/examRecord`
      );

      if (getLatestTestResult?.data.length > 0) {
        setFinishedExam(
          getLatestTestResult?.data[0]?.result !== "studying" &&
            getLatestTestResult !== undefined
        );
      }

      let getLatestTestResultScore: any = await axios.get(
        `/api/module/${chapter.id}/category/exam`
      );
      // setCurrentAttempt(
      //   getLatestTestResultScore?.data?.UserProgress[0]?.retakeTime || 0
      // );
      setFinalScore(
        getLatestTestResultScore?.data?.UserProgress[0]?.score || 0
      );
      setCategoryList(getLatestTestResultScore?.data?.Category);

      // Lấy examRecord
      let getLatestExamRecord: any = await axios.get(
        `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`
      );
      setExamRecord(getLatestExamRecord.data);

      // Kiểm tra user IsInExam
=======
  // const [recordId, setRecordId] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const confetti = useConfettiStore();
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [startDate, setStartDate]: any = useState(null);
  useEffect(() => {
    const getHistory = async () => {
      const moduleId = chapter.id;
      let getLatestTestResult: any = await axios.get(
        // `/api/courses/${courseId}/chapters/${chapter.id}/category/exam`
        `/api/module/${chapter.id}/category/exam`
      );

      console.log("getLatestTestResult", getLatestTestResult);

      setFinishedExam(
        getLatestTestResult?.data?.UserProgress[0]?.status == "finished" &&
          getLatestTestResult != undefined
          ? true
          : false
      );

      setCurrentAttempt(
        getLatestTestResult?.data?.UserProgress[0]?.retakeTime != undefined
          ? getLatestTestResult?.data?.UserProgress[0]?.retakeTime
          : 0
      );
      setFinalScore(getLatestTestResult?.data?.UserProgress[0]?.score);
      setCategoryList(getLatestTestResult?.data?.Category);
      let currentUser = await axios.get(`/api/user`);
      setCurrentUserId(currentUser.data.id);

      let getLatestExamRecord: any = await axios.get(
        `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`
      );

      setExamRecord(getLatestExamRecord.data);
>>>>>>> 8b13b57 (commit)
      let chekIfUserIsInExam: any = await axios.get(
        `/api/user/${currentUser.data.id}/isInExam`
      );

      if (
<<<<<<< HEAD
        chekIfUserIsInExam?.data?.isInExam === true &&
        chapter.id == chekIfUserIsInExam?.data?.moduleId
      ) {
        setReportId(chekIfUserIsInExam.data.id);
        const examObj: any = chekIfUserIsInExam.data
          .examRecord as Prisma.JsonObject;

        setQuestions(examObj.questionList || []);
        setCurrentQuestion(examObj.currentQuestion || 0);
=======
        (chekIfUserIsInExam?.data?.isInExam == true &&
          chapter.id == chekIfUserIsInExam?.data?.moduleId) ||
        (chekIfUserIsInExam?.isInExam == true &&
          chapter.id == chekIfUserIsInExam?.moduleId)
      ) {
        setReportId(chekIfUserIsInExam?.data?.id || chekIfUserIsInExam?.id);
        const examObj: any =
          chekIfUserIsInExam?.data?.examRecord ||
          (chekIfUserIsInExam?.examRecord as Prisma.JsonObject);

        setQuestions(examObj.questionList);
        setCurrentQuestion(examObj.currentQuestion);
>>>>>>> 8b13b57 (commit)

        if (!examObj.isEmergency) {
          setStartDate(examObj?.startDate);
          setTimeLimit(examObj.timePassed * 60);
          setTimeLimitRecord(examObj.timePassed);
        } else {
          setStartDate(examObj?.startDate);
          setTimeLimit(chapter.timeLimit);
          setTimeLimitRecord(chapter.timeLimit * 60);
        }

<<<<<<< HEAD
        setSelectedAnswers(examObj.selectedAnswers || []);
        // setCurrentAttempt(examObj.currentAttempt || 1);
      }
    };
    getHistory();
  }, [chapter.id, courseId]);
=======
        setSelectedAnswers(examObj.selectedAnswers);
        setCurrentAttempt(examObj.currentAttempt);
        // accept();
      }
    };
    getHistory();
  }, []);
>>>>>>> 8b13b57 (commit)

  useEffect(() => {
    if (questions.length > 0) {
      window.addEventListener("beforeunload", alertUser);
    }
<<<<<<< HEAD
=======

>>>>>>> 8b13b57 (commit)
    const interval = setInterval(() => {
      setTimeLimitRecord((prev: number) => {
        if (questions.length > 0) {
          if (prev === 0) {
            clearInterval(interval);
            setOnFinish(true);
            setQuestions([]);
            onTimeOut();
<<<<<<< HEAD
            return prev;
          }
          return prev - 1;
        }
        return prev;
=======

            return prev;
          }

          return prev - 1;
        }
>>>>>>> 8b13b57 (commit)
      });
    }, 1000);

    return () => clearInterval(interval);
<<<<<<< HEAD
  }, [timeLimitRecord, questions]);
=======
  }, [timeLimitRecord]);
>>>>>>> 8b13b57 (commit)

  useEffect(() => {
    if (questions.length > 0) {
      window.addEventListener("beforeunload", alertUser);
      return () => {
        window.removeEventListener("beforeunload", alertUser);
      };
    }
  }, [questions, reportId, selectedAnswers, timeLimitRecord, currentQuestion]);
<<<<<<< HEAD

  // Gửi data khi user đóng tab
  const alertUser = async (e: any) => {
    if (questions.length > 0) {
      navigator.sendBeacon(
        `/api/user/${currentUserId}/isInExam`,
        JSON.stringify({
          id: reportId,
          isInExam: true,
          note: "Sudden tabs or browser close.",
          moduleId: chapter.id,
          courseId,
          date: new Date(),
          examRecord: {
            startDate: startDate,
            date: new Date(),
            timePassed: timeLimitRecord,
            questionList: questions,
            timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
            currentQuestion: currentQuestion,
            selectedAnswers: selectedAnswers,
            isEmergency: false,
            // currentAttempt: currentAttempt,
          },
        })
      );
      e.preventDefault();
      e.returnValue = "";
    }
  };

  // (A) HÀM GỌI API SUBMIT EXAM Ở SERVER
  const submitExamToServer = async () => {
    try {
      // Tạo payload answers: [ { examId, selected: [answerId1, answerId2] }, ... ]
      const answersPayload = questions.map((q: any) => {
        // "chooseAnswer": [ { id, text, ...}, ...]
        // Chỉ cần array ID
        return {
          examId: q.id, // q.id = examId
          selected: q.chooseAnswer
            ? q.chooseAnswer.map((ans: any) => ans.id)
            : [],
        };
      });

      // Gọi API /submit
      const response = await axios.post(
        `/api/module/${chapter.id}/category/exam/submit`,
        { answers: answersPayload }
      );

      // Kết quả server
      const { score, passed } = response.data;

      return { finalScore: score, passed };
    } catch (error) {
      console.error("submitExamToServer error:", error);
      return { finalScore: 0, passed: false };
    }
  };

  // (B) HÀM KHI HẾT THỜI GIAN
  const onTimeOut: any = async () => {
    if (questions.length === 0) {
      // Không có câu hỏi => return
      return;
    }
    // Gọi server để lấy finalScore, passed
    const { finalScore, passed } = await submitExamToServer();
    handleFinalizeExam(finalScore, passed);
  };

  // (C) HÀM XỬ LÝ EXAM Ở CÂU CUỐI CÙNG (NÚT SUBMIT)
  const handleExamSubmit = async () => {
    // Gọi server

    const { finalScore, passed } = await submitExamToServer();
    handleFinalizeExam(finalScore, passed);
  };

  //(D) XỬ LÝ KHI CÓ finalScore, passed
  const handleFinalizeExam = async (finalScore: number, passed: boolean) => {
    // Giữ nguyên logic cũ
    const date = new Date();
    const totalScore = finalScore;
    const courseCredit = course.credit || 0; // fallback
    const finalResult = CryptoJS.AES.encrypt(
      JSON.stringify({
        status:
          totalScore >= chapter.scoreLimit && passed ? "finished" : "failed",
        score: parseInt(totalScore + ""),
        progress: totalScore >= chapter.scoreLimit && passed ? "100%" : "0%",
        endDate: date,
        retakeTime: 0,
      }),
      "4Qz!9vB#xL7$rT8&hY2^mK0@wN5*pS1Zx!a2Lz"
    ).toString();
    // 1) Cập nhật progress chapter
    await axios.put(
      `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
      {
        finalResult: finalResult,
      }
    );

    const courseResult = CryptoJS.AES.encrypt(
      JSON.stringify({
        status:
          totalScore >= chapter.scoreLimit && passed ? "finished" : "failed",
        progress: totalScore >= chapter.scoreLimit && passed ? "100%" : "0%",
        endDate: date,
        score: parseInt(totalScore + ""),
      }),
      "4Qz!9vB#xL7$rT8&hY2^mK0@wN5*pS1Zx!a2Lz"
    ).toString();

    await axios.put(`/api/courses/${courseId}/progress`, {
      courseResult: courseResult,
    });

    let currentUser = await axios.get(`/api/user`);
    await axios.patch(`/api/user/${currentUser.data.id}/score`, {
      star: parseInt(currentUser.data.star) + parseInt(courseCredit),
      starUpdateDate: new Date(),
    });

    // 3) Gửi thông báo isInExam => false
    await axios.post(
      `/api/user/${currentUserId}/isInExam`,
      JSON.stringify({
        id: reportId,
        isInExam: false,
        note: "Finished Exam.",
=======
  const alertUser = async (e: any) => {
    navigator.sendBeacon(
      `/api/user/${currentUserId}/isInExam`,
      JSON.stringify({
        id: reportId,
        isInExam: true,
        note: "Sudden tabs or browser close.",
>>>>>>> 8b13b57 (commit)
        moduleId: chapter.id,
        courseId,
        date: new Date(),
        examRecord: {
          startDate: startDate,
          date: new Date(),
          timePassed: timeLimitRecord,
          questionList: questions,
          timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
          currentQuestion: currentQuestion,
          selectedAnswers: selectedAnswers,
<<<<<<< HEAD
          // currentAttempt: currentAttempt,
=======
          isEmergency: false,
          currentAttempt: currentAttempt,
>>>>>>> 8b13b57 (commit)
        },
      })
    );

<<<<<<< HEAD
    // 4) Cập nhật state hiển thị
    setOnFinish(true);
    setQuestions([]);
    setFinalScore(finalScore);
    setIsPassed(passed);

    // Cuối cùng, patch user isInExam => false

=======
    if (questions.length == 0) {
    } else {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  const onTimeOut: any = async () => {
    if (questions.length == 0) {
      // await axios.post(
      //   `/api/user/${currentUserId}/examRecord/${chapter.id}`,
      //   JSON.stringify({
      //     moduleId: chapter.id,
      //     courseId,
      //     date: new Date(),
      //     examRecord: {
      //       questionList: questions,
      //       selectedAnswers: selectedAnswers,
      //     },
      //   })
      // );
    } else {
      const { finalScore, passed }: any = calculateScore();
      const totalScore = finalScore;

      if (!finishedExam) {
        const date = new Date();
        if (currentAttempt >= maxAttempt) {
          await axios.put(
            // `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
            `/api/module/${chapter.id}/progress`,
            {
              status:
                totalScore >= chapter.scoreLimit && passed
                  ? "finished"
                  : "failed",
              score: parseInt(finalScore),
              progress:
                totalScore >= chapter.scoreLimit && passed ? "100%" : "0%",
              endDate: date,
              retakeTime: currentAttempt,
            }
          );
        } else {
          await axios.put(
            // `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
            `/api/module/${chapter.id}/progress`,

            {
              status:
                totalScore >= chapter.scoreLimit && passed
                  ? "finished"
                  : "studying",
              score: parseInt(finalScore),
              progress: "100%",
              endDate: date,
              retakeTime: currentAttempt,
            }
          );
        }

        if (totalScore >= chapter.scoreLimit && passed) {
          if (nextChapterId != null) {
            let checkIfNextChapterIsFinished = await axios.get(
              // `/api/courses/${courseId}/chapters/${nextChapterId}/progress`
              `/api/module/${nextChapterId}/progress`
            );
            if (checkIfNextChapterIsFinished.data.status == "finished") {
              if (
                checkIfNextChapterIsFinished.data.nextChapterId != undefined
              ) {
              } else {
                // await axios.put(`/api/courses/${courseId}/progress`, {
                await axios.put(`/api/module/progress`, {
                  status: "finished",
                  progress: "100%",
                  endDate: date,
                });
                // confetti.onOpen();
                let currentUser = await axios.get(`/api/user`);
                await axios.patch(`/api/user/${currentUser.data.id}/score`, {
                  star:
                    parseInt(currentUser.data.star) + parseInt(course.creadit),
                  starUpdateDate: new Date(),
                });
              }
            } else {
              await axios.put(
                // `/api/courses/${courseId}/chapters/${nextChapterId}/progress`,
                `/api/module/${nextChapterId}/progress`,

                {
                  status: "studying",
                  progress: "0%",
                  startDate: date,
                }
              );
              // await axios.put(`/api/courses/${courseId}/progress`, {
              await axios.put(`/api/module/progress`, {
                status: "studying",
                progress:
                  (course.Module.map((item: { id: any }) => item.id).indexOf(
                    nextChapterId
                  ) /
                    course.Module.length) *
                    100 +
                  "%",
                startDate: date,
              });
            }
            //router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          } else {
            // await axios.put(`/api/courses/${courseId}/progress`, {
            await axios.put(`/api/module/progress`, {
              status: "finished",
              progress: "100%",
              startDate: date,
            });
            // confetti.onOpen();
            let currentUser = await axios.get(`/api/user`);
            await axios.patch(`/api/user/${currentUser.data.id}/score`, {
              star: parseInt(currentUser.data.star) + parseInt(course.creadit),
              starUpdateDate: new Date(),
            });
          }
        }
        if (isCompleted != "finished") {
          await axios.post(
            `/api/user/${currentUserId}/examRecord/${chapter.id}`,
            JSON.stringify({
              courseId,
              date: new Date(),
              examRecord: {
                questionList: questions,

                selectedAnswers: selectedAnswers,
              },
            })
          );
        }
      }
      await axios.post(
        `/api/user/${currentUserId}/isInExam`,
        JSON.stringify({
          id: reportId,
          isInExam: false,
          note: "Finished exam.",
          moduleId: chapter.id,
          courseId,
          date: new Date(),
          examRecord: {
            startDate: startDate,
            date: new Date(),
            timePassed: timeLimitRecord,
            questionList: questions,
            timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
            currentQuestion: currentQuestion,
            selectedAnswers: selectedAnswers,
            currentAttempt: currentAttempt,
          },
        })
      );

      setOnFinish(true);
      setQuestions([]);
      // let currentUser = await axios.get(`/api/user`);
      // await axios.patch(
      //   `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`,
      //   examRecord
      // );
      if (totalScore >= chapter.scoreLimit && passed) {
        if (nextChapterId != null) {
          setTimeout(function () {
            // function code goes here
          }, 10000);
          router.push(`/`);
          router.refresh();
        }
      }
    }
    let currentUser = await axios.get(`/api/user`);
>>>>>>> 8b13b57 (commit)
    await axios.patch(`/api/user/${currentUser.data.id}/isInExam`, {
      id: reportId,
      values: {
        isInExam: false,
        moduleId: chapter.id,
        courseId,
      },
    });
<<<<<<< HEAD

    await axios.post("/api/exam-result", {
      userId: currentUserId,
      courseTitle: course.title,
      moduleTitle: chapter.title,
      score: finalScore,
      passed: passed,
      attempt: 1,
      date: new Date(),
    });
    await axios.post(`/api/module/${chapter.id}/category/exam/examRecord`, {
      user_Id: currentUserId,
      courseId: course.id,
      moduleId: chapter.id,
      result: passed ? "finished" : "failed",
    });
    router.refresh();
  };

  const accept = async () => {
    setFinalScore(0);
    setOnFinish(false);
=======
    router.refresh();
  };

  // Danh sách câu hỏi và đáp án

  // useEffect(() => {
  //   async function loadQuestion() {}
  //   loadQuestion();
  // }, []);
  const accept = async () => {
    setFinalScore(0);
    // setFinishedExam(false);
    setOnFinish(false);

>>>>>>> 8b13b57 (commit)
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setIsPassed(true);
    setStartDate(new Date());
    setIsGeneratingExam(true);
<<<<<<< HEAD

    const moduleId = chapter.id;

    // 1) Gọi API đánh dấu isInExam = true TRƯỚC KHI gọi /shuffle
    const currentUser = await axios.get(`/api/user`);
    const report = await axios.post(
      `/api/user/${currentUser.data.id}/isInExam`,
      {
        id: "0",
        examRecord: {
          questionList: [], // Để rỗng hoặc tuỳ
          timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
          currentQuestion: 0,
          selectedAnswers: [],
          currentAttempt: 1,
        },
        note: "",
        isInExam: true,
        moduleId: chapter.id,
        date: new Date(),
        courseId,
      }
    );
    setReportId(report.data.id);

    // 2) Nếu chưa finishedExam => tăng số lần Attempt
    if (!finishedExam) {
      // setCurrentAttempt(currentAttempt + 1);
    }

    // 3) Gọi API /shuffle để lấy đề
    let questionList = await axios.get(
      `/api/module/${moduleId}/category/exam/shuffle`
    );
    let questionLists = shuffleArray(questionList.data.ExamList);
    setQuestions(questionLists);

    // 4) Các cập nhật state còn lại
=======
    const moduleId = chapter.id;
    let questionLists: any = [];

    if (!finishedExam) {
      setCurrentAttempt(currentAttempt + 1);

      let questionList = await axios.get(
        // `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
        `/api/module/${moduleId}/category/exam/shuffle`
      );
      questionLists = shuffleArray(questionList.data.ExamList);
      setQuestions(questionLists);
    } else {
      let questionList = await axios.get(
        // `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
        // `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
        `/api/module/${moduleId}/category/exam/shuffle`
      );

      questionLists = shuffleArray(questionList.data.ExamList);
      setQuestions(questionLists);
    }
    let currentUser = await axios.get(`/api/user`);
    let report = await axios.post(`/api/user/${currentUser.data.id}/isInExam`, {
      id: "0",
      examRecord: {
        questionList: questionLists,
        timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
        currentQuestion: 0,
        selectedAnswers: [],
        currentAttempt: currentAttempt,
      },
      note: "",
      isInExam: true,
      moduleId: chapter.id,
      date: new Date(),
      courseId,
    });
    setReportId(report.data.id);
>>>>>>> 8b13b57 (commit)
    setIsGeneratingExam(false);
    setTimeLimit(chapter.timeLimit);
    setTimeLimitRecord(chapter.timeLimit * 60);
  };
<<<<<<< HEAD

  // Khi user chọn đáp án
=======
  // const cancel = () => {
  //   return redirect(`/courses`);
  // };
  // State để theo dõi câu hỏi hiện tại, điểm số và đáp án đã chọn cho từng câu hỏi

  // Hàm xử lý khi người dùng chọn một đáp án
>>>>>>> 8b13b57 (commit)
  const handleAnswerClick = async (question: any, option: any) => {
    const updatedAnswers: any = [...selectedAnswers];

    if (
      "chooseAnswer" in question &&
<<<<<<< HEAD
      question["chooseAnswer"].some((ans: any) => ans.id === option.id)
    ) {
      // Bỏ chọn
      question["chooseAnswer"] = question["chooseAnswer"].filter(
        (ans: any) => ans.id !== option.id
      );
      updatedAnswers[currentQuestion] = question;
    } else {
      // Chọn thêm
      if (question.type === "singleChoice") {
        question["chooseAnswer"] = [option];
      } else {
=======
      question["chooseAnswer"]
        .map((item: { id: any }) => item.id)
        .indexOf(option.id) != -1
    ) {
      let indexOf = question["chooseAnswer"]
        .map((item: { id: any }) => item.id)
        .indexOf(option.id);
      question["chooseAnswer"].splice(indexOf, 1);
      updatedAnswers[currentQuestion] = question;

      setSelectedAnswers(updatedAnswers);
    } else {
      // Lưu câu trả lời đã chọn vào state
      if (question.type == "singleChoice") {
        question["chooseAnswer"] = [];
        question["chooseAnswer"] = [...question["chooseAnswer"], option];
        updatedAnswers[currentQuestion] = question;
        setSelectedAnswers(updatedAnswers);
      } else {
        // question["chosedAnswer"] = [];
>>>>>>> 8b13b57 (commit)
        if (!("chooseAnswer" in question)) {
          question["chooseAnswer"] = [];
        }
        question["chooseAnswer"] = [...question["chooseAnswer"], option];
<<<<<<< HEAD
      }
      updatedAnswers[currentQuestion] = question;
    }
    setSelectedAnswers(updatedAnswers);

    // Cập nhật isInExam
=======
        updatedAnswers[currentQuestion] = question;

        setSelectedAnswers(updatedAnswers);
      }
    }
>>>>>>> 8b13b57 (commit)
    await axios.post(
      `/api/user/${currentUserId}/isInExam`,
      JSON.stringify({
        id: reportId,
        isInExam: true,
        note: "",
        moduleId: chapter.id,
        courseId,
        date: new Date(),
        examRecord: {
          startDate: startDate,
          date: new Date(),
          timePassed: timeLimitRecord,
          questionList: questions,
          timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
          currentQuestion: currentQuestion,
          selectedAnswers: updatedAnswers,
<<<<<<< HEAD
          currentAttempt: 1,
=======
          currentAttempt: currentAttempt,
>>>>>>> 8b13b57 (commit)
        },
      })
    );
  };
<<<<<<< HEAD

  // Nhảy câu hỏi kế
  const handleNextClick = async () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      // Cập nhật isInExam
=======
  useEffect(() => {}, [onFinish]);
  // Hàm xử lý khi người dùng chọn nút "Next"
  const handleNextClick = async () => {
    // Chuyển sang câu hỏi tiếp theo
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
>>>>>>> 8b13b57 (commit)
      await axios.post(
        `/api/user/${currentUserId}/isInExam`,
        JSON.stringify({
          id: reportId,
          isInExam: true,
          note: "",
          moduleId: chapter.id,
          courseId,
          date: new Date(),
          examRecord: {
            startDate: startDate,
            date: new Date(),
            timePassed: timeLimitRecord,
            questionList: questions,
            timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
            currentQuestion: nextQuestion,
            selectedAnswers: selectedAnswers,
<<<<<<< HEAD
            currentAttempt: 1,
=======
            currentAttempt: currentAttempt,
>>>>>>> 8b13b57 (commit)
          },
        })
      );
    } else {
<<<<<<< HEAD
      // Câu cuối => Submit exam
      // Kiểm tra unanswered
      const unanswered = questions.filter((q: any) => {
        if (q.type === "singleChoice" || q.type === "multiChoice") {
          return !q.chooseAnswer || q.chooseAnswer.length === 0;
        }
        return false;
      });
      if (unanswered.length > 0) {
        toast.error("Please answer all questions before submitting.");
        return;
      }

      // Gọi server submit
      // (vẫn ghi log examRecord)
      if (isCompleted !== "finished") {
=======
      // If the last question, check for unanswered questions
      const unansweredQuestions = questions.filter((question: any) => {
        return question.type !== "multiChoice" &&
          question.type !== "singleChoice"
          ? false
          : !question.chooseAnswer || question.chooseAnswer.length === 0;
      });

      // If there are unanswered questions, show a toast error
      if (unansweredQuestions.length > 0) {
        toast.error("Please answer all questions before submitting.");
        return; // Prevent submission
      }
      // Nếu đã là câu hỏi cuối cùng, kiểm tra điểm số và hiển thị kết quả

      const { finalScore, passed }: any = calculateScore();

      const totalScore = finalScore;
      if (isCompleted != "finished") {
>>>>>>> 8b13b57 (commit)
        await axios.post(
          `/api/user/${currentUserId}/examRecord/${chapter.id}`,
          JSON.stringify({
            moduleId: chapter.id,
            courseId,
            date: new Date(),
            examRecord: {
              questionList: questions,
<<<<<<< HEAD
=======

>>>>>>> 8b13b57 (commit)
              selectedAnswers: selectedAnswers,
            },
          })
        );
      }
<<<<<<< HEAD

      // Submit exam => chấm server
      await handleExamSubmit();
    }
  };

  // Quay lại câu trước
  const handlePreviousClick = () => {
=======
      // debugger
      // if (!finishedExam) {

      //   const date = new Date();

      //   if (currentAttempt >= maxAttempt) {
      //     await axios.put(
      //       `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
      //       {
      //         status:
      //           totalScore >= chapter.scoreLimit && passed
      //             ? "finished"
      //             : "failed",
      //         score: parseInt(finalScore),
      //         progress:
      //           totalScore >= chapter.scoreLimit && passed ? "100%" : "0%",
      //         endDate: date,
      //         retakeTime: currentAttempt,
      //       }
      //     );
      //   } else {
      //     await axios.put(
      //       `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
      //       {
      //         status:
      //           totalScore >= chapter.scoreLimit && passed
      //             ? "finished"
      //             : "failed",
      //         score: parseInt(finalScore),
      //         progress:
      //           totalScore >= chapter.scoreLimit && passed ? "100%" : "0%",
      //         endDate: date,
      //         retakeTime: currentAttempt,
      //       }
      //     );
      //   }
      //   if (totalScore >= chapter.scoreLimit && passed) {
      //     if (nextChapterId != null) {
      //       let checkIfNextChapterIsFinished = await axios.get(
      //         `/api/courses/${courseId}/chapters/${nextChapterId}/progress`
      //       );
      //       if (checkIfNextChapterIsFinished.data.status == "finished") {
      //         if (
      //           checkIfNextChapterIsFinished.data.nextChapterId != undefined
      //         ) {
      //         } else {
      //           await axios.put(`/api/courses/${courseId}/progress`, {
      //             status: "finished",
      //             progress: "100%",
      //             endDate: date,
      //           });
      //         }
      //       } else {
      //         await axios.put(
      //           `/api/courses/${courseId}/chapters/${nextChapterId}/progress`,
      //           {
      //             status: "studying",
      //             progress: "0%",
      //             startDate: date,
      //           }
      //         );
      //         await axios.put(`/api/courses/${courseId}/progress`, {
      //           status: "studying",
      //           progress:
      //             (course.Module.map((item: { id: any }) => item.id).indexOf(
      //               nextChapterId
      //             ) /
      //               course.Module.length) *
      //               100 +
      //             "%",
      //           startDate: date,
      //         });
      //       }

      //       //router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      //     } else {
      //       await axios.put(`/api/courses/${courseId}/progress`, {
      //         status: "finished",
      //         progress: "100%",
      //         startDate: date,
      //       });
      //       // confetti.onOpen();
      //       let currentUser = await axios.get(`/api/user`);
      //       await axios.patch(`/api/user/${currentUser.data.id}/score`, {
      //         star: parseInt(currentUser.data.star) + parseInt(course.credit),
      //         starUpdateDate: new Date(),
      //       });
      //       // router.push(`/search`);
      //     }
      //   }
      //   await axios.post(
      //     `/api/user/${currentUserId}/isInExam`,
      //     JSON.stringify({
      //       id: reportId,
      //       isInExam: false,
      //       note: "Finished Exam.",
      //       moduleId: chapter.id,
      //       courseId,
      //       date: new Date(),
      //       examRecord: {
      //         startDate: startDate,
      //         date: new Date(),
      //         timePassed: timeLimitRecord,
      //         questionList: questions,
      //         timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
      //         currentQuestion: currentQuestion,
      //         selectedAnswers: selectedAnswers,
      //         currentAttempt: currentAttempt,
      //       },
      //     })
      //   );
      // }

      if (!finishedExam) {
        const date = new Date();

        // Cập nhật thông tin tiến độ cho chương hiện tại
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
          {
            status:
              totalScore >= chapter.scoreLimit && passed
                ? "finished"
                : "failed",
            score: parseInt(finalScore),
            progress:
              totalScore >= chapter.scoreLimit && passed ? "100%" : "0%",
            endDate: date,
            retakeTime: currentAttempt,
          }
        );

        // Cập nhật trạng thái khóa học dựa trên kết quả chương học cuối cùng
        if (totalScore >= chapter.scoreLimit && passed) {
          await axios.put(`/api/courses/${courseId}/progress`, {
            status: "finished",
            progress: "100%",
            endDate: date,
          });

          // Cập nhật điểm của người dùng sau khi hoàn thành khóa học
          let currentUser = await axios.get(`/api/user`);
          await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            star: parseInt(currentUser.data.star) + parseInt(course.credit),
            starUpdateDate: new Date(),
          });
        } else {
          await axios.put(`/api/courses/${courseId}/progress`, {
            status: "failed",
            progress: "0%",
            endDate: date,
          });
        }

        // Gửi thông báo cho hệ thống rằng bài thi đã hoàn thành
        await axios.post(
          `/api/user/${currentUserId}/isInExam`,
          JSON.stringify({
            id: reportId,
            isInExam: false,
            note: "Finished Exam.",
            moduleId: chapter.id,
            courseId,
            date: new Date(),
            examRecord: {
              startDate: startDate,
              date: new Date(),
              timePassed: timeLimitRecord,
              questionList: questions,
              timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
              currentQuestion: currentQuestion,
              selectedAnswers: selectedAnswers,
              currentAttempt: currentAttempt,
            },
          })
        );
      }

      setOnFinish(true);
      setQuestions([]);
      let currentUser = await axios.get(`/api/user`);
      // await axios.patch(
      //   `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`,
      //   examRecord
      // );
      if (totalScore >= chapter.scoreLimit) {
        if (nextChapterId != null) {
          setTimeout(function () {
            // function code goes here
          }, 10000);
          router.push(`/`);
          router.refresh();
        }
      }

      await axios.patch(`/api/user/${currentUser.data.id}/isInExam`, {
        id: reportId,
        values: {
          isInExam: false,
          moduleId: chapter.id,
          courseId,
        },
      });
    }

    router.refresh();
  };
  const setBookmark = (index: any) => {
    let newArr = [...questions];
    if ("bookmark" in newArr[index] && newArr[index]["bookmark"] == true) {
      newArr[index]["bookmark"] = false;
    } else {
      newArr[index]["bookmark"] = true;
    }

    setQuestions(newArr);
  };
  // Hàm xử lý khi người dùng chọn nút "Previous"
  const handlePreviousClick = () => {
    // Chuyển về câu hỏi trước đó
>>>>>>> 8b13b57 (commit)
    const previousQuestion = currentQuestion - 1;
    if (previousQuestion >= 0) {
      setCurrentQuestion(previousQuestion);
    }
  };

<<<<<<< HEAD
  // setBookmark
  const setBookmark = (index: any) => {
    let newArr = [...questions];
    if (newArr[index]?.bookmark) {
      newArr[index].bookmark = false;
    } else {
      newArr[index].bookmark = true;
    }
    setQuestions(newArr);
  };

  // onLeaving
=======
  // Hàm tính điểm số dựa trên câu trả lời đã chọn
  const calculateScore = () => {
    let finalScore = 0;
    let passed = true;
    let newCategoryList = [...categoryList];
    if (selectedAnswers.length < 1) {
      return { finalScore, passed };
    }

    let myScore: number = 0;
    let missingAnswer = false;
    for (let i = 0; i < selectedAnswers.length; i++) {
      if (!selectedAnswers[i]?.categoryId) {
        missingAnswer = true;
      }

      let categoryIndex = newCategoryList
        .map((item: { id: any }) => item.id)
        .indexOf(selectedAnswers[i].categoryId);
      newCategoryList[categoryIndex]["categoryScore"] = isNaN(
        parseInt(newCategoryList[categoryIndex]["categoryScore"])
      )
        ? 0
        : parseInt(newCategoryList[categoryIndex]["categoryScore"]);
      if (selectedAnswers[i].type == "singleChoice") {
        if (selectedAnswers[i].chooseAnswer[0].isCorrect == true) {
          selectedAnswers[i]["isRight"] = true;
          myScore = myScore + parseInt(selectedAnswers[i].score);
          newCategoryList[categoryIndex]["categoryScore"] = isNaN(
            parseInt(newCategoryList[categoryIndex]["categoryScore"])
          )
            ? 0
            : parseInt(newCategoryList[categoryIndex]["categoryScore"]) +
              parseInt(selectedAnswers[i].score);
        } else {
          selectedAnswers[i]["isRight"] = false;
          if (selectedAnswers[i].compulsory) {
            setIsPassed(false);
            passed = false;
          }
        }
      } else {
        let correctSelectedAnswer = 0;
        let numberOfCorrectAnswer = selectedAnswers[i].answer.filter(
          (item: any) => item.isCorrect == true
        ).length;
        for (let k = 0; k < selectedAnswers[i].answer.length; k++) {
          if (
            selectedAnswers[i].answer[k].isCorrect == true &&
            selectedAnswers[i]?.chooseAnswer.includes(
              selectedAnswers[i].answer[k]
            )
          ) {
            correctSelectedAnswer++;
          }
        }
        if (
          selectedAnswers[i]?.chooseAnswer.length == correctSelectedAnswer &&
          correctSelectedAnswer == numberOfCorrectAnswer
        ) {
          selectedAnswers[i]["isRight"] = true;
          myScore = myScore + parseInt(selectedAnswers[i].score);
          newCategoryList[categoryIndex]["categoryScore"] = isNaN(
            parseInt(newCategoryList[categoryIndex]["categoryScore"])
          )
            ? 0
            : parseInt(newCategoryList[categoryIndex]["categoryScore"]) +
              parseInt(selectedAnswers[i].score);
        } else {
          selectedAnswers[i]["isRight"] = false;
          if (selectedAnswers[i].compulsory) {
            setIsPassed(false);
            passed = false;
          }
        }
      }
    }

    if (missingAnswer) {
      // Toast message for missing answers
      toast.error(
        "You have skipped some answers. Please make sure all questions are answered."
      );
    }

    // setCategoryList([...newCategoryList]);
    let maxScore = 100;

    finalScore = Math.floor((myScore / maxScore) * 100);
    setFinalScore(finalScore);
    setExamMaxSocre(maxScore);
    return { finalScore, passed };
  };
>>>>>>> 8b13b57 (commit)
  const onLeaving = () => {
    setOnFinish(false);
    if (nextChapterId != null) {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    } else {
      router.push(`/`);
    }
    router.refresh();
  };
<<<<<<< HEAD

  // Format time
  const minutes = Math.floor(timeLimitRecord / 60);
  const seconds = timeLimitRecord % 60;
=======
  const checkEqual = (array1: any, array2: any) => {
    if (array1 == undefined) {
      return false;
    }
    for (let i = 0; i < array2.length; i++) {
      if (
        !array2[i]?.isCorrect &&
        array1?.map((item: { id: any }) => item.id).indexOf(array2[i].id) != -1
      ) {
        return false;
      }
      if (
        array2[i]?.isCorrect &&
        array1?.map((item: { id: any }) => item.id).indexOf(array2[i].id) == -1
      ) {
        return false;
      }
    }
    return true;
  };
  const minutes = Math.floor(timeLimitRecord / 60);
  const seconds = timeLimitRecord % 60;

>>>>>>> 8b13b57 (commit)
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

<<<<<<< HEAD
  let scheduledDate: any = new Date(dateRemain).toDateString();
  // console.log(scheduledDate);
  // Render
  return questions.length === 0 ? (
    <>
      {/* Giao diện chờ/bắt đầu exam */}
      <div className="max-w-6xl mx-auto p-6 mt-5">
        <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Exam</h2>
          <p className="text-lg mb-4">
            Before you begin, please take a moment to review the following
            information about the exam.
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">
              This exam consists of multiple-choice questions.
            </li>

            <li className="mb-2">
              You will have{" "}
              <span className="text-red-600">{chapter.timeLimit} minutes</span>{" "}
              to complete the exam.
            </li>
            <li className="mb-2">
              You need at least{" "}
              <span className="text-red-600">{chapter.scoreLimit}%</span> to
              pass the exam.
            </li>
            <li className="mb-2">
              Make sure you are in a quiet environment to avoid distractions.
            </li>
          </ul>

          <AlertDialog open={onFinish}>
            {/* ... AlertDialog hiển thị kết quả ... */}
=======
  return questions.length == 0 ? (
    <>
      <div className="max-w-6xl mx-auto p-6 mt-5">
        <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
          <h2 className="text-2xl font-bold mb-4">Chào Mừng Đến Với Bài Kiểm Tra</h2>
          <p className="text-lg mb-4">
            Vui Lòng Đọc Kỹ Các Quy Định Sau Trước Khi Bắt Đầu.
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">
              Bài Kiểm Tra Bao Gồm "Chọn Một Câu Đúng" Và "Chọn Nhiều Câu Đúng".
            </li>
            {isCompleted == "finished" ? (
              <></>
            ) : (
              <li className="mb-2">
                Bạn Có {" "}
                <span className="text-red-600">
                  {chapter.maxAttempt - currentAttempt < 0
                    ? 0
                    : chapter.maxAttempt - currentAttempt}{" "}
                  times
                </span>{" "}
                Để Làm Bài.
              </li>
            )}

            <li className="mb-2">
              Bạn Có{" "}
              <span className="text-red-600">{chapter.timeLimit} Phút</span>{" "}
              Để Hoàn Tất Bài Kiểm Tra.
            </li>
            <li className="mb-2">
              Bạn Cần Ít Nhất{" "}
              <span className="text-red-600">{chapter.scoreLimit}%</span> to
              Để Đậu.
            </li>
            <li className="mb-2">
              Hãy Chắc Chắn Rằng Bạn Đang Làm Bài Ở Môi Trường Yên Tĩnh.
            </li>
          </ul>
          
          <AlertDialog open={onFinish}>
>>>>>>> 8b13b57 (commit)
            <AlertDialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto p-6">
              <AlertDialogTitle className="text-center">
                <div
                  className={`${
<<<<<<< HEAD
                    finalScore >= chapter.scoreLimit && isPassed
=======
                    (finalScore >= chapter.scoreLimit && isPassed) ||
                    finishedExam
>>>>>>> 8b13b57 (commit)
                      ? "bg-green-500"
                      : "bg-red-500"
                  } text-white p-6 rounded-t-lg`}
                >
                  <h2 className="text-2xl font-semibold">
<<<<<<< HEAD
                    Your score is{" "}
=======
                    Bạn Đạt {" "}
>>>>>>> 8b13b57 (commit)
                    <span className="text-4xl font-bold">{finalScore}</span>
                  </h2>
                </div>

                <div className="p-6 text-center">
                  <p className="text-lg mb-4">
<<<<<<< HEAD
                    {finalScore >= chapter.scoreLimit && isPassed
                      ? nextChapterId !== null
                        ? "Congratulations on completing the exam!"
                        : "You have successfully completed the exam."
                      : "Sorry, you have failed. Better luck next time!"}
                  </p>

                  {finalScore >= chapter.scoreLimit && isPassed ? (
=======
                    {(finalScore >= chapter.scoreLimit && isPassed) ||
                    finishedExam
                      ? nextChapterId != null
                        ? "Chúc Mừng Bạn Đã Đậu!"
                        : "Bạn Đã Hoàn Thành Bài Kiểm Tra."
                      : "Xin Chia Buồn, Chúc Bạn May Mắn Lần Sau!"}
                  </p>

                  {(finalScore >= chapter.scoreLimit && isPassed) ||
                  finishedExam ? (
>>>>>>> 8b13b57 (commit)
                    <div className="flex justify-center mt-4">
                      <Image
                        src="/congratulationLPC.svg"
                        alt="Congratulations"
                        height={300}
                        width={500}
                        className="object-cover rounded-md border-4 border-white shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center mt-4">
                      <Image
                        src="/failurewh.png"
                        alt="Failure"
                        height={300}
                        width={500}
                        className="object-cover rounded-md border-4 border-white shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </AlertDialogTitle>

              <div className="flex justify-between p-6">
<<<<<<< HEAD
                {isCompleted && isFailed ? (
                  <span className="text-red-500 font-semibold">
                    You can retake on {scheduledDate}.
                  </span>
                ) : (
                  <></>
                )}
                {isCompleted && !isFailed ? (
                  <span className="text-red-500 font-semibold">
                    You cannot retake. {isFailed}
                  </span>
                ) : (
                  // <AlertDialogTrigger className="flex justify-center items-center">
                  //   <>👉Take an exam {isFailed + ""} </>
                  // </AlertDialogTrigger>
                  <></>
                )}
                {isCompleted && isFailed ? (
=======
                {(finalScore >= chapter.scoreLimit && isPassed) ||
                finishedExam ? (
                  <AlertDialogCancel
                    onClick={() => setOnFinish(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow-md"
                  >
                    Ở Lại
                  </AlertDialogCancel>
                ) : isCompleted == "failed" && currentAttempt >= maxAttempt ? (
                  <span className="text-red-500 font-semibold">
                    Xin Vui Lòng Đợi Cho Đến Khi Bài Kiểm Tra Được Mở Khóa.
                  </span>
                ) : (
                  <AlertDialogCancel
                    onClick={() => accept()}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md"
                  >
                    Thi Lại
                  </AlertDialogCancel>
                )}

                {isCompleted == "failed" ? (
>>>>>>> 8b13b57 (commit)
                  <AlertDialogCancel
                    onClick={() => setOnFinish(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md"
                  >
<<<<<<< HEAD
                    Close
                  </AlertDialogCancel>
                ) : null}

                <AlertDialogAction asChild>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md"
                    onClick={() => onLeaving()}
                  >
                    Leave
                  </button>
                </AlertDialogAction>
=======
                    Đóng
                  </AlertDialogCancel>
                ) : null}

                {(finalScore >= chapter.scoreLimit && isPassed) ||
                finishedExam ? (
                  <AlertDialogAction asChild>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md"
                      onClick={() => onLeaving()}
                    >
                      {nextChapterId != null ? "Tiếp Tục" : "Ở Lại"}
                    </button>
                  </AlertDialogAction>
                ) : null}
>>>>>>> 8b13b57 (commit)
              </div>
            </AlertDialogContent>
          </AlertDialog>

          <div className="mt-6">
<<<<<<< HEAD
            <p className="text-lg mb-4">Include:</p>
=======
            <p className="text-lg mb-4">Bao Gồm:</p>
>>>>>>> 8b13b57 (commit)
            <ul className="list-disc pl-5">
              {chapter.Category.map((item: any) => {
                return (
                  <li key={item.id} className="mb-2">
                    {item.title}:{" "}
                    {Math.floor(
                      (parseInt(item.numOfAppearance) /
                        parseInt(
                          chapter.Category.reduce(
                            (n: number, { numOfAppearance }: any) =>
                              n + numOfAppearance,
                            0
                          )
                        )) *
                        100
                    )}
                    %
                  </li>
                );
              })}
            </ul>
          </div>
<<<<<<< HEAD

          <AlertDialog>
            <div className="font-bold ml-2 rounded-lg">
              {isGeneratingExam ? (
                <div>Please wait while we generate your exam...</div>
              ) : !isCompleted || (isCompleted && !isFailed && !isSameCourseAndFailed) ? (
                <AlertDialogTrigger className="flex justify-center items-center">
                  <>👉Take an exam</>
                </AlertDialogTrigger>
              ) : isCompleted && isFailed ? null : null}
              {isCompleted && isFailed ? (
                <span className="text-red-500">
                  You can retake on {scheduledDate}.
                </span>
              ) : !isCompleted ? (
                // <AlertDialogTrigger className="flex justify-center items-center">
                //   <>👉Take an exam </>
                // </AlertDialogTrigger>
                <></>
              ) : (
                <span className="text-red-500 font-semibold">
                  {/* You cannot retake. */}
                </span>
=======
          <AlertDialog>
            <div className="font-bold ml-2 rounded-lg">
              {isGeneratingExam ? (
                <div className="">
                  Vui Lòng Đợi Trong Giây Lát...
                </div>
              ) : isCompleted == "failed" && currentAttempt >= maxAttempt ? (
                <></>
              ) : (
                <AlertDialogTrigger className="flex justify-center items-center">
                  <>👉Làm Bài </>
                </AlertDialogTrigger>
              )}
              {isCompleted == "failed" && currentAttempt >= maxAttempt ? (
                <span className="text-red-500">
                  Xin Vui Lòng Đợi Cho Đến Khi Bài Kiểm Tra Được Mở Khóa.
                </span>
              ) : (
                <></>
>>>>>>> 8b13b57 (commit)
              )}
            </div>
            <AlertDialogContent className="AlertDialogContent">
              <AlertDialogTitle className="AlertDialogTitle">
<<<<<<< HEAD
                Exam note
              </AlertDialogTitle>
              <AlertDialogDescription className="AlertDialogDescription">
                {!finishedExam && isCompleted ? (
                  <>Do you want to do the exam?</>
                ) : (
                  <>Do you want to retake this exam?</>
                )}
              </AlertDialogDescription>
              <div
                style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
              >
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button className="Button red" onClick={() => accept()}>
                    Yes
                  </button>
=======
                Lưu Ý
              </AlertDialogTitle>
              <AlertDialogDescription className="AlertDialogDescription">
                {!finishedExam && isCompleted == "studying" ? (
                  <>Bạn Muốn Làm Bài?</>
                ) : isCompleted == "failed" && currentAttempt >= maxAttempt ? (
                  <> Xin Vui Lòng Đợi Cho Đến Khi Bài Kiểm Tra Được Mở Khóa.</>
                ) : (
                  <>Bạn Muốn Làm Lại Bài Kiểm Tra?</>
                )}
              </AlertDialogDescription>
              <div
                style={{
                  display: "flex",
                  gap: 25,
                  justifyContent: "flex-end",
                }}
              >
                <AlertDialogCancel>Từ Chối</AlertDialogCancel>
                <AlertDialogAction asChild>
                  {isCompleted == "failed" && currentAttempt >= maxAttempt ? (
                    <></>
                  ) : (
                    <button className="Button red" onClick={() => accept()}>
                      Đồng ý
                    </button>
                  )}
>>>>>>> 8b13b57 (commit)
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
<<<<<<< HEAD
      {/* Score hiển thị */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
          <h2 className="text-2xl font-bold mb-6">Exam Score</h2>
          <div className="mb-6">
            <DoughnutChart score={finalScore} maxScore={examMaxScore} />
          </div>
          {isCompleted && isFailed ? (
            <div>
              <p className="text-lg mb-2">Your current score. Keep going!</p>
            </div>
          ) : !isCompleted ? (
            <div>
              <p className="text-lg mb-2">You have not take the test!</p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">You finished the exam.</p>
=======
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
          <h2 className="text-2xl font-bold mb-6">Điểm</h2>
          <div className="mb-6">
            <DoughnutChart score={finalScore} maxScore={examMaxScore} />
          </div>
          {finishedExam ? (
            <div>
              <p className="text-lg mb-2">
                Bạn Đã Hoàn Thành Bài Kiểm Tra, Việc Làm Lại Sẽ Không Tính.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">Bạn Đã Đạt Số Điểm. Hãy Cố Lên!</p>
>>>>>>> 8b13b57 (commit)
            </div>
          )}
        </div>
      </div>
<<<<<<< HEAD

      {/* <AlertDialog>
        {exemRecord.length > 0 ? (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
              <h2 className="text-2xl font-bold mb-6">Exam History</h2>
              <p className="text-lg mb-6">
                You have taken this test for: {exemRecord.length} times
              </p>
              <div className="space-y-6">
                {exemRecord[0]?.examRecord?.questionList?.map((item: any) => {
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-green-100">
                      <h3 className="text-base font-semibold text-green-700">
=======
      <AlertDialog>
        {exemRecord.length > 0 ? (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
              <h2 className="text-2xl font-bold mb-6">Lịch Sử Làm Bài</h2>
              <p className="text-lg mb-6">
                Bạn Đã Làm Kiểm Tra Lần Thứ: {exemRecord.length} 
              </p>
              <div className="space-y-6">
                {exemRecord[0]?.examRecord?.questionList?.map((item: any) => {
                  const isCorrect = checkEqual(item.chooseAnswer, item.answer);
                  return (
                    <div
                      className={`p-4 rounded-lg ${
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}
                      key={item.id}
                    >
                      <h3
                        className={`text-base font-semibold ${
                          isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
>>>>>>> 8b13b57 (commit)
                        {item.question}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
<<<<<<< HEAD
              <h2 className="text-2xl font-bold mb-6">Exam History</h2>
              <div className="mb-6">
                <p>No record found.</p>
=======
              <h2 className="text-2xl font-bold mb-6">Lịch Sử Kiểm Tra</h2>
              <div className="mb-6">
                <p>Không Tìm Thấy Lịch Sử.</p>
>>>>>>> 8b13b57 (commit)
              </div>
            </div>
          </div>
        )}
<<<<<<< HEAD
      </AlertDialog> */}
    </>
  ) : (
    // Giao diện thi
    <main className="min-h-full items-center">
      <div className="flex">
        <div className="w-3/4 p-8">
          <div className="p-6 shadow-md rounded-md border border-blue-500">
            <div className="flex flex-col">
              <div className="flex flex-row items-center my-2.5">
                <span>
                  {currentQuestion + 1} of {questions.length} questions
=======
      </AlertDialog>
    </>
  ) : (
    <main className="min-h-full items-center">
      {/* <br />
      <label className="block text-3xl font-bold mb-2 text-center">Exam</label> */}
      <div className="flex">
        <div className="w-3/4 p-8 ">
          <div className=" p-6 shadow-md rounded-md border border-blue-500">
            {/* <div className="flex justify-end mb-4">
            <Timer />
            {""} {time}
          </div> */}
            <div className="flex flex-col">
              <div className="flex flex-row items-center my-2.5">
                <span>
                  {currentQuestion + 1} / {questions.length} Câu
>>>>>>> 8b13b57 (commit)
                </span>
                <div className="flex ml-auto rounded-full bg-blue-500 p-2 text-white">
                  <Timer />
                  <span className="mr-2"></span>
                  {formattedTime}
                </div>
              </div>
<<<<<<< HEAD
              <hr className="my-3" />
              <p className="text-2xl font-bold mb-4 flex items-center select-none">
                {currentQuestion + 1}. {questions[currentQuestion]?.question}{" "}
                {questions[currentQuestion]?.type === "multiChoice"
=======

              <hr className="my-3" />
              <p className="text-2xl font-bold mb-4 flex items-center select-none">
                {currentQuestion +
                  1 +
                  ". " +
                  questions[currentQuestion].question}{" "}
                {questions[currentQuestion].type == "multiChoice"
>>>>>>> 8b13b57 (commit)
                  ? "(Multiple choices)"
                  : ""}
                <div className="ml-auto">
                  <BookmarkCheck
                    className={`${
<<<<<<< HEAD
                      questions[currentQuestion]?.bookmark
=======
                      questions[currentQuestion]?.bookmark == true
>>>>>>> 8b13b57 (commit)
                        ? "bg-yellow-400"
                        : ""
                    }`}
                    cursor={"pointer"}
                    onClick={() => setBookmark(currentQuestion)}
                  />
                </div>
              </p>
              <ul>
<<<<<<< HEAD
                {questions[currentQuestion]?.answer?.map(
=======
                {questions[currentQuestion].answer.map(
>>>>>>> 8b13b57 (commit)
                  (option: any, index: any) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleAnswerClick(questions[currentQuestion], option)
                      }
                      className={`cursor-pointer py-2 px-4 mb-2 border ${
<<<<<<< HEAD
                        selectedAnswers[currentQuestion] &&
                        selectedAnswers[currentQuestion]?.chooseAnswer?.some(
                          (ans: any) => ans.id === option.id
                        )
                          ? "border-blue-600 text-white bg-blue-600"
=======
                        selectedAnswers[currentQuestion] != undefined &&
                        selectedAnswers[currentQuestion]?.chooseAnswer
                          .map((item: { id: any }) => item.id)
                          .indexOf(option.id) != -1
                          ? "border-blue-600 text-white dark:text-white bg-blue-600"
>>>>>>> 8b13b57 (commit)
                          : "border-gray-300 text-black dark:text-white"
                      } rounded-md hover:border-blue-600 hover:bg-blue-600 hover:text-white select-none`}
                    >
                      {(index + 10).toString(36).toUpperCase() +
                        ". " +
                        option.text}
                    </li>
                  )
                )}
              </ul>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousClick}
                  className={`py-2 px-4 bg-gray-500 text-white rounded-md ${
<<<<<<< HEAD
                    currentQuestion === 0 ? "hidden" : ""
=======
                    currentQuestion === 0 ? "hidden" : "" // Ẩn nút "Previous" khi ở câu đầu tiên
>>>>>>> 8b13b57 (commit)
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextClick}
                  className={`py-2 px-4 bg-green-500 text-white rounded-md ml-auto${
<<<<<<< HEAD
                    currentQuestion === questions.length - 1 ? "hidden" : ""
                  }`}
                >
                  {currentQuestion + 1 < questions.length ? "Next" : "Submit"}
=======
                    currentQuestion === questions.length - 1 ? "hidden" : "" // Ẩn nút "Next" khi ở câu cuối cùng
                  }`}
                >
                  {currentQuestion + 1 < questions.length ? "Tiếp Theo" : "Nộp Bài"}
>>>>>>> 8b13b57 (commit)
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4 p-8">
<<<<<<< HEAD
          <div className="shadow-md rounded-md border border-blue-500">
=======
          <div className=" shadow-md rounded-md border border-blue-500">
>>>>>>> 8b13b57 (commit)
            <div className="p-4 flex flex-wrap">
              {questions.map((item: any, index: any) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 flex items-center justify-center text-white rounded-full transition-colors duration-150 focus:outline-none mb-4 mx-1
<<<<<<< HEAD
                    ${
                      item.bookmark
                        ? "bg-yellow-400"
                        : item?.chooseAnswer?.length > 0
                        ? "bg-green-600"
                        : ""
                    }
                    ${
                      currentQuestion === index ? "bg-blue-700" : "bg-gray-500"
=======
                  ${
                    item?.bookmark
                      ? "bg-yellow-400"
                      : item?.chooseAnswer?.length > 0 && "chooseAnswer" in item
                      ? "bg-green-600"
                      : ""
                  }
                    ${
                      currentQuestion == index ? "bg-blue-700" : "bg-gray-500"
>>>>>>> 8b13b57 (commit)
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
<<<<<<< HEAD
              <div className="w-6 h-6 rounded-full bg-gray-500 mr-2" />
              <strong>: Not answered</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-green-600 mr-2" />
              <strong>: Answered</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-yellow-400 mr-2" />
              <strong>: Bookmarks</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 mr-2" />
              <strong>: Selected</strong>
=======
              <div className="w-6 h-6 rounded-full bg-gray-500 mr-2"></div>
              <strong>: Chưa Trả Lời</strong>{" "}
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-green-600 mr-2"></div>
              <strong>: Đã Trả Lời</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-yellow-400 mr-2"></div>
              <strong>: Đánh Dấu</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 mr-2"></div>
              <strong>: Đã Chọn</strong>
>>>>>>> 8b13b57 (commit)
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 8b13b57 (commit)
export default Exam;
