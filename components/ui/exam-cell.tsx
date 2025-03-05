import React, { useState } from "react";
import { Modal } from "../modals/modal-exam"; // Đảm bảo đường dẫn đúng

export const ExamsCell = ({ row }: any) => {
  const { modules } = row.original; // Giả sử `modules` là mảng các `ModuleInCourse` đã được truyền từ phía server
  const [isModalOpen, setModalOpen] = useState(false);

  // Lọc các mô-đun có type là "Exam" và kiểm tra `module` có tồn tại hay không
  const exams = modules
    .map((moduleInCourse: any) => moduleInCourse.module) // Lấy thông tin `module` từ `ModuleInCourse`
    .filter((module: any) => module && module.type === "Exam"); // Kiểm tra module có tồn tại và loại là "Exam"

  const examDetails = exams.map((exam: any) => {
    const passedUsers = exam.UserProgress.filter(
      (item: { status: string }) => item.status === "finished"
    ).map((item: { user: { username: string } }) => item.user.username);

    const studyingUsers = exam.UserProgress.filter(
      (item: { status: string }) => item.status !== "finished"
    ).map((item: { user: { username: string }; progress: string }) => ({
      username: item.user.username,
      progress: parseFloat(item.progress),
    }));

    return {
      title: exam.title,
      passedCount: passedUsers.length,
      totalUsers: exam.UserProgress.length,
      passedUsers,
      studyingUsers,
    };
  });

  const totalExams = exams.length;

  return (
    <>
      <button
        className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        onClick={() => setModalOpen(true)}
      >
        Details ({totalExams})
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        examDetails={examDetails}
      />
    </>
  );
};
