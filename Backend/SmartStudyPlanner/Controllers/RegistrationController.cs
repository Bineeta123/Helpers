using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;
using System.Threading.Tasks;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RegistrationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("requests")]
        public async Task<IActionResult> GetRequests()
        {
            var requests = await _context.RegistrationRequests
                .Include(r => r.AuthorizedUser)
                .ToListAsync();
            return Ok(requests);
        }

        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var request = await _context.RegistrationRequests
                .Include(r => r.AuthorizedUser)
                .FirstOrDefaultAsync(r => r.Id == id);
            
            if (request == null) return NotFound();

            request.Status = "Approved";
            request.AuthorizedUser.Status = "Active";

            // If teacher, create teacher profile
            if (request.AuthorizedUser.Role == "Teacher")
            {
                var teacher = new Teacher
                {
                    Name = request.AuthorizedUser.Name,
                    Email = request.AuthorizedUser.Email,
                    DepartmentId = request.AuthorizedUser.DepartmentId,
                    Status = "Active"
                };
                _context.Teachers.Add(teacher);
            }
            // If student, create student profile
            else if (request.AuthorizedUser.Role == "Student")
            {
                var student = new Student
                {
                    Name = request.AuthorizedUser.Name,
                    Email = request.AuthorizedUser.Email,
                    Semester = request.AuthorizedUser.Semester,
                    Section = request.AuthorizedUser.Section,
                    Status = "Active"
                };
                _context.Students.Add(student);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration approved successfully" });
        }

        [HttpPost("reject/{id}")]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var request = await _context.RegistrationRequests
                .Include(r => r.AuthorizedUser)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null) return NotFound();

            request.Status = "Rejected";
            request.AuthorizedUser.Status = "Rejected";

            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration rejected successfully" });
        }
    }
}
