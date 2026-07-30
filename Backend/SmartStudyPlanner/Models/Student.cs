using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string RollNumber { get; set; } = string.Empty;

        public string Semester { get; set; } = string.Empty;

        public string Section { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Active";

        public int? ClassId { get; set; }
        public Class? Class { get; set; }
    }
}
