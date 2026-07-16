using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class Resources
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        public string? FileName { get; set; }

        public string? FilePath { get; set; }
    }
}