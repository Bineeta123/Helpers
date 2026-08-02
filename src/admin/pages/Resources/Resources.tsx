import "./Resources.css";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:5065";
const API_URL = `${BASE_URL}/api/resources`;

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [newResource, setNewResource] = useState({
    title: "",
    subject: "",
    type: "",
    classId: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchResources();
    fetchMyClasses();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("study-planner-token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }

      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyClasses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/Assignments/my-classes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("study-planner-token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMyClasses(data);
      }
    } catch (err) {
      console.error("Error loading teacher classes", err);
    }
  };

  const handleChange = (e: any) => {
    setNewResource({
      ...newResource,
      [e.target.name]: e.target.value,
    });
  };

  const addResource = async () => {
    if (
      !newResource.title ||
      !newResource.subject ||
      !newResource.type ||
      !selectedFile
    ) {
      alert("Please fill all fields and choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newResource.title);
    formData.append("subject", newResource.subject);
    formData.append("type", newResource.type);
    formData.append("file", selectedFile);
    if (newResource.classId) {
      formData.append("classId", newResource.classId);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("study-planner-token")}`,
        },
        body: formData
      });

      if (response.ok) {
        fetchResources();
        setNewResource({
          title: "",
          subject: "",
          type: "",
          classId: "",
        });
        setSelectedFile(null);
        setShowForm(false);
      } else {
        const errText = await response.text();
        alert(`Failed to upload resource. Status: ${response.status}. Error: ${errText}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteResource = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("study-planner-token")}`,
        },
      });

      if (response.ok) {
        fetchResources();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const viewResource = (resource: any) => {
    if (!resource.filePath) {
      alert("No file uploaded.");
      return;
    }

    window.open(
      `${BASE_URL}/Uploads/Resources/${resource.filePath}`,
      "_blank"
    );
  };

  const filteredResources = resources.filter((resource: any) => {
    return (
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="resources-page">
      <div className="resources-header">
        <div>
          <h1>Resources</h1>
          <p>Upload and manage study materials.</p>
        </div>
      </div>

      <div className="upload-section">
        <button
          className="add-btn"
          onClick={() => setShowForm(true)}
        >
          + Upload Resource
        </button>
      </div>

      {showForm && (
        <div className="add-resource-form">
          <h3>Upload Resource</h3>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newResource.title}
            onChange={handleChange}
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={newResource.subject}
            onChange={handleChange}
          />

          <select
            required
            name="classId"
            value={newResource.classId}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ddd" }}
          >
            <option value="">Publish to Class (Required)...</option>
            {myClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className} ({cls.semester} - {cls.section || "Any"})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="type"
            placeholder="Type (PDF, PPT, DOCX)"
            value={newResource.type}
            onChange={handleChange}
          />

          <input
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            onChange={(e) => {
              if (e.target.files) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />

          <div className="form-buttons">
            <button
              className="save-btn"
              onClick={addResource}
            >
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setNewResource({
                  title: "",
                  subject: "",
                  type: "",
                  classId: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="resources-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Type</th>
            <th>File</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource: any) => (
              <tr key={resource.id}>
                <td>{resource.title}</td>
                <td>{resource.subject}</td>
                <td>{resource.type}</td>
                <td>{resource.fileName}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => viewResource(resource)}>
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteResource(resource.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No resources found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
