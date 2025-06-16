"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReportPageCourse from "./report/course/page";
import ReportPageProgram from "./report/program/page";
import UserReportPage from "./report/user/page";
import RankingReportPage from "./report/ranking/page";

export const ReportTabs = () => {
  return (
    <Tabs defaultValue="users" aria-label="Options">
<<<<<<< HEAD
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="ranking">Ranking</TabsTrigger>
        {/* <TabsTrigger value="programs">Programs</TabsTrigger> */}
=======
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="users">Người Dùng</TabsTrigger>
        <TabsTrigger value="courses">Khóa Học</TabsTrigger>
        <TabsTrigger value="ranking">Xếp Hạng</TabsTrigger>
        <TabsTrigger value="programs">Chương Trình</TabsTrigger>
>>>>>>> 8b13b57 (commit)
      </TabsList>
      <TabsContent value="users">
        <UserReportPage></UserReportPage>
      </TabsContent>
      <TabsContent value="courses">
        <ReportPageCourse />
      </TabsContent>
      <TabsContent value="ranking">
        <RankingReportPage></RankingReportPage>
      </TabsContent>
      <TabsContent value="programs">
        <ReportPageProgram></ReportPageProgram>
      </TabsContent>
    </Tabs>
  );
};
