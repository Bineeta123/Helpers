import { useState } from "react";
import "./AddStudentModal.css";

interface Props {
 open: boolean;
  onClose: () => void;
  onSave: (student: {
    name: string;
    email: string;
    semester: string;
    status: string;
  }) => void;

}

export default function AddStudentModal({
  open,
  onClose,
  onSave,
}: Props) {
  if (!open) return null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("Active");

  return (
    <div className="modal-overlay">
      <div className="add-student-modal">

        <h2>Add Student</h2>

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        <select 
        value={status}
         onChange={(e) => setStatus(e.target.value)}>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div className="modal-buttons">
          <button className="save-btn" 
          onClick={() => {
            onSave({
                name,
                email,
                semester,
                status,
              });

    setName("");
    setEmail("");
    setSemester("");
    setStatus("Active");

    onClose();
  }}
          
           >
           Save
          </button>

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}