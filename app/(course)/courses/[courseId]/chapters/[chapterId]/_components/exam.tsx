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
var CryptoJS = require("crypto-js");
const Exam = ({
  chapter,
  nextChapterId,
  courseId,
  course,
  isCompleted,
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
  const [onFinish, setOnFinish] = useState(false);
  const [exemRecord, setExamRecord]: any = useState([]);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [reportId, setReportId] = useState("");
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
      let chekIfUserIsInExam: any = await axios.get(
        `/api/user/${currentUser.data.id}/isInExam`
      );

      if (
        chekIfUserIsInExam?.data?.isInExam === true &&
        chapter.id == chekIfUserIsInExam?.data?.moduleId
      ) {
        setReportId(chekIfUserIsInExam.data.id);
        const examObj: any = chekIfUserIsInExam.data
          .examRecord as Prisma.JsonObject;

        setQuestions(examObj.questionList || []);
        setCurrentQuestion(examObj.currentQuestion || 0);

        if (!examObj.isEmergency) {
          setStartDate(examObj?.startDate);
          setTimeLimit(examObj.timePassed * 60);
          setTimeLimitRecord(examObj.timePassed);
        } else {
          setStartDate(examObj?.startDate);
          setTimeLimit(chapter.timeLimit);
          setTimeLimitRecord(chapter.timeLimit * 60);
        }

        setSelectedAnswers(examObj.selectedAnswers || []);
        // setCurrentAttempt(examObj.currentAttempt || 1);
      }
    };
    getHistory();
  }, [chapter.id, courseId]);

  useEffect(() => {
    if (questions.length > 0) {
      window.addEventListener("beforeunload", alertUser);
    }
    const interval = setInterval(() => {
      setTimeLimitRecord((prev: number) => {
        if (questions.length > 0) {
          if (prev === 0) {
            clearInterval(interval);
            setOnFinish(true);
            setQuestions([]);
            onTimeOut();
            return prev;
          }
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimitRecord, questions]);

  useEffect(() => {
    if (questions.length > 0) {
      window.addEventListener("beforeunload", alertUser);
      return () => {
        window.removeEventListener("beforeunload", alertUser);
      };
    }
  }, [questions, reportId, selectedAnswers, timeLimitRecord, currentQuestion]);

  // Gửi data khi user đóng tab
  const alertUser = async (e: any) => {
    if (questions.length > 0) {
      navigator.sendBeacon(
        `/api/user/${currentUserId}/isInExam`,
        JSON.stringify({
          id: reportId,
          isInExam: true,
          note: "Tự Ý Đóng Trang Kiểm Tra.",
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
          // currentAttempt: currentAttempt,
        },
      })
    );

    // 4) Cập nhật state hiển thị
    setOnFinish(true);
    setQuestions([]);
    setFinalScore(finalScore);
    setIsPassed(passed);

    // Cuối cùng, patch user isInExam => false

    await axios.patch(`/api/user/${currentUser.data.id}/isInExam`, {
      id: reportId,
      values: {
        isInExam: false,
        moduleId: chapter.id,
        courseId,
      },
    });

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
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setIsPassed(true);
    setStartDate(new Date());
    setIsGeneratingExam(true);

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
    setIsGeneratingExam(false);
    setTimeLimit(chapter.timeLimit);
    setTimeLimitRecord(chapter.timeLimit * 60);
  };

  // Khi user chọn đáp án
  const handleAnswerClick = async (question: any, option: any) => {
    const updatedAnswers: any = [...selectedAnswers];

    if (
      "chooseAnswer" in question &&
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
        if (!("chooseAnswer" in question)) {
          question["chooseAnswer"] = [];
        }
        question["chooseAnswer"] = [...question["chooseAnswer"], option];
      }
      updatedAnswers[currentQuestion] = question;
    }
    setSelectedAnswers(updatedAnswers);

    // Cập nhật isInExam
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
          currentAttempt: 1,
        },
      })
    );
  };

  // Nhảy câu hỏi kế
  const handleNextClick = async () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      // Cập nhật isInExam
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
            currentAttempt: 1,
          },
        })
      );
    } else {
      // Câu cuối => Submit exam
      // Kiểm tra unanswered
      const unanswered = questions.filter((q: any) => {
        if (q.type === "singleChoice" || q.type === "multiChoice") {
          return !q.chooseAnswer || q.chooseAnswer.length === 0;
        }
        return false;
      });
      if (unanswered.length > 0) {
        toast.error("Vui Lòng Chọn Hết Câu Trả Lời Trước Khi Nộp Bài.");
        return;
      }

      // Gọi server submit
      // (vẫn ghi log examRecord)
      if (isCompleted !== "finished") {
        await axios.post(
          `/api/user/${currentUserId}/examRecord/${chapter.id}`,
          JSON.stringify({
            moduleId: chapter.id,
            courseId,
            date: new Date(),
            examRecord: {
              questionList: questions,
              selectedAnswers: selectedAnswers,
            },
          })
        );
      }

      // Submit exam => chấm server
      await handleExamSubmit();
    }
  };

  // Quay lại câu trước
  const handlePreviousClick = () => {
    const previousQuestion = currentQuestion - 1;
    if (previousQuestion >= 0) {
      setCurrentQuestion(previousQuestion);
    }
  };

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
  const onLeaving = () => {
    setOnFinish(false);
    if (nextChapterId != null) {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    } else {
      router.push(`/`);
    }
    router.refresh();
  };

  // Format time
  const minutes = Math.floor(timeLimitRecord / 60);
  const seconds = timeLimitRecord % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  let scheduledDate: any = new Date(dateRemain).toDateString();
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
             <></>
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
            <AlertDialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto p-6">
              <AlertDialogTitle className="text-center">
                <div
                  className={`${
                    finalScore >= chapter.scoreLimit && isPassed
                      ? "bg-green-500"
                      : "bg-red-500"
                  } text-white p-6 rounded-t-lg`}
                >
                  <h2 className="text-2xl font-semibold">
                    Bạn Đạt {" "}
                    <span className="text-4xl font-bold">{finalScore}</span>
                  </h2>
                </div>

                <div className="p-6 text-center">
                  <p className="text-lg mb-4">
                    {finalScore >= chapter.scoreLimit && isPassed
                      ? nextChapterId !== null
                        ? "Chúc Mừng Bạn Đã Đậu!"
                        : "Bạn Đã Hoàn Thành Bài Kiểm Tra."
                      : "Xin Chia Buồn, Chúc Bạn May Mắn Lần Sau!"}
                  </p>

                  {finalScore >= chapter.scoreLimit && isPassed ? (
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
                {isCompleted && isFailed ? (
                  <span className="text-red-500 font-semibold">
                    Bạn Có thể Làm Lại Vào {scheduledDate}.
                  </span>
                ) : (
                  <></>
                )}
                {isCompleted && !isFailed ? (
                  <span className="text-red-500 font-semibold">
                    Bạn Không Thể Làm Lại. {isFailed}
                  </span>
                ) : (
                  // <AlertDialogTrigger className="flex justify-center items-center">
                  //   <>👉Take an exam {isFailed + ""} </>
                  // </AlertDialogTrigger>
                  <></>
                )}
                {isCompleted && isFailed ? (
                  <AlertDialogCancel
                    onClick={() => setOnFinish(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md"
                  >
                    Đóng
                  </AlertDialogCancel>
                ) : null}

                <AlertDialogAction asChild>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md"
                    onClick={() => onLeaving()}
                  >
                    Rời
                  </button>
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          <div className="mt-6">
            <p className="text-lg mb-4">Bao Gồm:</p>
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

          <AlertDialog>
            <div className="font-bold ml-2 rounded-lg">
              {isGeneratingExam ? (
                <div>Vui Lòng Đợi Trong Giây Lát...</div>
              ) : !isCompleted || (isCompleted && !isFailed && !isSameCourseAndFailed) ? (
                <AlertDialogTrigger className="flex justify-center items-center">
                  <>👉Làm Bài</>
                </AlertDialogTrigger>
              ) : isCompleted && isFailed ? null : null}
              {isCompleted && isFailed ? (
                <span className="text-red-500">
                  Bạn Có thể Làm Lại Vào {scheduledDate}.
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
              )}
            </div>
            <AlertDialogContent className="AlertDialogContent">
              <AlertDialogTitle className="AlertDialogTitle">
                Ghi Chú
              </AlertDialogTitle>
              <AlertDialogDescription className="AlertDialogDescription">
                {!finishedExam && isCompleted ? (
                  <>Bạn Có Muốn Làm Bài?</>
                ) : (
                  <>Bạn Có Muốn Làm Lại Bài?</>
                )}
              </AlertDialogDescription>
              <div
                style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
              >
                <AlertDialogCancel>Từ Chối</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button className="Button red" onClick={() => accept()}>
                    Xác Nhận
                  </button>
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {/* Score hiển thị */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
          <h2 className="text-2xl font-bold mb-6">Điểm</h2>
          <div className="mb-6">
            <DoughnutChart score={finalScore} maxScore={examMaxScore} />
          </div>
          {isCompleted && isFailed ? (
            <div>
              <p className="text-lg mb-2">Chúc Bạn May Mắn Lần Sau !</p>
            </div>
          ) : !isCompleted ? (
            <div>
              <p className="text-lg mb-2">Bạn Chưa Làm Bài !</p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">Bạn Đã Hoàn Thành Bài Kiểm Tra !</p>
            </div>
          )}
        </div>
      </div>

      
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
                  {currentQuestion + 1} Trên {questions.length} Câu Hỏi
                </span>
                <div className="flex ml-auto rounded-full bg-blue-500 p-2 text-white">
                  <Timer />
                  <span className="mr-2"></span>
                  {formattedTime}
                </div>
              </div>
              <hr className="my-3" />
              <p className="text-2xl font-bold mb-4 flex items-center select-none">
                {currentQuestion + 1}. {questions[currentQuestion]?.question}{" "}
                {questions[currentQuestion]?.type === "multiChoice"
                  ? "(Multiple choices)"
                  : ""}
                <div className="ml-auto">
                  <BookmarkCheck
                    className={`${
                      questions[currentQuestion]?.bookmark
                        ? "bg-yellow-400"
                        : ""
                    }`}
                    cursor={"pointer"}
                    onClick={() => setBookmark(currentQuestion)}
                  />
                </div>
              </p>
              <ul>
                {questions[currentQuestion]?.answer?.map(
                  (option: any, index: any) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleAnswerClick(questions[currentQuestion], option)
                      }
                      className={`cursor-pointer py-2 px-4 mb-2 border ${
                        selectedAnswers[currentQuestion] &&
                        selectedAnswers[currentQuestion]?.chooseAnswer?.some(
                          (ans: any) => ans.id === option.id
                        )
                          ? "border-blue-600 text-white bg-blue-600"
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
                    currentQuestion === 0 ? "hidden" : ""
                  }`}
                >
                  Trước
                </button>
                <button
                  onClick={handleNextClick}
                  className={`py-2 px-4 bg-green-500 text-white rounded-md ml-auto${
                    currentQuestion === questions.length - 1 ? "hidden" : ""
                  }`}
                >
                  {currentQuestion + 1 < questions.length ? "Sau" : "Nộp Bài"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4 p-8">
          <div className="shadow-md rounded-md border border-blue-500">
            <div className="p-4 flex flex-wrap">
              {questions.map((item: any, index: any) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 flex items-center justify-center text-white rounded-full transition-colors duration-150 focus:outline-none mb-4 mx-1
                    ${
                      item.bookmark
                        ? "bg-yellow-400"
                        : item?.chooseAnswer?.length > 0
                        ? "bg-green-600"
                        : ""
                    }
                    ${
                      currentQuestion === index ? "bg-blue-700" : "bg-gray-500"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gray-500 mr-2" />
              <strong>: Chưa Trả Lời</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-green-600 mr-2" />
              <strong>: Đã Trả Lời</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-yellow-400 mr-2" />
              <strong>: Đánh Dấu</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 mr-2" />
              <strong>: Đã Chọn</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Exam;
