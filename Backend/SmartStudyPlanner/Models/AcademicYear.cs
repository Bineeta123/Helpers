using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class AcademicYear
    {
        public int Id { get; set; }

        [Required]
        public string Year { get; set; } = string.Empty; // e.g. 2025-2026

        public bool IsActive { get; set; } = false;

        public ICollection<Class> Classes { get; set; } = new List<Class>();
    }
}
