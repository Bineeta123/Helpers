import { useEffect, useState } from "react";
import { StudentsService } from "../api/adminApi";
import { FiPlus, FiTrash2, FiPower } from "react-icons/fi";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", rollNumber: "", semester: "", section: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await StudentsService.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentsService.create(form);
      setForm({ name: "", email: "", rollNumber: "", semester: "", section: "" });
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await StudentsService.delete(id);
        fetchStudents();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      if (currentStatus === "Active") {
        await StudentsService.deactivate(id);
      } else {
        await StudentsService.activate(id);
      }
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Students Management</h1>
      </div>

      <div className="sysadmin-card" style={{ marginBottom: "2rem" }}>
        <h3>Add New Student (Manual Override)</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Roll Number" value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Semester" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Section" value={form.section} onChange={e => setForm({...form, section: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <button type="submit" className="sysadmin-btn-primary"><FiPlus /> Add Student</button>
        </form>
      </div>

      <div className="sysadmin-card">
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "1rem" }}>Name</th>
              <th style={{ padding: "1rem" }}>Email</th>
              <th style={{ padding: "1rem" }}>Roll No</th>
              <th style={{ padding: "1rem" }}>Sem/Sec</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem", fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{s.email}</td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{s.rollNumber || "N/A"}</td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{s.semester || "N/A"} / {s.section || "N/A"}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    background: s.status === "Active" ? "#dcfce7" : "#fee2e2", 
                    color: s.status === "Active" ? "#16a34a" : "#dc2626", 
                    padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600 }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => toggleStatus(s.id, s.status)} title={s.status === "Active" ? "Deactivate" : "Activate"} style={{ color: s.status === "Active" ? "#ca8a04" : "#16a34a", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                    <FiPower size={18} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
