"use client";

import { useQuery } from "react-query";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import axios from "axios";
import { auth, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

const ReportPageCourse = () => {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const [hasAdvanceReportPermission, setHasAdvanceReportPermission] =
    useState(false);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  if (!userId) {
    return redirect("/");
  }

  const fetchUserPermission = async () => {
    try {
      const { data } = await axios.get(`/api/user/${userId}/personalInfo`);
      const advanceReportPermission = data.userPermission.some(
        (permission: { permission: { title: string } }) =>
          permission.permission.title === "Advance report permission"
      );
      setHasAdvanceReportPermission(advanceReportPermission);

      return data;
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  };
  const {
    data: data1,
    error: error1,
    isLoading: isLoading1,
  } = useQuery("userinfo", fetchUserPermission, {
    refetchOnWindowFocus: false,
  });

  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(`/api/courses`);

      if (hasAdvanceReportPermission) {
        // If the user has "Advance report permission", return all courses
        return data;
      } else {
        // If the user does not have "Advance report permission", filter courses by departmentId
        const filteredCourses: any = [];
        for (let i = 0; i < data.length; i++) {
         
          let indexOf = data[i].CourseOnDepartment.find(
            (item: any) => item.departmentId == data1.departmentId
          );

          if (indexOf != null) {
            filteredCourses.push(data[i]);
          }
        }
        
        console.log("Filtered courses by department:", filteredCourses);
        return filteredCourses;
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error; // Propagate error for react-query to handle
    }
  };

  const { data, error, isLoading } = useQuery(["allCourse", data1], fetchAllCourses, {
    refetchOnWindowFocus: false,
  });
  // const fetchAllCourses = async () => {
  //   try {
  //     const { data } = await axios.get(`/api/courses`);
  //     console.log("Fetched all courses:", data);

  //     if (hasAdvanceReportPermission) {
  //       // If the user has "Advance report permission", return all courses
  //       return data;
  //     } else {
  //       // If the user doesn't have the permission, filter courses by departmentId
  //       const filteredCourses = data.filter((course: any) => {
  //         console.log("Course's CourseOnDepartment:", course.CourseOnDepartment.some((courseDepartment: any) =>
  //           courseDepartment.departmentId === departmentId // Compare with the departmentId of the logged-in user
  //         )); // Log CourseOnDepartment array

  //         // Check if the departmentId matches any in the CourseOnDepartment array
  //         return course.CourseOnDepartment.some((courseDepartment: any) =>
  //           courseDepartment.departmentId === departmentId // Compare with the departmentId of the logged-in user
  //         );
  //       });
  //       console.log("Filtered courses by department:", filteredCourses);
  //       return filteredCourses;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching courses:", error);
  //     throw error; // Propagate error for react-query to handle
  //   }
  // };

  // const fetchAllCourses = async () => {
  //   try {
  //     const { data } = await axios.get(`/api/courses`);
  //     console.log("Fetched all courses:", data);

  //     if (hasAdvanceReportPermission) {
  //       // If the user has "Advance report permission", return all courses
  //       return data;
  //     } else {
  //       // If the user doesn't have the permission, filter courses by departmentId
  //       const filteredCourses = data.filter((course: any) => {
  //         console.log("Course's CourseOnDepartment:", course.CourseOnDepartment); // Log CourseOnDepartment array

  //         // Use filter to find the departmentId in the CourseOnDepartment array
  //         const matchingDepartments = course.CourseOnDepartment.filter((courseDepartment: any) =>
  //           courseDepartment.departmentId === departmentId // Compare with the departmentId of the logged-in user
  //         );

  //         // Log the matching departments for debugging
  //         console.log("Matching departments:", matchingDepartments);

  //         // Return the course only if matching departments exist
  //         return matchingDepartments.length > 0;
  //       });
  //       console.log("Filtered courses by department:", filteredCourses);
  //       return filteredCourses;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching courses:", error);
  //     throw error; // Propagate error for react-query to handle
  //   }
  // };

  if (isLoading1) {
    return <></>;
  } else {
    if (isLoading) {
      return <></>;
    } else {
      return (
        <div className="p-6">
          <DataTable columns={columns} data={data} />
        </div>
      );
    }
  }
};

export default ReportPageCourse;
