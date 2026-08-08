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

        [HttpGet("setup-status")]
        public async Task<IActionResult> GetSetupStatus()
        {
            var sysadmins = await _userManager.GetUsersInRoleAsync("Sysadmin");
            var hasAdmin = sysadmins.Any();
            var school = await _context.Set<SchoolSetting>().FirstOrDefaultAsync();

            return Ok(new
            {
                hasAdmin,
                schoolName = school?.Name,
                schoolAddress = school?.Address
            });
        }

        [HttpPost("setup")]
        public async Task<IActionResult> Setup([FromBody] SetupRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.ConfirmPassword) ||
                string.IsNullOrWhiteSpace(request.SchoolName))
            {
                return BadRequest("Email, password, confirm password, and school name are required.");
            }

            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest("Password and confirm password do not match.");
            }

            if (!IsValidEmailForRole(request.Email, "Sysadmin"))
            {
                return BadRequest("Admin email must be in the pattern hod.department@ncit.edu.np (e.g. hod.software@ncit.edu.np)");
            }

            var sysadmins = await _userManager.GetUsersInRoleAsync("Sysadmin");
            if (sysadmins.Any())
            {
                return BadRequest("Administrator already exists.");
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

            await _userManager.AddToRoleAsync(user, "Sysadmin");

            var schoolSetting = new SchoolSetting
            {
                Name = request.SchoolName,
                Address = request.SchoolAddress ?? string.Empty
            };

            _context.Add(schoolSetting);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Administrator account and school details have been created successfully."
            });
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
                return BadRequest("Role must be Student, Admin, or Sysadmin.");
            }

            var existingSysadmins = await _userManager.GetUsersInRoleAsync("Sysadmin");
            if (!existingSysadmins.Any() && !request.Role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("No administrator exists yet. Please create the administrator account first.");
            }

            if (!IsValidEmailForRole(request.Email, request.Role))
            {
                if (request.Role.Equals("Student", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("Student email must contain ncit.edu.np");
                }
                if (request.Role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("Admin email must be in the pattern hod.department@ncit.edu.np (e.g. hod.software@ncit.edu.np)");
                }

                return BadRequest("Teacher email must include name.surname and end with @ncit.edu.np");
            }

            if (request.Role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
            {
                var sysadmins = await _userManager.GetUsersInRoleAsync("Sysadmin");
                if (sysadmins.Any())
                {
                    return BadRequest("An Administrator is already registered. Only one Administrator is allowed.");
                }

                return BadRequest("Please create the administrator account through the first-time setup page.");
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
                Status = request.Role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase) ? "Active" : "Pending Registration"
            };

            _context.AuthorizedUsers.Add(authorizedUser);
            await _context.SaveChangesAsync();

            if (!request.Role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
            {
                var regRequest = new RegistrationRequest
                {
                    AuthorizedUserId = authorizedUser.Id,
                    Status = "Pending"
                };

                _context.RegistrationRequests.Add(regRequest);
                await _context.SaveChangesAsync();
            }

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

            if (role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
            {
                var sysadmins = await _userManager.GetUsersInRoleAsync("Sysadmin");
                var primarySysadmin = sysadmins.OrderBy(u => u.Id).FirstOrDefault();
                if (primarySysadmin == null || primarySysadmin.Id != user.Id)
                {
                    return Unauthorized("Only one Administrator is allowed to login.");
                }
            }
            else
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
            var lowerEmail = email.ToLowerInvariant().Trim();

            if (role.Equals("Sysadmin", StringComparison.OrdinalIgnoreCase))
            {
                return System.Text.RegularExpressions.Regex.IsMatch(lowerEmail, @"^hod\.[a-z0-9_.-]+@ncit\.edu\.np$");
            }

            if (role.Equals("Student", StringComparison.OrdinalIgnoreCase))
            {
                return lowerEmail.EndsWith("@ncit.edu.np");
            }

            if (role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                var parts = lowerEmail.Split('@');
                if (parts.Length != 2 || parts[1] != "ncit.edu.np") return false;
                var localPart = parts[0];
                return localPart.Contains('.') && !localPart.StartsWith('.') && !localPart.EndsWith('.') && localPart.Split('.').Length >= 2;
            }

            return false;
        }
    }
}
