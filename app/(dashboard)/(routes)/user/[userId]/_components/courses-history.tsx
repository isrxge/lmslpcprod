"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const CourseHistory = ({ userId, coursesJoined }: any) => {
  const [courses, setCourses] = useState(coursesJoined);
  useEffect(() => {}, []);

  return courses.length == 0 ? (
    <div className="text-black dark:text-white">
      {/* No courses have been assigned to you. */}
    </div>
  ) : (
    <>
      {courses.map((course: any, index: any) => {
        <div className="text-black dark:text-white">{course.title}</div>;
      })}
    </>
  );
};

export default CourseHistory;
