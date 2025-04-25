"use client";

import React, { useState } from "react";
import { Modal } from "../modals/modal-course"; // Adjust the import path to where your Modal component is located
import { user } from "@nextui-org/react";

export const AttendeesCell = ({ row }: any) => {
  const { ClassSessionRecord } = row.original;
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("ClassSessionRecord", ClassSessionRecord);
  const passedUsers =  ClassSessionRecord.map((item: {
    score: any;
    status: any; user: { username: string }; progress: string 
}) => ({
    username: item.user.username,
    progress: parseFloat(item.progress),
    status: item.status,
    score: item.score,
  }));

  const studyingUsers = ClassSessionRecord.filter(
    (item: { status: string }) => item.status !== "finished"
  ).map((item: {
    score: any;
    status: any; user: { username: string }; progress: string 
}) => ({
    username: item.user.username,
    progress: parseFloat(item.progress),
    status: item.status,
    score: item.score,
  }));

  const totalUsers = ClassSessionRecord.length;
  const passedCount = passedUsers.length;
  
  return (
    <>
      <button
        className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        onClick={() => setModalOpen(true)}
      >
        {/* Pass ({passedCount}/{totalUsers}) */}
        Details
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Details"
        passedUsers={passedUsers}
        studyingUsers={studyingUsers}
       
      />
    </>
  );
};
