"use client";

import { CoursesList } from "@/components/courses-list-category";
import { CategoryItem } from "./category-item";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

export const Categories = ({ items, userId }: any) => {
  const [currentTitle, setCurrentTitle] = useState("All");
  const [initialCourseList, setInitialCourseList] = useState(items);

  const fetchDepartment: any = async () => {
    const { data } = await axios.get(`/api/department`);
    return data;
  };
  const { data, error, refetch }: any = useQuery("department", fetchDepartment);
  const onClickItem = async (title: string) => {
    if (title == "All") {
      setCurrentTitle("All");
      setInitialCourseList(items);
    } else {
      setCurrentTitle(title);
      const { data } = await axios.get(`/api/department/${title}`);
      console.log(data)

      const filteredCourses = data.filter((course: any) => {
        return course.ClassSessionRecord.some((record: any) => record.status === "studying" && record.userId === userId);
      });
      setInitialCourseList(filteredCourses);
    }

    // router.push(`/search/${title}`);
  };
  return (
    <>
      {/* <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {data && (
          <CategoryItem
            key={"0"}
            label={"All"}
            value={"0"}
            hightlight={currentTitle == "All" ? true : false}
            onClickItem={() => onClickItem("All")}
          />
        )}
        {data &&
          data.map((item: any) => (
            <CategoryItem
              key={item.id}
              label={item.title}
              value={item.id}
              hightlight={currentTitle == item.title ? true : false}
              onClickItem={() => onClickItem(item.title)}
            />
          ))}
      </div> */}
      <CoursesList title={currentTitle} items={initialCourseList} />
    </>
  );
};
