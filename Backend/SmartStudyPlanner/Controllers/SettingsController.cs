using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> GetSettings(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                email = user.Email
            });
        }

        [HttpPut("{email}")]
        public async Task<IActionResult> UpdateSettings(string email, [FromBody] Settings request)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update email
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

            return Ok(new
            {
                message = "Settings updated successfully."
            });
        }
    }
}