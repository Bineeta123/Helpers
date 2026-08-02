using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;

namespace SmartStudyPlanner.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubmissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubmissionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get submissions by the logged-in student
        [HttpGet("student")]
        public async Task<IActionResult> GetStudentSubmissions()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized("Invalid user session");

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == email);
            if (student == null) return NotFound("Student profile not found");

            var submissions = await _context.AssignmentSubmissions
                .Include(s => s.Assignment)
                .Where(s => s.StudentId == student.Id)
                .ToListAsync();

            return Ok(submissions);
        }

        // Get the logged-in student's profile including class
        [HttpGet("profile")]
        public async Task<IActionResult> GetStudentProfile()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized("Invalid user session");

            var student = await _context.Students
                .Include(s => s.Classes)
                .FirstOrDefaultAsync(s => s.Email == email);

            if (student == null) return NotFound("Student profile not found");

            return Ok(student);
        }

        // Get student's class assignments along with their submission status
        [HttpGet("student-assignments")]
        public async Task<IActionResult> GetStudentAssignments()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized("Invalid user session");

            var student = await _context.Students
                .Include(s => s.Classes)
                .FirstOrDefaultAsync(s => s.Email == email);
            if (student == null) return NotFound("Student profile not found");

            var classIds = student.Classes.Select(c => c.Id).ToList();
            if (!classIds.Any())
            {
                return Ok(new object[] { });
            }

            // Find all assignments published to these classes
            var assignments = await _context.Assignments
                .Include(a => a.Class)
                .Where(a => classIds.Contains(a.ClassId ?? 0))
                .OrderBy(a => a.DueDate)
                .ToListAsync();

            // Find all submissions by this student
            var submissions = await _context.AssignmentSubmissions
                .Where(s => s.StudentId == student.Id)
                .ToDictionaryAsync(s => s.AssignmentId);

            var result = assignments.Select(a => {
                submissions.TryGetValue(a.Id, out var sub);
                return new {
                    Assignment = a,
                    Submission = sub
                };
            });

            return Ok(result);
        }

        // Post a new submission (Student)
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitAssignment([FromForm] SubmitRequest request)
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized("Invalid user session");

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == email);
            if (student == null) return NotFound("Student profile not found");

            var assignment = await _context.Assignments.FindAsync(request.AssignmentId);
            if (assignment == null) return NotFound("Assignment not found");

            // Check if already submitted
            var existing = await _context.AssignmentSubmissions
                .FirstOrDefaultAsync(s => s.AssignmentId == request.AssignmentId && s.StudentId == student.Id);

            if (existing != null)
            {
                return BadRequest("You have already submitted this assignment.");
            }

            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest("Please upload a submission file.");
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "Submissions");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var originalFileName = request.File.FileName;
            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(request.File.FileName);
            var fullPath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            var submission = new AssignmentSubmission
            {
                AssignmentId = request.AssignmentId,
                StudentId = student.Id,
                FileName = originalFileName,
                FilePath = uniqueFileName,
                SubmissionDate = DateTime.UtcNow,
                Status = "Submitted"
            };

            _context.AssignmentSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            return Ok(submission);
        }

        // Get submissions for a specific assignment (Teacher)
        [HttpGet("assignment/{assignmentId}")]
        public async Task<IActionResult> GetAssignmentSubmissions(int assignmentId)
        {
            var submissions = await _context.AssignmentSubmissions
                .Include(s => s.Student)
                .Where(s => s.AssignmentId == assignmentId)
                .ToListAsync();

            return Ok(submissions);
        }

        // Grade a submission (Teacher)
        [HttpPost("grade/{id}")]
        public async Task<IActionResult> GradeSubmission(int id, [FromBody] GradeRequest request)
        {
            var submission = await _context.AssignmentSubmissions.FindAsync(id);
            if (submission == null) return NotFound("Submission not found");

            if (request.Grade < 1 || request.Grade > 5)
            {
                return BadRequest("Grade stars must be between 1 and 5.");
            }

            submission.Grade = request.Grade;
            submission.Feedback = request.Feedback;
            submission.Status = "Graded";

            await _context.SaveChangesAsync();
            return Ok(submission);
        }
    }

    public class SubmitRequest
    {
        public int AssignmentId { get; set; }
        public IFormFile File { get; set; } = null!;
    }

    public class GradeRequest
    {
        public int Grade { get; set; } // 1-5 stars
        public string? Feedback { get; set; }
    }
}
