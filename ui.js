export function updateDashboardStats(allStudents) {
  document.getElementById("totalStudents").textContent = allStudents.length;
  document.getElementById("totalMale").textContent = allStudents.filter(
    (s) => s.gender === "ប្រុស" || s.gender === "Male",
  ).length;
  document.getElementById("totalFemale").textContent = allStudents.filter(
    (s) => s.gender === "ស្រី" || s.gender === "Female",
  ).length;
  document.getElementById("totalAbsences").textContent = allStudents.reduce(
    (sum, s) => sum + Number(s.absenceDays || 0),
    0,
  );
  document.getElementById("totalClasses").textContent = new Set(
    allStudents.map((s) => s.classRoom),
  ).size;
}

export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `${type === "success" ? "bg-emerald-600" : "bg-rose-600"} text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold transition-all duration-300 transform translate-y-2 opacity-0 flex items-center gap-2`;
  toast.innerHTML = `<span>${type === "success" ? "✅" : "⚠️"}</span> ${message}`;
  document.getElementById("toastContainer").appendChild(toast);
  setTimeout(() => toast.classList.remove("translate-y-2", "opacity-0"), 100);
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
