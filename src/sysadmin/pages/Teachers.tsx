import { useEffect, useState } from "react";
import { TeachersService } from "../api/adminApi";
import { FiPlus, FiTrash2, FiPower } from "react-icons/fi";

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", qualification: "", designation: "" });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await TeachersService.getAll();
      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await TeachersService.create(form);
      setForm({ name: "", email: "", phone: "", qualification: "", designation: "" });
      fetchTeachers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        await TeachersService.delete(id);
        fetchTeachers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      if (currentStatus === "Active") {
        await TeachersService.deactivate(id);
      } else {
        await TeachersService.activate(id);
      }
      fetchTeachers();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Teachers Management</h1>
      </div>

      <div className="sysadmin-card" style={{ marginBottom: "2rem" }}>
        <h3>Add New Teacher (Manual Override)</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Qualification" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Designation" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <button type="submit" className="sysadmin-btn-primary"><FiPlus /> Add Teacher</button>
        </form>
      </div>

      <div className="sysadmin-card">
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "1rem" }}>Name</th>
              <th style={{ padding: "1rem" }}>Email</th>
              <th style={{ padding: "1rem" }}>Phone</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem", fontWeight: 500 }}>{t.name}</td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{t.email}</td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{t.phone || "N/A"}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    background: t.status === "Active" ? "#dcfce7" : "#fee2e2", 
                    color: t.status === "Active" ? "#16a34a" : "#dc2626", 
                    padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600 }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => toggleStatus(t.id, t.status)} title={t.status === "Active" ? "Deactivate" : "Activate"} style={{ color: t.status === "Active" ? "#ca8a04" : "#16a34a", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                    <FiPower size={18} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No teachers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
