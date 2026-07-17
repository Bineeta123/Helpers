using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace SmartStudyPlanner.Models
{
    public class Admin
    {
        public int Id { get; set; }

        [Required] public string Name { get; set; } = string.Empty;

        [Required] public string Email { get; set; } = string.Empty;
        
        public ICollection<Resources> Resources { get; set; } = new List<Resources>();

    }
}