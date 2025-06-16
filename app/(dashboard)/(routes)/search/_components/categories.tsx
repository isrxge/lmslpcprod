"use client";

import { CoursesList } from "@/components/courses-list-category";
import { CategoryItem } from "./category-item";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

export const Categories = ({ items, userId }: any) => {
<<<<<<< HEAD
  const [currentTitle, setCurrentTitle] = useState("All");
=======
  const [currentTitle, setCurrentTitle] = useState("Toàn Bộ");
>>>>>>> 8b13b57 (commit)
  const [initialCourseList, setInitialCourseList] = useState(items);

  const fetchDepartment: any = async () => {
    const { data } = await axios.get(`/api/department`);
    return data;
  };
  const { data, error, refetch }: any = useQuery("department", fetchDepartment);
  const onClickItem = async (title: string) => {
<<<<<<< HEAD
    if (title == "All") {
      setCurrentTitle("All");
=======
    if (title == "Toàn Bộ") {
      setCurrentTitle("Toàn Bộ");
>>>>>>> 8b13b57 (commit)
      setInitialCourseList(items);
    } else {
      setCurrentTitle(title);
      const { data } = await axios.get(`/api/department/${title}`);
<<<<<<< HEAD
      // console.log(data)

      const filteredCourses = data.filter((course: any) => {
        return course.ClassSessionRecord.some((record: any) => record.status === "studying" && record.userId === userId);
      });
      setInitialCourseList(filteredCourses);
=======

      setInitialCourseList(data);
>>>>>>> 8b13b57 (commit)
    }

    // router.push(`/search/${title}`);
  };
  return (
    <>
<<<<<<< HEAD
      {/* <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
=======
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
>>>>>>> 8b13b57 (commit)
        {data && (
          <CategoryItem
            key={"0"}
            label={"All"}
            value={"0"}
<<<<<<< HEAD
            hightlight={currentTitle == "All" ? true : false}
            onClickItem={() => onClickItem("All")}
=======
            hightlight={currentTitle == "Toàn Bộ" ? true : false}
            onClickItem={() => onClickItem("Toàn Bộ")}
>>>>>>> 8b13b57 (commit)
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
<<<<<<< HEAD
      </div> */}
=======
      </div>
>>>>>>> 8b13b57 (commit)
      <CoursesList title={currentTitle} items={initialCourseList} />
    </>
  );
};
