using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class AuthorizedUser
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty; // Teacher, Student

        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }

        public string Semester { get; set; } = string.Empty;
        public string Section { get; set; } = string.Empty;

        public int? AcademicYearId { get; set; }
        public AcademicYear? AcademicYear { get; set; }

        public string Status { get; set; } = "Pending Registration"; 
    }
}
