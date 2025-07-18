import * as XLSX from "xlsx-js-style";

function getMonday(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export const exportCourseToExcel = async (course: any, filterLabel: string) => {
  const workbook = XLSX.utils.book_new();

  const moduleList = Array.isArray(course.modules)
    ? course.modules.map((mod: any) =>
        `${mod.module?.title || "N/A"} (${mod.module?.type || "?"})`
      ).join("\n")
    : "No modules";

  const exam = Array.isArray(course.ClassSessionRecord)
    ? course.ClassSessionRecord
        .map((s: any) => `${s.user?.username || "Unknown"} : ${s.score ?? "N/A"}% ${s.status ?? ""}`)
        .join("\n")
    : "No records";

  const departments = Array.isArray(course.CourseOnDepartment)
    ? course.CourseOnDepartment.map(
        (d: any) => d.Department?.title || "Unknown"
      ).join("\n")
    : "No departments";

  const startDate = course.startDate
    ? new Date(course.startDate).toLocaleDateString("en-GB")
    : "";
  const endDate = course.endDate
    ? new Date(course.endDate).toLocaleDateString("en-GB")
    : "";

  const data = [
    {
      "Course Title": course.title || "",
      Department: departments,
      Point: course.credit || "",
      "Course Type": course.type || "",
      "Start Date": startDate,
      "End Date": endDate,
      Instructor: course.courseInstructor?.username || "",
      Modules: moduleList,
      "Exam Results": exam,
    },
  ];

  const ws = XLSX.utils.json_to_sheet(data);

  // Style & column width
  const range = XLSX.utils.decode_range(ws["!ref"]!);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellRef];
      if (!cell) continue;

      cell.s = {
        font: { name: "Arial", sz: 12, bold: R === 0 },
        alignment: { vertical: "top", wrapText: true },
      };
      if (R === 0) {
        cell.s.fill = {
          patternType: "solid",
          fgColor: { rgb: "EAEAEA" },
        };
      }
    }
  }

  ws["!cols"] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 50 },
    { wch: 50 },
  ];

  XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");
  const now = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filterLabel}_${course.title}_${now}.xlsx`, {
    cellStyles: true,
  });
};
