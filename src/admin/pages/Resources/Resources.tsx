import "./Resources.css";
import { useState } from "react";

const resources = [
  {
    id: 1,
    title: "Database Notes",
    subject: "Database",
    type: "PDF",
    uploadedBy: "Admin",
  },
  {
    id: 2,
    title: "React Tutorial",
    subject: "Web Technology",
    type: "Video",
    uploadedBy: "Admin",
  },
  {
    id: 3,
    title: "Networking Slides",
    subject: "Computer Networks",
    type: "PPT",
    uploadedBy: "Admin",
  },
];

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resources-page">
      <div className="resources-header">
        <div>
          <h1>Resources</h1>
          <p>Upload and manage study materials.</p>
        </div>

        <button className="add-btn">
          + Upload Resource
        </button>
      </div>

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
            <th>Uploaded By</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredResources.map((resource) => (
            <tr key={resource.id}>
              <td>{resource.title}</td>
              <td>{resource.subject}</td>
              <td>{resource.type}</td>
              <td>{resource.uploadedBy}</td>

              <td>
                <button className="view-btn">
                  View
                </button>

                <button className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}