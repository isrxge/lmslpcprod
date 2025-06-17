"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReportPageCourse from "./report/course/page";
import ReportPageProgram from "./report/program/page";
import UserReportPage from "./report/user/page";
import RankingReportPage from "./report/ranking/page";

export const ReportTabs = () => {
  return (
    <Tabs defaultValue="users" aria-label="Options">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="users">Người Dùng</TabsTrigger>
        <TabsTrigger value="courses">Khóa Học</TabsTrigger>
        <TabsTrigger value="ranking">Xếp Hạng</TabsTrigger>
        {/* <TabsTrigger value="programs">Chương Trình</TabsTrigger> */}
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
