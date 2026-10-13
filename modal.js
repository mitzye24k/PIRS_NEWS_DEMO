export function openStudentProfileModal(student, currentLang) {
  document.getElementById("modalPhoto").src =
    student.photo || "https://via.placeholder.com/150";
  document.getElementById("modalName").textContent = student.name;
  document.getElementById("modalClass").textContent =
    (currentLang === "kh" ? "ថ្នាក់: " : "Class: ") + student.classRoom;
  document.getElementById("modalGender").textContent = student.gender;
  document.getElementById("modalAge").textContent =
    student.age + (currentLang === "kh" ? " ឆ្នាំ" : " yrs");
  document.getElementById("modalDob").textContent = student.dob || "-";
  document.getElementById("modalPhone").textContent = student.phone || "-";
  document.getElementById("modalAddress").textContent = student.address || "-";
  document.getElementById("modalAbsence").textContent =
    (student.absenceDays || 0) + (currentLang === "kh" ? " ដង" : " times");

  const km = Number(student.scoreKm || 0),
    math = Number(student.scoreMath || 0),
    eng = Number(student.scoreEng || 0);
  document.getElementById("modalScoreKm").textContent = km;
  document.getElementById("modalScoreMath").textContent = math;
  document.getElementById("modalScoreEng").textContent = eng;
  document.getElementById("modalGpa").textContent = (
    (km + math + eng) /
    3
  ).toFixed(2);

  document.getElementById("profileModal").classList.remove("hidden");
}
