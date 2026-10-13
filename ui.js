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
  const iconSvg =
    type === "success"
      ? `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
      : `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;

  toast.className = `${type === "success" ? "bg-emerald-600" : "bg-rose-600"} text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold transition-all duration-300 transform translate-y-2 opacity-0 flex items-center gap-2`;
  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  document.getElementById("toastContainer").appendChild(toast);
  setTimeout(() => toast.classList.remove("translate-y-2", "opacity-0"), 100);
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
