

"use client";

import React, { useState } from "react";
import { Modal } from "../modals/modal-course"; // Adjust the import path to where your Modal component is located

export const AttendeesCell = ({ row }: any) => {
  const { ClassSessionRecord } = row.original;
  const [isModalOpen, setModalOpen] = useState(false);

  // Extract user data from the ClassSessionRecord
  const allUsers = ClassSessionRecord.map((item: {
    score: any;
    status: any;
    user: { username: string };
    progress: string;
  }) => ({
    username: item.user.username,
    progress: parseFloat(item.progress),
    status: item.status,
    score: item.score,
  }));

  return (
    <>
      <button
        className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        onClick={() => setModalOpen(true)}
      >
        Chi Tiết
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Details"
        allUsers={allUsers}
      />
    </>
  );
};
