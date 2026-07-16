using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace SmartStudyPlanner.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AssignmentsController(ApplicationDbContext context)
        {
            _context = context;
        }
                                                        
        [HttpGet]
        public async Task<ActionResult<List<Assignments>>> GetAssignments()
        {
            // get user id from token claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

            _ = Guid.TryParse(userId, out Guid userGuid);

            var assignments = await _context.Assignments
                .Where(a => a.CreatedById == userGuid)
                .OrderBy(a => a.DueDate)
                .ToListAsync();

            return Ok(assignments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Assignments>> GetAssignmentById(int id)
        {
            var assignment = await _context.Assignments.FindAsync(id);

            if (assignment == null)
            {
                return NotFound("Assignment not found");
            }

            return Ok(assignment);
        }

        [HttpPost]
        public async Task<ActionResult<Assignments>> AddAssignment([FromForm] AddAssignmentRequest request)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

            if (!Guid.TryParse(userId, out Guid userGuid))
            {
                return Unauthorized("User Id not found");
            }

            string? uniqueFileName = null;
            string? originalFileName = null;

            if (request.File != null && request.File.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "Assignments");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                originalFileName = request.File.FileName;
                uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(request.File.FileName);
                var fullPath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await request.File.CopyToAsync(stream);
                }
            }

            var assignment = new Assignments
            {
                Title = request.Title,
                Subject = request.Subject,
                Description = request.Description,
                DueDate = request.DueDate,
                CreatedById = userGuid,
                FileName = originalFileName,
                FilePath = uniqueFileName
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return Ok(assignment);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var assignment = await _context.Assignments.FindAsync(id);

            if (assignment == null)
            {
                return NotFound("Assignment not found");
            }

            // Delete associated file if it exists
            if (!string.IsNullOrEmpty(assignment.FilePath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "Assignments", assignment.FilePath);
                if (System.IO.File.Exists(filePath))
                {
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        // Log issue or continue, we should not block database deletion
                        Console.WriteLine($"Error deleting file: {ex.Message}");
                    }
                }
            }

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return Ok("Assignment deleted successfully");
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new
            {
                IsAuthenticated = User.Identity?.IsAuthenticated,
                AuthenticationType = User.Identity?.AuthenticationType,
                Claims = User.Claims.Select(c => new
                {
                    c.Type,
                    c.Value
                }).ToList()
            });
        }

    }

    public class AddAssignmentRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public IFormFile? File { get; set; }
    }
}