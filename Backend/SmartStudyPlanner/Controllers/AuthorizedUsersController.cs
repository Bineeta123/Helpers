using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;
using System.Threading.Tasks;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Roles = "Admin")] // Uncomment when roles are active in frontend testing
    public class AuthorizedUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthorizedUsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.AuthorizedUsers.ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AuthorizedUser model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.Status = "Pending Registration";
            _context.AuthorizedUsers.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AuthorizedUser model)
        {
            if (id != model.Id) return BadRequest();

            _context.Entry(model).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.AuthorizedUsers.AnyAsync(e => e.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.AuthorizedUsers.FindAsync(id);
            if (user == null) return NotFound();

            _context.AuthorizedUsers.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
