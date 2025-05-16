"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../modals/user-course-modal"; 

export const CourseAttendeeCell = ({ row }: any) => {
  const { ClassSessionRecord, username } = row.original; 
  const [isModalOpen, setModalOpen] = useState(false);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    if (ClassSessionRecord && Array.isArray(ClassSessionRecord)) {
      const formattedCourses = ClassSessionRecord.map((session: {
        course: { title: string; imageUrl: string };
        progress: string;
        score: number;
        status: string;
      }) => ({
        courseName: session.course.title,
        courseImage: session.course.imageUrl,
        status: session.status,
        progress: session.progress,
        score: session.score,
      }));

      setAllCourses(formattedCourses);
    }
  }, [ClassSessionRecord]);

  return (
    <>
      <button
        className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        onClick={() => setModalOpen(true)}
      >
        View Courses
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`User's Courses for ${username}`}
        courses={allCourses}
      />
    </>
  );
};
