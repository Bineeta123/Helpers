import "./Reports.css";

const reportData = [
  {
    title: "Total Students",
    value: 128,
  },
  {
    title: "Assignments Submitted",
    value: 96,
  },
  {
    title: "Resources Uploaded",
    value: 42,
  },
  {
    title: "Average Completion",
    value: "75%",
  },
];

export default function Reports() {
  return (
    <div className="reports-page">

      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>Overview of system statistics.</p>
        </div>
      </div>

      <div className="report-grid">
        {reportData.map((item) => (
          <div className="report-card" key={item.title}>
            <h3>{item.title}</h3>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="recent-report">
        <h2>Monthly Summary</h2>

        <ul>
          <li>✔ 96 Assignments Submitted</li>
          <li>✔ 42 Resources Uploaded</li>
          <li>✔ 18 New Students Registered</li>
          <li>✔ Average Student Progress: 75%</li>
        </ul>
      </div>

    </div>
  );
}