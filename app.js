import {
  fetchStudentsFromDB,
  uploadStudentPhoto,
  saveStudentToDB,
  deleteStudentFromDB,
} from "./database.js";
import { handleAdminLogin, handleGoogleLogin, handleLogout } from "./auth.js";
import { updateDashboardStats, showToast } from "./ui.js";
import { openStudentProfileModal } from "./modal.js";
import { exportToExcel, handlePrint } from "./export-print.js";
import { updatePageLanguage } from "./localization.js";
import { translations } from "./translations.js";

let currentLang = "kh",
  allStudents = [],
  filteredStudents = [],
  isAdmin = false,
  isEditing = false,
  currentPage = 1;
const rowsPerPage = 5;

// Elements
const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const adminLoginForm = document.getElementById("adminLoginForm");
const userLoginBtn = document.getElementById("userLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailSpan = document.getElementById("userEmail");
const roleBadge = document.getElementById("roleBadge");
const adminFormContainer = document.getElementById("adminFormContainer");
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const studentIdInp = document.getElementById("studentId");
const exportExcelBtn = document.getElementById("exportExcelBtn");
const printBtn = document.getElementById("printBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");
const profileModal = document.getElementById("profileModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const langToggleBtn = document.getElementById("langToggleBtn");
const dashLangBtn = document.getElementById("dashLangBtn");
const currentLangLabel = document.getElementById("currentLangLabel");

function switchLanguage() {
  currentLang = currentLang === "kh" ? "en" : "kh";
  currentLangLabel.textContent = currentLang === "kh" ? "KH / EN" : "EN / KH";
  updatePageLanguage(currentLang, isEditing);
  renderStudentsTable();
}

langToggleBtn.addEventListener("click", switchLanguage);
dashLangBtn.addEventListener("click", switchLanguage);

adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const u = document.getElementById("adminUser").value.trim();
  const p = document.getElementById("adminPass").value.trim();
  if (handleAdminLogin(u, p)) {
    sessionStorage.setItem("role", "admin");
    sessionStorage.setItem("identifier", "Admin System");
    showDashboard(true, "Admin System");
    showToast(
      currentLang === "kh"
        ? "ចូលជា Admin បានជោគជ័យ!"
        : "Admin login successful!",
    );
  } else {
    showToast(
      currentLang === "kh"
        ? "ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ!"
        : "Invalid username or password!",
      "error",
    );
  }
});

userLoginBtn.addEventListener("click", async () => {
  try {
    const email = await handleGoogleLogin();
    sessionStorage.setItem("role", "user");
    sessionStorage.setItem("identifier", email);
    showDashboard(false, email);
    showToast(
      currentLang === "kh"
        ? "ចូលគណនីជាមួយ Google បានជោគជ័យ!"
        : "Google login successful!",
    );
  } catch (error) {
    showToast(
      currentLang === "kh"
        ? "ការចូលគណនី Google មានបញ្ហា!"
        : "Google login error!",
      "error",
    );
  }
});

function showDashboard(adminStatus, identifier) {
  isAdmin = adminStatus;
  loginPage.classList.add("hidden");
  langToggleBtn.parentElement.classList.add("hidden");
  dashboardPage.classList.remove("hidden");
  userEmailSpan.textContent = identifier;

  if (isAdmin) {
    roleBadge.textContent = "ADMIN";
    roleBadge.className =
      "text-xs px-2.5 py-1 rounded-lg font-bold bg-rose-50 text-rose-600 border border-rose-100";
    adminFormContainer.classList.remove("hidden");
    document.getElementById("actionHeader").classList.remove("hidden");
  } else {
    roleBadge.textContent =
      currentLang === "kh" ? "USER (ទស្សនា)" : "USER (Viewer)";
    roleBadge.className =
      "text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-600 border border-emerald-100";
    adminFormContainer.classList.add("hidden");
    document.getElementById("actionHeader").classList.add("hidden");
  }
  loadData();
}

