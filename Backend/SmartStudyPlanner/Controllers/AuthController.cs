using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartStudyPlanner.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner;

namespace SmartStudyPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]

        
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.ConfirmPassword))
            {
                return BadRequest("Email, password and confirm password are required.");
            }

            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest("Password and confirm password do not match.");
            }

            if (!IsValidRole(request.Role))
            {
                return BadRequest("Role must be Student or Admin.");
            }

            if (!IsValidEmailForRole(request.Email, request.Role))
            {
                if (request.Role == "Student")
                {
                    return BadRequest("Student email must contain ncit.edu.np");
                }

                return BadRequest("Admin email must contain hod and ncit.edu.np");
            }

            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest("A user with this email already exists.");
            }

            var user = new IdentityUser
            {
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _userManager.AddToRoleAsync(user, request.Role);

            string authUserRole = request.Role;
            if (request.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                authUserRole = "Teacher";
            }

            var authorizedUser = new AuthorizedUser
            {
                Name = string.IsNullOrWhiteSpace(request.Name) ? request.Email.Split('@')[0] : request.Name,
                Email = request.Email,
                Role = authUserRole,
                Semester = request.Semester,
                Section = request.Section,
                Status = "Pending Registration"
            };

            _context.AuthorizedUsers.Add(authorizedUser);
            await _context.SaveChangesAsync();

            var regRequest = new RegistrationRequest
            {
                AuthorizedUserId = authorizedUser.Id,
                Status = "Pending"
            };

            _context.RegistrationRequests.Add(regRequest);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Your registration request has been submitted for admin approval.",
                role = request.Role
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            var passwordResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!passwordResult.Succeeded)
            {
                return Unauthorized("Invalid email or password.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Student";

            if (!role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
            {
                var authUser = await _context.AuthorizedUsers.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (authUser == null || !authUser.Status.Equals("Active", StringComparison.OrdinalIgnoreCase))
                {
                    return Unauthorized("Your account is pending admin approval or you are not authorized to access the system.");
                }
            }

            var token = CreateToken(user, roles);

            return Ok(new
            {
                token,
                email = user.Email,
                id = user.Id,
                role
            });
        }

        private string CreateToken(IdentityUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim("userId", user.Id),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Email!)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static bool IsValidRole(string role)
        {
            return role.Equals("Student", StringComparison.OrdinalIgnoreCase) ||
                   role.Equals("Admin", StringComparison.OrdinalIgnoreCase) ||
                   role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsValidEmailForRole(string email, string role)
        {
            var lowerEmail = email.ToLowerInvariant();

            if (role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
            {
                return true; // Sysadmin can use any email for now, e.g. admin@system.com
            }

            if (role.Equals("Student", StringComparison.OrdinalIgnoreCase))
            {
                return lowerEmail.Contains("ncit.edu.np");
            }

            if (role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                return lowerEmail.Contains("hod") && lowerEmail.Contains("ncit.edu.np");
            }

            return false;
        }
    }
}
