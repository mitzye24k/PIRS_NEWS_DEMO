import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  child,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { database, storage } from "./firebase-config.js";

export async function fetchStudentsFromDB() {
  const snapshot = await get(child(ref(database), "students"));
  let students = [];
  if (snapshot.exists()) {
    const data = snapshot.val();
    Object.keys(data).forEach((key) =>
      students.push({ id: key, ...data[key] }),
    );
  }
  return students;
}

export async function uploadStudentPhoto(file) {
  const snapshot = await uploadBytes(
    storageRef(storage, "student_photos/" + Date.now() + "_" + file.name),
    file,
  );
  return await getDownloadURL(snapshot.ref);
}

export async function saveStudentToDB(studentData, id = null) {
  if (id) {
    await update(ref(database, "students/" + id), studentData);
  } else {
    studentData.createdAt = new Date().toISOString();
    await set(push(ref(database, "students")), studentData);
  }
}

export async function deleteStudentFromDB(id) {
  await remove(ref(database, "students/" + id));
}