logoutBtn.addEventListener("click", async () => {
  await handleLogout();
  dashboardPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  langToggleBtn.parentElement.classList.remove("hidden");
  adminLoginForm.reset();
  showToast(
    currentLang === "kh" ? "បានចាកចេញពីប្រព័ន្ធ!" : "Logged out successfully!",
  );
});

window.addEventListener("DOMContentLoaded", () => {
  updatePageLanguage(currentLang, isEditing);
  const savedRole = sessionStorage.getItem("role");
  const savedIdentifier = sessionStorage.getItem("identifier");
  if (savedRole) {
    showDashboard(savedRole === "admin", savedIdentifier);
  }
});

async function loadData() {
  studentTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">${currentLang === "kh" ? "កំពុងទាញយកទិន្នន័យ..." : "Loading data..."}</td></tr>`;
  allStudents = await fetchStudentsFromDB();
  filteredStudents = [...allStudents];
  updateDashboardStats(allStudents);
  currentPage = 1;
  renderStudentsTable();
}

function renderStudentsTable() {
  studentTableBody.innerHTML = "";
  const t = translations[currentLang];

  if (filteredStudents.length === 0) {
    studentTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-400 font-medium">${currentLang === "kh" ? "មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ" : "No student records found"}</td></tr>`;
    pageInfo.textContent =
      currentLang === "kh" ? "ទំព័រ 0 នៃ 0" : "Page 0 of 0";
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    return;
  }

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * rowsPerPage;
  filteredStudents.slice(start, start + rowsPerPage).forEach((student) => {
    const km = Number(student.scoreKm || 0),
      math = Number(student.scoreMath || 0),
      eng = Number(student.scoreEng || 0);
    const gpa = ((km + math + eng) / 3).toFixed(2);
    const absences = Number(student.absenceDays || 0);
    let photo = student.photo || "https://via.placeholder.com/150";

    let actionTd = isAdmin
      ? `
            <td class="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-1 no-print">
                <button onclick="window.editStudent('${student.id}')" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs font-semibold transition">${t.editAction}</button>
                <button onclick="window.deleteStudent('${student.id}')" class="text-rose-600 hover:text-rose-900 bg-rose-50 px-2.5 py-1 rounded-lg text-xs font-semibold transition">${t.deleteAction}</button>
            </td>`
      : "";

    studentTableBody.innerHTML += `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="px-4 py-3 whitespace-nowrap"><img src="${photo}" class="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" alt="Photo"></td>
                <td class="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">${student.name}</td>
                <td class="px-4 py-3 whitespace-nowrap text-slate-600">${student.gender}</td>
                <td class="px-4 py-3 whitespace-nowrap text-slate-600"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">${student.classRoom}</span></td>
                <td class="px-4 py-3 whitespace-nowrap font-bold text-indigo-600">${gpa}</td>
                <td class="px-4 py-3 whitespace-nowrap font-bold text-rose-600">${absences} ${currentLang === "kh" ? "ដង" : "times"}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                    <button onclick="window.viewProfile('${student.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition">${t.viewProfileBtn}</button>
                </td>
                ${actionTd}
            </tr>`;
  });

  pageInfo.textContent =
    currentLang === "kh"
      ? `ទំព័រ ${currentPage} នៃ ${totalPages || 1}`
      : `Page ${currentPage} of ${totalPages || 1}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderStudentsTable();
  }
});
nextPageBtn.addEventListener("click", () => {
  if (currentPage < Math.ceil(filteredStudents.length / rowsPerPage)) {
    currentPage++;
    renderStudentsTable();
  }
});

searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(keyword) ||
      s.classRoom.toLowerCase().includes(keyword),
  );
  currentPage = 1;
  renderStudentsTable();
});

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isAdmin) return;

  const id = studentIdInp.value;
  const photoInput = document.getElementById("photoFile");
  let photoUrl = isEditing
    ? allStudents.find((s) => s.id === id)?.photo || ""
    : "";

  if (photoInput.files.length > 0) {
    try {
      photoUrl = await uploadStudentPhoto(photoInput.files[0]);
    } catch (error) {
      showToast(
        currentLang === "kh"
          ? "មានបញ្ហាក្នុងការផ្ទុករូបថត!"
          : "Photo upload error!",
        "error",
      );
      return;
    }
  }

  const studentData = {
    name: document.getElementById("name").value,
    gender: document.getElementById("gender").value,
    age: Number(document.getElementById("age").value),
    classRoom: document.getElementById("classRoom").value,
    dob: document.getElementById("dob").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    scoreKm: Number(document.getElementById("scoreKm").value),
    scoreMath: Number(document.getElementById("scoreMath").value),
    scoreEng: Number(document.getElementById("scoreEng").value),
    absenceDays: Number(document.getElementById("absenceDays").value),
    photo: photoUrl,
    updatedAt: new Date().toISOString(),
  };

  try {
    await saveStudentToDB(studentData, isEditing ? id : null);
    showToast(
      isEditing
        ? currentLang === "kh"
          ? "បានកែប្រែដោយជោគជ័យ!"
          : "Updated successfully!"
        : currentLang === "kh"
          ? "បានបន្ថែមដោយជោគជ័យ!"
          : "Added successfully!",
    );
    resetForm();
    loadData();
  } catch (error) {
    showToast(
      currentLang === "kh" ? "មានបញ្ហាក្នុងการរក្សាទុក!" : "Save error!",
      "error",
    );
  }
});

window.editStudent = function (id) {
  const student = allStudents.find((s) => s.id === id);
  if (!student) return;

  studentIdInp.value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("gender").value = student.gender;
  document.getElementById("age").value = student.age;
  document.getElementById("classRoom").value = student.classRoom;
  document.getElementById("dob").value = student.dob || "";
  document.getElementById("phone").value = student.phone || "";
  document.getElementById("address").value = student.address || "";
  document.getElementById("scoreKm").value = student.scoreKm || 0;
  document.getElementById("scoreMath").value = student.scoreMath || 0;
  document.getElementById("scoreEng").value = student.scoreEng || 0;
  document.getElementById("absenceDays").value = student.absenceDays || 0;

  const t = translations[currentLang];
  document.getElementById("t_formHeader").textContent =
    currentLang === "kh" ? "កែប្រែព័ត៌មានសិស្ស" : "Edit Student";
  submitBtn.textContent = t.updateBtn;
  cancelEditBtn.classList.remove("hidden");
  isEditing = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  studentForm.reset();
  studentIdInp.value = "";
  const t = translations[currentLang];
  document.getElementById("t_formHeader").textContent = t.formHeader;
  submitBtn.textContent = t.saveBtn;
  cancelEditBtn.classList.add("hidden");
  isEditing = false;
}

window.deleteStudent = async function (id) {
  if (!isAdmin) return;
  if (
    confirm(
      currentLang === "kh"
        ? "តើអ្នកពិតជាចង់លុបមែនទេ?"
        : "Are you sure to delete?",
    )
  ) {
    await deleteStudentFromDB(id);
    showToast(
      currentLang === "kh" ? "បានលុបដោយជោគជ័យ!" : "Deleted successfully!",
      "error",
    );
    loadData();
  }
};

window.viewProfile = function (id) {
  const student = allStudents.find((s) => s.id === id);
  if (student) openStudentProfileModal(student, currentLang);
};

closeModalBtn.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});
window.addEventListener("click", (e) => {
  if (e.target === profileModal) profileModal.classList.add("hidden");
});

exportExcelBtn.addEventListener("click", () =>
  exportToExcel(allStudents, currentLang),
);
printBtn.addEventListener("click", handlePrint);
