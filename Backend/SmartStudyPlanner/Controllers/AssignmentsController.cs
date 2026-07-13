using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;

namespace SmartStudyPlanner.Controllers
{
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
            var assignments = await _context.Assignments
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
        public async Task<ActionResult<Assignments>> AddAssignment(Assignments assignment)
        {
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

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return Ok("Assignment deleted successfully");
        }
    }
}