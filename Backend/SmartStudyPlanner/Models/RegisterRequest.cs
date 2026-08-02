namespace SmartStudyPlanner.Models
{
    public class RegisterRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string ConfirmPassword { get; set; } = "";
        public string Role { get; set; } = "";
        public string Name { get; set; } = "";
        public string Semester { get; set; } = "";
        public string Section { get; set; } = "";
    }
}
