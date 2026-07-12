using Microsoft.AspNetCore.Mvc;
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

            // Replace this later with your own calculation
            //int averageCompletion = 0;

            var report = new Reports
            {
                TotalStudents = _context.Students.Count(),
                AssignmentsSubmitted = _context.Assignments.Count(),
                ResourcesUploaded = _context.Resources.Count(),
                AverageCompletion = 0,
                MonthlySummary =
                 $"Assignments Submitted: {assignmentsSubmitted}, " +
                 $"Resources Uploaded: {resourcesUploaded}, " +
                 $"Average Student Progress: 0%"
            };

            return Ok(report);
        }
    }
}