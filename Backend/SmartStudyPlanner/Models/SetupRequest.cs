namespace SmartStudyPlanner.Models
{
    public class SetupRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        public string SchoolName { get; set; } = string.Empty;
        public string? SchoolAddress { get; set; }
    }
}
