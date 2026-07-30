using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;
using System.Threading.Tasks;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AcademicYearsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AcademicYearsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var years = await _context.AcademicYears.ToListAsync();
            return Ok(years);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AcademicYear model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (model.IsActive)
            {
                // Deactivate all others
                var activeYears = await _context.AcademicYears.Where(y => y.IsActive).ToListAsync();
                foreach (var y in activeYears) y.IsActive = false;
            }

            _context.AcademicYears.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}/set-active")]
        public async Task<IActionResult> SetActive(int id)
        {
            var year = await _context.AcademicYears.FindAsync(id);
            if (year == null) return NotFound();

            var activeYears = await _context.AcademicYears.Where(y => y.IsActive).ToListAsync();
            foreach (var y in activeYears) y.IsActive = false;

            year.IsActive = true;
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var year = await _context.AcademicYears.FindAsync(id);
            if (year == null) return NotFound();

            _context.AcademicYears.Remove(year);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
