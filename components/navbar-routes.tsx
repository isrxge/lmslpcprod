"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { IsTeacher } from "@/lib/teacher";
import { IsPolicies } from "@/lib/policies";
import { IsReport } from "@/lib/report";
import { SearchInput } from "./search-input";
import { MyCourse } from "./my-course";
// import { Notification } from "./notification";
import { ModeToggle } from "./ui/theme-button";
import axios from "axios";

export const NavbarRoutes = ({ userId }: any) => {
  const pathname = usePathname();

  const fetchUserCourses = async () => {
    const { data } = await axios.get(`/api/user/${userId}/progress`);

    return data;
  };
  const { data, error } = useQuery("userCourses", fetchUserCourses);

  const isHomePage =
  pathname === "/" ||
  pathname === "/ranking" ||
  pathname.startsWith("/user/");
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    data && (
      <>
        <div>
          {isSearchPage && (
            <div className="hidden md:block">
              <SearchInput />
            </div>
          )}
        </div>
        <div className="flex gap-x-2 ml-auto justify-center">
          <div className="flex items-center">
            {/* <Button size="sm" variant="ghost" asChild>
              <MyCourse data={data} />
            </Button> */}
            {/* <div className="flex items-center ml-5 mr-3">
              <Notification />
            </div> */}
            {/* <div className="flex items-center ml-5 mr-3">
              <ModeToggle />
            </div> */}
          </div>
          {isHomePage && <IsPolicies />}
          {isHomePage && <IsReport />}
          {isTeacherPage || isCoursePage ? (
            <Link href="/">
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Thoát
              </Button>
            </Link>
          ) : (
            <IsTeacher userId={userId}></IsTeacher>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </>
    )
  );
};
