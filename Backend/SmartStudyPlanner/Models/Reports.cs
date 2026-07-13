namespace SmartStudyPlanner.Models
{
    public class Reports
    {
        public int TotalStudents { get; set; }

        public int AssignmentsSubmitted { get; set; }

        public int ResourcesUploaded { get; set; }

        public int AverageCompletion { get; set; }

        public string MonthlySummary { get; set; } = string.Empty;
    }
}
