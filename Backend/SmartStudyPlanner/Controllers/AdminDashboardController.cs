using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartStudyPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalStudents = await _context.Students.CountAsync();
            var totalTeachers = await _context.Teachers.CountAsync();
            var totalClasses = await _context.Classes.CountAsync();
            var pendingRegistrations = await _context.RegistrationRequests.CountAsync(r => r.Status == "Pending");
            var activeUsers = await _context.Students.CountAsync(s => s.Status == "Active") + 
                              await _context.Teachers.CountAsync(t => t.Status == "Active");
            var inactiveUsers = await _context.Students.CountAsync(s => s.Status == "Inactive") + 
                                await _context.Teachers.CountAsync(t => t.Status == "Inactive");

            return Ok(new
            {
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                TotalClasses = totalClasses,
                PendingRegistrations = pendingRegistrations,
                ActiveUsers = activeUsers,
                InactiveUsers = inactiveUsers
            });
        }

        [Authorize]
        [HttpGet("teacher-stats")]
        public async Task<IActionResult> GetTeacherStats()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized("Invalid user session");

            // Look up teacher profile
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.Email == email);
            if (teacher == null) return NotFound("Teacher profile not found");

            // Get teacher's classes
            var classIds = await _context.TeacherClasses
                .Where(tc => tc.TeacherId == teacher.Id)
                .Select(tc => tc.ClassId)
                .ToListAsync();

            // Total unique students in teacher's classes
            var totalStudents = await _context.Students
                .Where(s => s.Classes.Any(c => classIds.Contains(c.Id)))
                .CountAsync();

            var totalClasses = classIds.Count;

            var totalAssignments = await _context.Assignments
                .Where(a => classIds.Contains(a.ClassId ?? 0))
                .CountAsync();

            var totalResources = await _context.Resources
                .Where(r => classIds.Contains(r.ClassId ?? 0))
                .CountAsync();

            // Pending submissions (not graded)
            var pendingGrading = await _context.AssignmentSubmissions
                .Include(s => s.Assignment)
                .Where(s => classIds.Contains(s.Assignment.ClassId ?? 0) && s.Status == "Submitted")
                .CountAsync();

            // Recent activity lists
            var recentSubmissions = await _context.AssignmentSubmissions
                .Include(s => s.Assignment)
                .Include(s => s.Student)
                .Where(s => classIds.Contains(s.Assignment.ClassId ?? 0))
                .OrderByDescending(s => s.SubmissionDate)
                .Take(5)
                .Select(s => new {
                    Id = s.Id,
                    Description = $"Student {s.Student.Name} submitted assignment for {s.Assignment.Subject}",
                    Time = GetTimeAgo(s.SubmissionDate)
                })
                .ToListAsync();

            var adminProfile = await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
            var recentResources = new List<object>();
            if (adminProfile != null)
            {
                var resources = await _context.Resources
                    .Where(r => r.AdminId == adminProfile.Id)
                    .OrderByDescending(r => r.Id)
                    .Take(5)
                    .Select(r => new {
                        Id = r.Id,
                        Description = $"Uploaded new resource: {r.Title} ({r.Subject})",
                        Time = "Recently"
                    })
                    .ToListAsync();
                recentResources.AddRange(resources.Cast<object>());
            }

            var activities = recentSubmissions.Cast<object>()
                .Concat(recentResources)
                .Take(6)
                .ToList();

            // Upcoming deadlines
            var upcomingDeadlines = await _context.Assignments
                .Where(a => classIds.Contains(a.ClassId ?? 0) && a.DueDate > DateTime.UtcNow)
                .OrderBy(a => a.DueDate)
                .Take(5)
                .Select(a => new {
                    Id = a.Id,
                    Title = a.Title,
                    Date = a.DueDate.ToString("dd MMM")
                })
                .ToListAsync();

            return Ok(new
            {
                TotalStudents = totalStudents,
                TotalClasses = totalClasses,
                TotalAssignments = totalAssignments,
                TotalResources = totalResources,
                PendingGrading = pendingGrading,
                Activities = activities,
                UpcomingDeadlines = upcomingDeadlines
            });
        }

        private static string GetTimeAgo(DateTime dateTime)
        {
            var span = DateTime.UtcNow - dateTime;
            if (span.TotalMinutes < 1) return "just now";
            if (span.TotalMinutes < 60) return $"{(int)span.TotalMinutes} mins ago";
            if (span.TotalHours < 24) return $"{(int)span.TotalHours} hours ago";
            return $"{(int)span.TotalDays} days ago";
        }
    }
}
