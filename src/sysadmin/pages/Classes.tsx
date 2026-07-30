import { useEffect, useState } from "react";
import { ClassesService, TeachersService, StudentsService } from "../api/adminApi";
import { FiPlus, FiTrash2, FiUserPlus, FiUserMinus, FiAlertTriangle, FiBookOpen, FiMapPin, FiUsers } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function Classes() {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [form, setForm] = useState({ className: "", semester: "", section: "", roomNumber: "" });
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [enrollStudentId, setEnrollStudentId] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [clsRes, teachRes, studRes] = await Promise.all([
        ClassesService.getAll(),
        TeachersService.getAll(),
        StudentsService.getAll()
      ]);
      setClasses(clsRes.data);
      setTeachers(teachRes.data);
      setStudents(studRes.data);
    } catch (error) {
      console.error("Error fetching class management data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await ClassesService.getAll();
      setClasses(response.data);
      if (selectedClass) {
        const updated = response.data.find((c: any) => c.id === selectedClass.id);
        if (updated) setSelectedClass(updated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ClassesService.create(form);
      setForm({ className: "", semester: "", section: "", roomNumber: "" });
      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this class? All assignments will be removed.")) {
      try {
        await ClassesService.delete(id);
        if (selectedClass?.id === id) setSelectedClass(null);
        fetchClasses();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !assignTeacherId) return;
    try {
      await ClassesService.assignTeacher(selectedClass.id, parseInt(assignTeacherId));
      setAssignTeacherId("");
      fetchClasses();
      // Refresh students and teachers list to sync
      const [teachRes, studRes] = await Promise.all([TeachersService.getAll(), StudentsService.getAll()]);
      setTeachers(teachRes.data);
      setStudents(studRes.data);
    } catch (error: any) {
      alert(error.response?.data || "Failed to assign teacher.");
    }
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    if (!selectedClass) return;
    if (confirm("Remove teacher from this class?")) {
      try {
        await ClassesService.removeTeacher(selectedClass.id, teacherId);
        fetchClasses();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !enrollStudentId) return;
    try {
      await ClassesService.enrollStudent(selectedClass.id, parseInt(enrollStudentId));
      setEnrollStudentId("");
      fetchClasses();
      // Refresh students and teachers list to sync
      const [teachRes, studRes] = await Promise.all([TeachersService.getAll(), StudentsService.getAll()]);
      setTeachers(teachRes.data);
      setStudents(studRes.data);
    } catch (error: any) {
      alert(error.response?.data || "Failed to enroll student.");
    }
  };

  const handleUnenrollStudent = async (studentId: number) => {
    if (confirm("Unenroll student from this class?")) {
      try {
        await ClassesService.unenrollStudent(studentId);
        fetchClasses();
        // Refresh students and teachers list to sync
        const [teachRes, studRes] = await Promise.all([TeachersService.getAll(), StudentsService.getAll()]);
        setTeachers(teachRes.data);
        setStudents(studRes.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div style={{ padding: "2rem", color: "#64748b" }}>Loading class data...</div>;

  // Filter lists for assigning/enrolling
  const assignedTeacherIds = selectedClass
    ? selectedClass.teacherClasses.map((tc: any) => tc.teacherId)
    : [];

  const availableTeachers = teachers.filter(
    (t: any) => t.status === "Active" && !assignedTeacherIds.includes(t.id)
  );

  const enrolledStudentIds = selectedClass
    ? selectedClass.students.map((s: any) => s.id)
    : [];

  const availableStudents = students.filter((s: any) => {
    if (s.status !== "Active" || enrolledStudentIds.includes(s.id)) {
      return false;
    }
    if (!selectedClass || !selectedClass.semester) return true;

    const classSem = selectedClass.semester.toLowerCase();
    const studSem = (s.semester || "").toLowerCase();

    const classNumMatch = classSem.match(/\d+/);
    const studNumMatch = studSem.match(/\d+/);
    const semMatches = classSem.includes(studSem) || studSem.includes(classSem) ||
                       (classNumMatch && studNumMatch && classNumMatch[0] === studNumMatch[0]);

    const classSec = (selectedClass.section || "").toLowerCase().trim();
    const studSec = (s.section || "").toLowerCase().trim();
    const secMatches = !classSec || !studSec || classSec === studSec;

    return semMatches && secMatches;
  });

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Classes & Enrollments</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", alignItems: "start" }}>

        {/* Classes List & Creation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          <div className="sysadmin-card">
            <h3>Create New Class</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
              <input required placeholder="Class Name (e.g. CS101)" value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", flex: 1, minWidth: "150px" }} />
              <input required placeholder="Semester (e.g. Semester 1)" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", flex: 1, minWidth: "150px" }} />
              <input placeholder="Section (e.g. A)" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", width: "100px" }} />
              <input placeholder="Room Number" value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", width: "120px" }} />
              <button type="submit" className="sysadmin-btn-primary"><FiPlus /> Create Class</button>
            </form>
          </div>

          <div className="sysadmin-card">
            <h3>Active Classes ({classes.length})</h3>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {classes.map(c => {
                const isSelected = selectedClass?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClass(c)}
                    style={{
                      display: "flex",
                      justifyContent: "between",
                      alignItems: "center",
                      padding: "1rem",
                      borderRadius: "10px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      background: isSelected ? "#eff6ff" : "white",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <strong style={{ fontSize: "1.1rem", color: "#1e293b" }}>{c.className}</strong>
                        <span style={{ fontSize: "0.85rem", background: "#e2e8f0", color: "#475569", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                          {c.semester} - {c.section || "Any"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "1rem", marginTop: "0.4rem", fontSize: "0.85rem", color: "#64748b" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><FiMapPin /> Room {c.roomNumber || "N/A"}</span>
                      </div>
                      <div style={{ display: "flex", gap: "1rem", marginTop: "0.4rem", fontSize: "0.85rem", color: "#64748b" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><FaChalkboardTeacher /> {c.teacherClasses?.length || 0} Teachers</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><FiUsers /> {c.students?.length || 0} Students</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(c.id);
                      }}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                );
              })}
              {classes.length === 0 && (
                <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No classes configured yet.</div>
              )}
            </div>
          </div>

        </div>

        {/* Selected Class details & assignments */}
        <div>
          {selectedClass ? (
            <div className="sysadmin-card" style={{ borderTop: "4px solid #2563eb" }}>
              <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                <span style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px", color: "#2563eb", fontWeight: 700 }}>Class details</span>
                <h2 style={{ margin: "0.25rem 0 0 0", color: "#1f2937" }}>{selectedClass.className}</h2>
                <p style={{ margin: "0.25rem 0 0 0", color: "#4b5563" }}>{selectedClass.semester} ({selectedClass.section || "All Sections"}) — Room {selectedClass.roomNumber || "N/A"}</p>
              </div>

              {/* Assign Teachers Section */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><FaChalkboardTeacher /> Assigned Teachers</h3>

                {/* Form to assign a new teacher */}
                <form onSubmit={handleAssignTeacher} style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
                  <select
                    required
                    value={assignTeacherId}
                    onChange={e => setAssignTeacherId(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="">Choose Teacher to Assign...</option>
                    {availableTeachers.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.qualification || "No qualification info"})</option>
                    ))}
                  </select>
                  <button type="submit" className="sysadmin-btn-primary" style={{ padding: "0.5rem 1rem" }} disabled={!assignTeacherId}>
                    <FiUserPlus /> Assign
                  </button>
                </form>

                {/* Assigned teachers list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {selectedClass.teacherClasses.map((tc: any) => (
                    <div key={tc.teacherId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, color: "#334155" }}>{tc.teacher.name}</span>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "0.5rem" }}>({tc.teacher.designation || "Faculty"})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeacher(tc.teacherId)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        <FiUserMinus size={16} />
                      </button>
                    </div>
                  ))}
                  {selectedClass.teacherClasses.length === 0 && (
                    <div style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic" }}>No teachers assigned to teach this class.</div>
                  )}
                </div>
              </div>

              {/* Enroll Students Section */}
              <div>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><FiUsers /> Enrolled Students</h3>

                {/* Form to enroll a new student */}
                <form onSubmit={handleEnrollStudent} style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
                  <select
                    required
                    value={enrollStudentId}
                    onChange={e => setEnrollStudentId(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="">Choose Student to Enroll...</option>
                    {availableStudents.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} (Sem: {s.semester || "N/A"} - Sec: {s.section || "N/A"})</option>
                    ))}
                  </select>
                  <button type="submit" className="sysadmin-btn-primary" style={{ padding: "0.5rem 1rem" }} disabled={!enrollStudentId}>
                    <FiUserPlus /> Enroll
                  </button>
                </form>

                {/* Enrolled students list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {selectedClass.students.map((s: any) => {
                    // Check whether student is correct for that subject/semester
                    const isSemesterMismatch = s.semester && selectedClass.semester &&
                      !selectedClass.semester.toLowerCase().includes(s.semester.toLowerCase()) &&
                      !s.semester.toLowerCase().includes(selectedClass.semester.toLowerCase());

                    return (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "0.75rem",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: isSemesterMismatch ? "1px solid #fca5a5" : "1px solid #e2e8f0"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 600, color: "#334155" }}>{s.name}</span>
                            <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "0.5rem" }}>({s.rollNumber || "No Roll No"})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnenrollStudent(s.id)}
                            style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                          >
                            <FiUserMinus size={16} />
                          </button>
                        </div>
                        {isSemesterMismatch && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#b91c1c", fontSize: "0.75rem", marginTop: "0.25rem", fontWeight: 500 }}>
                            <FiAlertTriangle /> Semester Mismatch (Student: {s.semester}, Class: {selectedClass.semester})
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {selectedClass.students.length === 0 && (
                    <div style={{ color: "#64748b", fontSize: "0.9rem", fontStyle: "italic" }}>No students enrolled in this class.</div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="sysadmin-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem", textAlign: "center", color: "#64748b" }}>
              <FiBookOpen size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
              <h3>No Class Selected</h3>
              <p>Select a class from the list to view and manage assigned teachers & enrolled students.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
