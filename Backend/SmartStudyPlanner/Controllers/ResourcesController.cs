// file:///c:/NEXTJS/Miniproject/miniproject/Backend/SmartStudyPlanner/Controllers/ResourcesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;
using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Controllers
{
    [Authorize]                     // <— only logged‑in users can call
    [ApiController]
    [Route("api/[controller]")]
    public class ResourcesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ResourcesController(ApplicationDbContext context) => _context = context;

        // -------------------------------------------------------------
        // Helper – extract the admin Id from the JWT claim ("userId")
        // -------------------------------------------------------------
        private async Task<int?> GetCurrentAdminIdAsync()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedId))
            {
                return parsedId;
            }

            var emailClaim = User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
            if (!string.IsNullOrEmpty(emailClaim))
            {
                var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == emailClaim);
                return admin?.Id;
            }

            return null;
        }

        // -------------------------------------------------------------
        // GET: api/Resources – returns only the caller’s resources
        // -------------------------------------------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resources>>> GetResources()
        {
            var adminId = await GetCurrentAdminIdAsync();
            if (adminId == null) return Unauthorized();

            var resources = await _context.Resources
                .Where(r => r.AdminId == adminId.Value)
                .ToListAsync();

            return Ok(resources);
        }

        // -------------------------------------------------------------
        // GET: api/Resources/{id}
        // -------------------------------------------------------------
        [HttpGet("{id}")]
        public async Task<ActionResult<Resources>> GetResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();

            var adminId = await GetCurrentAdminIdAsync();
            if (adminId == null) return Unauthorized();
            if (resource.AdminId != adminId.Value) return Forbid();

            return Ok(resource);
        }

        // -------------------------------------------------------------
        // POST: api/Resources – upload a file and create a record
        // -------------------------------------------------------------
        [HttpPost]
        public async Task<ActionResult<Resources>> AddResource([FromForm] AddResourceRequest request)
        {
            var adminId = await GetCurrentAdminIdAsync();
            if (adminId == null) return Unauthorized();

            if (request.File == null || request.File.Length == 0)
                return BadRequest("Please select a file.");

            // ---- ensure upload folder exists ----
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot", "Uploads", "Resources");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // ---- generate a unique filename ----
            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(request.File.FileName);
            var fullPath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
                await request.File.CopyToAsync(stream);
            // ------------------------------------

            var resource = new Resources
            {
                Title    = request.Title,
                Subject  = request.Subject,
                Type     = request.Type,
                FileName = request.File.FileName,
                FilePath = uniqueFileName,
                AdminId  = adminId.Value
            };

            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            return Ok(resource);
        }

        // -------------------------------------------------------------
        // PUT: api/Resources/{id} – update fields (admin‑ownership checked)
        // -------------------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResource(int id, Resources updated)
        {
            var adminId = await GetCurrentAdminIdAsync();
            if (adminId == null) return Unauthorized();

            var existing = await _context.Resources.FindAsync(id);
            if (existing == null) return NotFound();
            if (existing.AdminId != adminId.Value) return Forbid();

            // Only allow editable fields – never change AdminId here
            existing.Title   = updated.Title;
            existing.Subject = updated.Subject;
            existing.Type    = updated.Type;
            // File updates would need a separate endpoint; omitted for brevity

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // -------------------------------------------------------------
        // DELETE: api/Resources/{id}
        // -------------------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            var adminId = await GetCurrentAdminIdAsync();
            if (adminId == null) return Unauthorized();

            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();
            if (resource.AdminId != adminId.Value) return Forbid();

            // delete uploaded file from disk
            if (!string.IsNullOrEmpty(resource.FilePath))
            {
                var filePath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot", "Uploads", "Resources",
                    resource.FilePath);

                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // -------------------------------------------------------------
    // DTO for POST (multipart/form‑data)
    // -------------------------------------------------------------
    public class AddResourceRequest
    {
        [Required] public string Title   { get; set; } = string.Empty;
        [Required] public string Subject { get; set; } = string.Empty;
        [Required] public string Type    { get; set; } = string.Empty; // e.g. "PDF"
        [Required] public IFormFile File  { get; set; } = null!;
    }
}
