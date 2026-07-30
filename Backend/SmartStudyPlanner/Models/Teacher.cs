using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class Teacher
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Qualification { get; set; } = string.Empty;

        public string Designation { get; set; } = string.Empty;

        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }

        [Required]
        public string Status { get; set; } = "Active";

        public ICollection<TeacherClass> TeacherClasses { get; set; } = new List<TeacherClass>();
    }
}
