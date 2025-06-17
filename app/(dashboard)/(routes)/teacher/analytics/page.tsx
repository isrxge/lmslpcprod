import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReportTabs } from "./_components/report-tabs";
import { db } from "@/lib/db";

// import Image from "next/image";
// import { getAnalytics } from "@/actions/get-analytics";

// import { DataCard } from "./_components/data-card";
// import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const checkUser = await db.userPermission.findMany({
    where: {
      userId: userId,
    },
    include: {
      permission: true,
    },
  });
  if (
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Create course report") == -1 &&
    // checkUser
    //   .map((item: { permission: { title: any } }) => item.permission.title)
    //   .indexOf("Create exam report") == -1
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Create report permission") == -1
  ) {
    return redirect("/");
  }

  // const {
  //   data,
  //   totalRevenue,
  //   totalSales,
  // } = await getAnalytics(userId);

  return <ReportTabs></ReportTabs>;
};

export default AnalyticsPage;
