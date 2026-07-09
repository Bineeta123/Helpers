import "./StudentModal.css";

interface Student {
  id: number;
  name: string;
  email: string;
  semester: string;
  status: string;
}

interface Props {
  student: Student | null;
  onClose: () => void;
}

export default function StudentModal({
  student,
  onClose,
}: Props) {
  if (!student) return null;

  return (
    <div className="modal-overlay">

      <div className="student-modal">

        <h2>Student Details</h2>

        <p><strong>ID:</strong> {student.id}</p>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Semester:</strong> {student.semester}</p>
        <p><strong>Status:</strong> {student.status}</p>

        <button
          className="close-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}