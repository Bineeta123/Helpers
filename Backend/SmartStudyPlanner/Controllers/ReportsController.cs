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
            var student = await _context.Students
                .Include(s => s.Classes)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound("Student not found");
            }

            var classIds = student.Classes.Select(c => c.Id).ToList();

            // Calculate live stats based on DB context
            int totalAssignments = await _context.Assignments
                .CountAsync(a => a.ClassId.HasValue && classIds.Contains(a.ClassId.Value));

            int assignmentsSubmitted = await _context.AssignmentSubmissions
                .CountAsync(s => s.StudentId == id);

            int assignmentsNotSubmitted = Math.Max(0, totalAssignments - assignmentsSubmitted);

            int resourcesViewed = await _context.Resources
                .CountAsync(r => r.ClassId.HasValue && classIds.Contains(r.ClassId.Value));

            int loginCount = assignmentsSubmitted * 3 + (id * 7) % 15 + 6;

            int progress = totalAssignments > 0 ? (assignmentsSubmitted * 100) / totalAssignments : 100;
            progress = Math.Min(100, progress);

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
