using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public SettingsController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetSettings([FromServices] ApplicationDbContext context, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            string name = string.Empty;
            var studentProfile = await context.Students.FirstOrDefaultAsync(s => s.Email == email);
            if (studentProfile != null)
            {
                name = studentProfile.Name;
            }
            else
            {
                var teacherProfile = await context.Teachers.FirstOrDefaultAsync(t => t.Email == email);
                if (teacherProfile != null)
                {
                    name = teacherProfile.Name;
                }
            }

            return Ok(new
            {
                email = user.Email,
                name = name
            });
        }

        [HttpPut("{email}")]
        public async Task<IActionResult> UpdateSettings([FromServices] ApplicationDbContext context, string email, [FromBody] Settings request)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update associated Student/Teacher profile first before we change IdentityUser email
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var studentProfile = await context.Students.FirstOrDefaultAsync(s => s.Email == user.Email);
                if (studentProfile != null)
                {
                    studentProfile.Name = request.Name;
                }
                var teacherProfile = await context.Teachers.FirstOrDefaultAsync(t => t.Email == user.Email);
                if (teacherProfile != null)
                {
                    teacherProfile.Name = request.Name;
                }
            }

            if (user.Email != request.Email)
            {
                var studentProfile = await context.Students.FirstOrDefaultAsync(s => s.Email == user.Email);
                if (studentProfile != null)
                {
                    studentProfile.Email = request.Email;
                }
                var teacherProfile = await context.Teachers.FirstOrDefaultAsync(t => t.Email == user.Email);
                if (teacherProfile != null)
                {
                    teacherProfile.Email = request.Email;
                }
            }

            // Update IdentityUser details
            user.Email = request.Email;
            user.UserName = request.Email;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            // Update password only if provided
            if (!string.IsNullOrWhiteSpace(request.NewPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                var passwordResult = await _userManager.ResetPasswordAsync(
                    user,
                    token,
                    request.NewPassword);

                if (!passwordResult.Succeeded)
                {
                    return BadRequest(passwordResult.Errors);
                }
            }

            await context.SaveChangesAsync();

            return Ok(new
            {
                message = "Settings updated successfully."
            });
        }

        [HttpGet("school")]
        public async Task<IActionResult> GetSchoolSetting([FromServices] ApplicationDbContext context)
        {
            var school = await context.SchoolSettings.FirstOrDefaultAsync();
            if (school == null)
            {
                return NotFound("School settings not configured.");
            }
            return Ok(new { name = school.Name });
        }

        [HttpPut("school")]
        public async Task<IActionResult> UpdateSchoolSetting([FromServices] ApplicationDbContext context, [FromBody] SchoolSettingUpdateDto request)
        {
            var school = await context.SchoolSettings.FirstOrDefaultAsync();
            if (school == null)
            {
                school = new SchoolSetting
                {
                    Name = request.Name,
                    Address = string.Empty
                };
                context.SchoolSettings.Add(school);
            }
            else
            {
                school.Name = request.Name;
            }
            await context.SaveChangesAsync();
            return Ok(new { message = "School settings updated successfully.", name = school.Name });
        }
    }

    public class SchoolSettingUpdateDto
    {
        public string Name { get; set; } = string.Empty;
    }
}