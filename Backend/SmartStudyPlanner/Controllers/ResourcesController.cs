using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;
using System.ComponentModel.DataAnnotations;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResourcesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResourcesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/resources
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resources>>> GetResources()
        {
            return await _context.Resources.ToListAsync();
        }

        // GET: api/resources/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Resources>> GetResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);

            if (resource == null)
                return NotFound();

            return resource;
        }

        // POST: api/resources
        [HttpPost]
        public async Task<IActionResult> AddResource([FromForm] AddResourceRequest request)
        {
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest("Please select a file.");
            }

            // Create Uploads folder
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot", "Uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Unique filename
            var uniqueFileName =
                Guid.NewGuid().ToString() + Path.GetExtension(request.File.FileName);

            var fullPath = Path.Combine(
                uploadsFolder,
                uniqueFileName);

            // Save file
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            // Save database record
            var resource = new Resources
            {
                Title = request.Title,
                Subject = request.Subject,
                Type = request.Type,
                FileName = request.File.FileName,
                FilePath = uniqueFileName
            };

            _context.Resources.Add(resource);

            await _context.SaveChangesAsync();

            return Ok(resource);
        }

        // PUT: api/resources/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResource(int id, Resources resource)
        {
            if (id != resource.Id)
                return BadRequest();

            _context.Entry(resource).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/resources/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);

            if (resource == null)
                return NotFound();

            // Delete uploaded file
            if (!string.IsNullOrEmpty(resource.FilePath))
            {
                var filePath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot", "Uploads",
                    resource.FilePath);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Resources.Remove(resource);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class AddResourceRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        public IFormFile File { get; set; } = null!;
    }
}