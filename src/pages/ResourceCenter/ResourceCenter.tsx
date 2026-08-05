import { useEffect, useState } from 'react';
import '../../App.css';
import './ResourceCenter.css';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5065";

export default function ResourceCenter() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("study-planner-token");
      const response = await fetch(`${BASE_URL}/api/resources/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenResource = (filePath: string) => {
    window.open(`${BASE_URL}/Uploads/Resources/${filePath}`, '_blank');
  };

  if (loading) return <div style={{ padding: "2rem", color: "#64748b" }}>Loading class resources...</div>;

  return (
    <section className="section-grid">
      <div className="card card-white" style={{ gridColumn: "span 2" }}>
        <div className="card-title">Class Resource Center</div>
        <div className="resource-list" style={{ marginTop: "1rem" }}>
          {resources.map((resource) => (
            <div 
              className="resource-row" 
              key={resource.id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid #e2e8f0" }}
            >
              <div>
                <strong style={{ fontSize: "1.05rem", color: "#1f2937" }}>{resource.title}</strong>
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>
                  Subject: {resource.subject} | Format: {resource.type}
                </div>
              </div>
              <button 
                type="button" 
                className="btn-outline" 
                onClick={() => handleOpenResource(resource.filePath)}
                style={{ padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}
              >
                Download
              </button>
            </div>
          ))}

          {resources.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#64748b", fontStyle: "italic" }}>
              No study materials shared with your class yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
