namespace SmartStudyPlanner.Models
{
    public class TeacherClass
    {
        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; } = null!;

        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;
    }
}
