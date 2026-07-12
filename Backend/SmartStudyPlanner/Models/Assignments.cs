using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class Assignments
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;


        [Required]
        public DateTime DueDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}