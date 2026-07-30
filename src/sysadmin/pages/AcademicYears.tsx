import { useEffect, useState } from "react";
import { AcademicYearsService } from "../api/adminApi";
import { FiPlus, FiTrash2, FiCheckCircle } from "react-icons/fi";

export default function AcademicYears() {
  const [years, setYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ year: "", isActive: false });

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await AcademicYearsService.getAll();
      setYears(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AcademicYearsService.create(form);
      setForm({ year: "", isActive: false });
      fetchYears();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await AcademicYearsService.delete(id);
        fetchYears();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setAsActive = async (id: number) => {
    try {
      await AcademicYearsService.setActive(id);
      fetchYears();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Academic Years</h1>
      </div>

      <div className="sysadmin-card" style={{ marginBottom: "2rem" }}>
        <h3>Add Academic Year</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
          <input required placeholder="Year (e.g. 2025-2026)" value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", flex: 1 }} />
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b" }}>
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
            Set as Active
          </label>
          <button type="submit" className="sysadmin-btn-primary"><FiPlus /> Add</button>
        </form>
      </div>

      <div className="sysadmin-card">
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "1rem" }}>Year</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {years.map(y => (
              <tr key={y.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem", fontWeight: 500 }}>{y.year}</td>
                <td style={{ padding: "1rem" }}>
                  {y.isActive ? (
                    <span style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}>
                      <FiCheckCircle /> Active
                    </span>
                  ) : (
                    <span style={{ color: "#64748b" }}>Inactive</span>
                  )}
                </td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                  {!y.isActive && (
                    <button onClick={() => setAsActive(y.id)} style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>
                      Set Active
                    </button>
                  )}
                  <button onClick={() => handleDelete(y.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {years.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No academic years found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
