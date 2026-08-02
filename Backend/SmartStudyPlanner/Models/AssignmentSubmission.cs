using System;
using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class AssignmentSubmission
    {
        public int Id { get; set; }

        [Required]
        public int AssignmentId { get; set; }
        public Assignments? Assignment { get; set; }

        [Required]
        public int StudentId { get; set; }
        public Student? Student { get; set; }

        [Required]
        public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;

        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Submitted"; // Submitted, Graded

        public int? Grade { get; set; } // 1 to 5 stars

        public string? Feedback { get; set; }
    }
}
