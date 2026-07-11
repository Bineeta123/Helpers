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

        [Required]
        public string Status { get; set; } = "Active";
    }
}
