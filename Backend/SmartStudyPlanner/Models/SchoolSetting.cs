using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class SchoolSetting
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
    }
}
