using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class RegistrationRequest
    {
        public int Id { get; set; }

        [Required]
        public int AuthorizedUserId { get; set; }
        public AuthorizedUser AuthorizedUser { get; set; } = null!;

        [Required]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    }
}
