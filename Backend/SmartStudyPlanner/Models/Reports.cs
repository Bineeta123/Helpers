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

     public class StudentReport
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int AssignmentsSubmitted { get; set; }
        public int AssignmentsNotSubmitted { get; set; }
        public int ResourcesViewed { get; set; }
        public int Progress { get; set; }
        public int LoginCount { get; set; }
    }
}
