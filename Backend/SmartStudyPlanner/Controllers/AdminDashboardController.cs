using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalStudents = await _context.Students.CountAsync();
            var totalTeachers = await _context.Teachers.CountAsync();
            var totalClasses = await _context.Classes.CountAsync();
            var pendingRegistrations = await _context.RegistrationRequests.CountAsync(r => r.Status == "Pending");
            var activeUsers = await _context.Students.CountAsync(s => s.Status == "Active") + 
                              await _context.Teachers.CountAsync(t => t.Status == "Active");
            var inactiveUsers = await _context.Students.CountAsync(s => s.Status == "Inactive") + 
                                await _context.Teachers.CountAsync(t => t.Status == "Inactive");

            return Ok(new
            {
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                TotalClasses = totalClasses,
                PendingRegistrations = pendingRegistrations,
                ActiveUsers = activeUsers,
                InactiveUsers = inactiveUsers
            });
        }
    }
}
