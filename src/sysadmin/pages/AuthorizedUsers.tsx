import { useEffect, useState } from "react";
import { AuthorizedUsersService } from "../api/adminApi";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function AuthorizedUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", role: "Student", semester: "", section: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await AuthorizedUsersService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthorizedUsersService.create(form);
      setForm({ name: "", email: "", role: "Student", semester: "", section: "" });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await AuthorizedUsersService.delete(id);
        fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Authorized Users</h1>
      </div>

      <div className="sysadmin-card" style={{ marginBottom: "2rem" }}>
        <h3>Add New Authorized User</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
          {form.role === "Student" && (
            <>
              <input required placeholder="Semester" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input required placeholder="Section" value={form.section} onChange={e => setForm({...form, section: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
            </>
          )}
          <button type="submit" className="sysadmin-btn-primary"><FiPlus /> Add User</button>
        </form>
      </div>

      <div className="sysadmin-card">
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "1rem" }}>Name</th>
              <th style={{ padding: "1rem" }}>Email</th>
              <th style={{ padding: "1rem" }}>Role</th>
              <th style={{ padding: "1rem" }}>Sem/Sec</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem", fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{u.email}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ background: u.role === "Teacher" ? "#dcfce7" : "#e0e7ff", color: u.role === "Teacher" ? "#16a34a" : "#4f46e5", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600 }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "#64748b" }}>
                  {u.role === "Student" ? `${u.semester} - ${u.section}` : "N/A"}
                </td>
                <td style={{ padding: "1rem" }}>{u.status}</td>
                <td style={{ padding: "1rem" }}>
                  <button onClick={() => handleDelete(u.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No authorized users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
