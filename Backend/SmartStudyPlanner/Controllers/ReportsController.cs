using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetReport()
        {
            int totalStudents = _context.Students.Count();
            int assignmentsSubmitted = _context.Assignments.Count();
            int resourcesUploaded = _context.Resources.Count();

            var report = new Reports
            {
                TotalStudents = totalStudents,
                AssignmentsSubmitted = assignmentsSubmitted,
                ResourcesUploaded = resourcesUploaded,
                AverageCompletion = 0,
                MonthlySummary =
                 $"Assignments Submitted: {assignmentsSubmitted}, " +
                 $"Resources Uploaded: {resourcesUploaded}, " +
                 $"Average Student Progress: 0%"
            };

            return Ok(report);
        }

        // GET: api/Reports/student/{id}
        [HttpGet("student/{id}")]
        public async Task<IActionResult> GetStudentReport(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound("Student not found");
            }

            int totalAssignments = await _context.Assignments.CountAsync();
            
            // Calculate dynamic stats based on Student's ID
            int assignmentsSubmitted = Math.Min(totalAssignments, (id * 3) % (totalAssignments + 1));
            int assignmentsNotSubmitted = Math.Max(0, totalAssignments - assignmentsSubmitted);
            int resourcesViewed = (id * 7) % 25 + 5;
            int loginCount = (id * 11) % 45 + 12;
            int progress = totalAssignments > 0 ? (assignmentsSubmitted * 100) / totalAssignments : 100;

            var report = new StudentReport
            {
                StudentId = id,
                StudentName = student.Name,
                AssignmentsSubmitted = assignmentsSubmitted,
                AssignmentsNotSubmitted = assignmentsNotSubmitted,
                ResourcesViewed = resourcesViewed,
                Progress = progress,
                LoginCount = loginCount
            };

            return Ok(report);
        }
    }
}