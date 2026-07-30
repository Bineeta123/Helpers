using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class Class
    {
        public int Id { get; set; }

        [Required]
        public string ClassName { get; set; } = string.Empty;

        [Required]
        public string Semester { get; set; } = string.Empty;

        public string Section { get; set; } = string.Empty;

        public int AcademicYearId { get; set; }
        public AcademicYear AcademicYear { get; set; } = null!;

        public string RoomNumber { get; set; } = string.Empty;

        public ICollection<TeacherClass> TeacherClasses { get; set; } = new List<TeacherClass>();
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}
