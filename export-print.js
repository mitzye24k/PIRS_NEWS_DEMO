import { showToast } from "./ui.js";

export function exportToExcel(allStudents, currentLang) {
  if (allStudents.length === 0) {
    showToast(
      currentLang === "kh"
        ? "មិនទាន់មានទិន្នន័យសម្រាប់ Export ទេ!"
        : "No data to export!",
      "error",
    );
    return;
  }

  let csvContent =
    "\uFEFFNo,Name,Gender,Age,Class,Khmer,Math,English,GPA,Absences(1Wk),Phone,Address\n";
  allStudents.forEach((s, index) => {
    const km = Number(s.scoreKm || 0),
      math = Number(s.scoreMath || 0),
      eng = Number(s.scoreEng || 0);
    const gpa = ((km + math + eng) / 3).toFixed(2);
    csvContent += `${index + 1},"${s.name || ""}","${s.gender || ""}",${s.age || ""},"${s.classRoom || ""}",${km},${math},${eng},${gpa},${Number(s.absenceDays || 0)},"${s.phone || ""}","${s.address || ""}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Student_Comprehensive_Report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(
    currentLang === "kh"
      ? "បានទាញយកឯកសារ Excel (CSV) រួចរាល់!"
      : "Excel downloaded!",
  );
}

export function handlePrint() {
  window.print();
}
