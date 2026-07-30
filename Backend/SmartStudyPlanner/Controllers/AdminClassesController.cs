using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;
using System.Threading.Tasks;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminClassesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminClassesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var classes = await _context.Classes
                .Include(c => c.AcademicYear)
                .Include(c => c.Students)
                .Include(c => c.TeacherClasses)
                    .ThenInclude(tc => tc.Teacher)
                .ToListAsync();
            return Ok(classes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cls = await _context.Classes
                .Include(c => c.AcademicYear)
                .Include(c => c.Students)
                .Include(c => c.TeacherClasses)
                    .ThenInclude(tc => tc.Teacher)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cls == null) return NotFound();
            return Ok(cls);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Class model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (model.AcademicYearId == 0)
            {
                var defaultYear = await _context.AcademicYears.FirstOrDefaultAsync(y => y.Year == "Default");
                if (defaultYear == null)
                {
                    defaultYear = new AcademicYear { Year = "Default", IsActive = true };
                    _context.AcademicYears.Add(defaultYear);
                    await _context.SaveChangesAsync();
                }
                model.AcademicYearId = defaultYear.Id;
            }

            _context.Classes.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Class model)
        {
            if (id != model.Id) return BadRequest();

            _context.Entry(model).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Classes.AnyAsync(e => e.Id == id))
                    return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cls = await _context.Classes.FindAsync(id);
            if (cls == null) return NotFound();

            _context.Classes.Remove(cls);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{classId}/assign-teacher/{teacherId}")]
        public async Task<IActionResult> AssignTeacher(int classId, int teacherId)
        {
            var exists = await _context.TeacherClasses
                .AnyAsync(tc => tc.ClassId == classId && tc.TeacherId == teacherId);
            
            if (exists) return BadRequest("Teacher already assigned to this class");

            _context.TeacherClasses.Add(new TeacherClass { ClassId = classId, TeacherId = teacherId });
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{classId}/remove-teacher/{teacherId}")]
        public async Task<IActionResult> RemoveTeacher(int classId, int teacherId)
        {
            var tc = await _context.TeacherClasses
                .FirstOrDefaultAsync(x => x.ClassId == classId && x.TeacherId == teacherId);
            
            if (tc == null) return NotFound();

            _context.TeacherClasses.Remove(tc);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("{classId}/enroll-student/{studentId}")]
        public async Task<IActionResult> EnrollStudent(int classId, int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound("Student not found");

            student.ClassId = classId;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("unenroll-student/{studentId}")]
        public async Task<IActionResult> UnenrollStudent(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound("Student not found");

            student.ClassId = null;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
