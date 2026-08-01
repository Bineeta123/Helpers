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
            var cls = await _context.Classes.FindAsync(classId);
            if (cls == null) return NotFound("Class not found");

            var student = await _context.Students
                .Include(s => s.Classes)
                .FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null) return NotFound("Student not found");

            if (student.Status != "Active") return BadRequest("Student is not active.");

            // Check if already enrolled in this class
            if (student.Classes.Any(c => c.Id == classId))
            {
                return BadRequest("Student is already enrolled in this class.");
            }

            // Check section and semester matching criteria
            // Semester match logic:
            if (!string.IsNullOrEmpty(cls.Semester) && !string.IsNullOrEmpty(student.Semester))
            {
                var classSem = cls.Semester.ToLowerInvariant();
                var studSem = student.Semester.ToLowerInvariant();

                // Check numeric digit match in semester, e.g. "Semester 1" and "1" or "1st"
                var classNum = new string(classSem.Where(char.IsDigit).ToArray());
                var studNum = new string(studSem.Where(char.IsDigit).ToArray());

                bool semMatches = classSem.Contains(studSem) || studSem.Contains(classSem) ||
                                  (!string.IsNullOrEmpty(classNum) && !string.IsNullOrEmpty(studNum) && classNum == studNum);

                if (!semMatches)
                {
                    return BadRequest($"Semester mismatch: Student semester ({student.Semester}) does not match class semester ({cls.Semester}).");
                }
            }

            // Section match logic:
            if (!string.IsNullOrEmpty(cls.Section) && !string.IsNullOrEmpty(student.Section))
            {
                var classSec = cls.Section.ToLowerInvariant().Trim();
                var studSec = student.Section.ToLowerInvariant().Trim();

                if (classSec != studSec)
                {
                    return BadRequest($"Section mismatch: Student section ({student.Section}) does not match class section ({cls.Section}).");
                }
            }

            // Add class to student
            student.Classes.Add(cls);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("{classId}/unenroll-student/{studentId}")]
        public async Task<IActionResult> UnenrollStudent(int classId, int studentId)
        {
            var student = await _context.Students
                .Include(s => s.Classes)
                .FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null) return NotFound("Student not found");

            var cls = student.Classes.FirstOrDefault(c => c.Id == classId);
            if (cls != null)
            {
                student.Classes.Remove(cls);
                await _context.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
