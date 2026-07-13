using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class Resources
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Type { get; set; }

        public string? FileName { get; set; }

        public string? FilePath { get; set; }
    }
}