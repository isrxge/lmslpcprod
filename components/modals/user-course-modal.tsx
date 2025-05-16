"use client";

import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  courses: {
    courseName: string;
    status: string;
    progress: number;
    score: number;
  }[];
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  courses,
}) => {
  const [filter, setFilter] = useState("all"); // "all", "studying", "finished", "failed"

  // Ensure that courses data is not null or undefined
  const validCourses = courses ?? [];

  // Calculate the counts for each status
  const allCount = validCourses.length;
  const finishedCount = validCourses.filter(course => course.status === "finished").length;
  const studyingCount = validCourses.filter(course => course.status === "studying").length;
  const failedCount = validCourses.filter(course => course.status === "failed").length;

  // Filter courses based on the selected filter
  const filteredCourses = validCourses.filter((course) => {
    if (filter === "all") return true;
    return course.status === filter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-30"
        onClick={onClose}
      />

      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 md:mx-0 z-50 dark:bg-gray-900">
        <div className="p-4 border-b relative">
          <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("all")}
            >
              All ({allCount})
            </button>
            <button
              className={`px-4 py-2 rounded ${filter === "finished" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("finished")}
            >
              Finished ({finishedCount})
            </button>
            <button
              className={`px-4 py-2 rounded ${filter === "studying" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("studying")}
            >
              Studying ({studyingCount})
            </button>
            <button
              className={`px-4 py-2 rounded ${filter === "failed" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("failed")}
            >
              Failed ({failedCount})
            </button>
          </div>

          {/* Filtered Course List */}
          <ul className="space-y-2">
            {filteredCourses.length === 0 ? (
              <li className="italic text-gray-500 dark:text-gray-400">No courses found</li>
            ) : (
              filteredCourses.map((course, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="dark:text-white">
                    {index + 1}. {course.courseName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                          course.status === "finished"
                            ? "bg-green-100 text-green-800"
                            : course.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {course.status.toUpperCase()}
                    </span>
                    {course.score != null && (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        ({course.score}%)
                      </span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="p-4 border-t text-right">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
