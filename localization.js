import { translations } from "./translations.js";

export function updatePageLanguage(currentLang, isEditing) {
  const t = translations[currentLang];
  document.documentElement.lang = currentLang;

  document.getElementById("t_welcome").textContent = t.welcome;
  document.getElementById("t_subWelcome").textContent = t.subWelcome;
  document.getElementById("t_adminLoginTitle").textContent = t.adminLoginTitle;
  document.getElementById("t_username").textContent = t.username;
  document.getElementById("t_password").textContent = t.password;
  document.getElementById("t_adminLoginBtn").textContent = t.adminLoginBtn;
  document.getElementById("t_or").textContent = t.or;
  document.getElementById("t_googleLogin").textContent = t.googleLogin;
  document.getElementById("t_dashTitle").textContent = t.dashTitle;
  document.getElementById("logoutBtn").textContent = t.logout;

  document.getElementById("t_cardTotal").textContent = t.cardTotal;
  document.getElementById("t_cardMale").textContent = t.cardMale;
  document.getElementById("t_cardFemale").textContent = t.cardFemale;
  document.getElementById("t_cardAbsence").textContent = t.cardAbsence;
  document.getElementById("t_cardClass").textContent = t.cardClass;

  const submitBtn = document.getElementById("submitBtn");
  if (!isEditing) {
    document.getElementById("t_formHeader").textContent = t.formHeader;
    submitBtn.textContent = t.saveBtn;
  } else {
    submitBtn.textContent = t.updateBtn;
  }

  document.getElementById("t_lblFullName").textContent = t.lblFullName;
  document.getElementById("t_lblGender").textContent = t.lblGender;
  document.getElementById("t_optMale").textContent = t.optMale;
  document.getElementById("t_optFemale").textContent = t.optFemale;
  document.getElementById("t_lblAge").textContent = t.lblAge;
  document.getElementById("t_lblClass").textContent = t.lblClass;
  document.getElementById("t_lblDob").textContent = t.lblDob;
  document.getElementById("t_lblPhone").textContent = t.lblPhone;
  document.getElementById("t_lblPhoto").textContent = t.lblPhoto;
  document.getElementById("t_lblAddress").textContent = t.lblAddress;
  document.getElementById("t_lblScoreKm").textContent = t.lblScoreKm;
  document.getElementById("t_lblScoreMath").textContent = t.lblScoreMath;
  document.getElementById("t_lblScoreEng").textContent = t.lblScoreEng;
  document.getElementById("t_lblAbsenceInput").textContent = t.lblAbsenceInput;
  document.getElementById("cancelEditBtn").textContent = t.cancelBtn;

  document.getElementById("searchInput").placeholder = t.searchPlaceholder;
  document.getElementById("t_btnExcel").textContent = t.btnExcel;
  document.getElementById("t_btnPrint").textContent = t.btnPrint;
  document.getElementById("t_printTitle").textContent = t.printTitle;
  document.getElementById("t_printSub").textContent = t.printSub;

  document.getElementById("th_photo").textContent = t.th_photo;
  document.getElementById("th_name").textContent = t.th_name;
  document.getElementById("th_gender").textContent = t.th_gender;
  document.getElementById("th_class").textContent = t.th_class;
  document.getElementById("th_gpa").textContent = t.th_gpa;
  document.getElementById("th_absence").textContent = t.th_absence;
  document.getElementById("th_profile").textContent = t.th_profile;
  document.getElementById("actionHeader").textContent = t.th_action;

  document.getElementById("t_prev").textContent = t.prev;
  document.getElementById("t_next").textContent = t.next;

  document.getElementById("m_gender").textContent = t.m_gender;
  document.getElementById("m_age").textContent = t.m_age;
  document.getElementById("m_dob").textContent = t.m_dob;
  document.getElementById("m_phone").textContent = t.m_phone;
  document.getElementById("m_address").textContent = t.m_address;
  document.getElementById("m_absence").textContent = t.m_absence;
  document.getElementById("m_scoreTitle").textContent = t.m_scoreTitle;
  document.getElementById("m_km").textContent = t.m_km;
  document.getElementById("m_math").textContent = t.m_math;
  document.getElementById("m_eng").textContent = t.m_eng;
  document.getElementById("m_gpaText").textContent = t.m_gpaText;
}
