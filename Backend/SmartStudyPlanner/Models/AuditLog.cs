using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Models
{
    public class AuditLog
    {
        public int Id { get; set; }

        public string Action { get; set; } = string.Empty; // e.g., "User Activated", "New Class Created"

        public string Details { get; set; } = string.Empty;

        public string PerformedBy { get; set; } = string.Empty; // Admin Email or Id

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
