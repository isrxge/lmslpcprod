"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  passedUsers: string[];
  studyingUsers: { username: string; progress: number }[];
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  passedUsers,
  studyingUsers,
}) => {
  if (!isOpen) return null;

  // Gộp cả hai nhóm vào cùng một danh sách

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

        <div className="p-4 max-h-80 overflow-y-auto">
          {/* <h3 className="text-lg font-medium dark:text-white mb-2">Attendees</h3> */}
          <ul className="space-y-2">
            {passedUsers.length === 0 ? (
              <li className="italic text-gray-500 dark:text-gray-400">
                Nobody
              </li>
            ) : (
              passedUsers.map((user: any, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="dark:text-white">
                    {index + 1}. {user.username}
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* <span className={
                      `px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'finished'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                      `
                    }>
                      {user.status.toUpperCase()}
                    </span> */}
                    <span
                      className={`
    px-2 py-0.5 rounded-full text-xs font-medium
    ${
      user.status === "finished"
        ? "bg-green-100 text-green-800"
        : user.status === "failed"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"
    }
  `}
                    >
                      {user.status.toUpperCase()}
                    </span>
                    {user.score != null && (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        ({user.score}%)
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
