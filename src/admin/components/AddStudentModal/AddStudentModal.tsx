import { useEffect,useState } from "react";
import "./AddStudentModal.css";

interface Props {
 open: boolean;
  onClose: () => void;
  onSave: (student: {
    name: string;
    email: string;
    status: string;
  }) => void;
  
  student?: {
    id: number;
    name: string;
    email: string;
    status: string;
  } | null;


}

export default function AddStudentModal({
  open,
  onClose,
  onSave,
  student,
}: Props) {
  if (!open) return null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
  if (student) {
    setName(student.name);
    setEmail(student.email);
    setStatus(student.status);
  } else {
    setName("");
    setEmail("");
    setStatus("Active");
  }
}, [student, open]);

  return (
    <div className="modal-overlay">
      <div className="add-student-modal">
        <h2>{student ? "Edit Student" : "Add Student"}</h2>

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
                status,
              });

    setName("");
    setEmail("");
    setStatus("Active");

    onClose();
  }}
          
           >
            {student ? "Update" : "Save"} 
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