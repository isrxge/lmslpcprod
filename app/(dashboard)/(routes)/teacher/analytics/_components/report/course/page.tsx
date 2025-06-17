"use client";
import { useQuery } from "react-query";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import axios from "axios";
import { auth, useAuth } from "@clerk/nextjs";

const ReportPageCourse = () => {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const fetchAllCourses = async () => {
    const { data } = await axios.get(`/api/courses`);

    return data;
  };
  

  const { data, error, isLoading } = useQuery("allCourse", fetchAllCourses, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <></>;
  } else {
    return (
      <div className="p-6">
        <DataTable columns={columns} data={data} />
      </div>
    );
  }
};

export default ReportPageCourse;
