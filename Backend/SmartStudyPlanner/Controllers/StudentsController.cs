using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;

namespace SmartStudyPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Student>>> GetStudents()
        {
            var students = await _context.Students
                .OrderBy(s => s.Id)
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudentById(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound("Student not found");
            }

            return Ok(student);
        }

        [HttpPost]
        public async Task<ActionResult<Student>> AddStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound("Student not found");
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok("Student deleted successfully");
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStudentStatus(
            int id,
            UpdateStudentStatusRequest request)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound("Student not found");
            }

            if (request.Status != "Active" && request.Status != "Inactive")
            {
                return BadRequest("Status must be Active or Inactive");
            }

            student.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(student);
        }
    }
}