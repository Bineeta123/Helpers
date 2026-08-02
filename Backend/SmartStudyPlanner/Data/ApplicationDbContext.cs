using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartStudyPlanner.Models;

namespace SmartStudyPlanner
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Assignments> Assignments { get; set; }
        public DbSet<Resources> Resources { get; set; }
        public DbSet<Admin> Admins { get; set; }  
        
        // Admin Module Models
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<AuthorizedUser> AuthorizedUsers { get; set; }
        public DbSet<RegistrationRequest> RegistrationRequests { get; set; }
        public DbSet<SchoolSetting> SchoolSettings { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<TeacherClass> TeacherClasses { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<AcademicYear> AcademicYears { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<AssignmentSubmission> AssignmentSubmissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Assignments>()
                .Property(a => a.CreatedById)
                .IsRequired();

            modelBuilder.Entity<Resources>()
               .HasOne(r => r.Admin)
               .WithMany(a => a.Resources)
               .HasForeignKey(r => r.AdminId);

            // Configure many-to-many relationship for Teacher-Class
            modelBuilder.Entity<TeacherClass>()
                .HasKey(tc => new { tc.TeacherId, tc.ClassId });

            modelBuilder.Entity<TeacherClass>()
                .HasOne(tc => tc.Teacher)
                .WithMany(t => t.TeacherClasses)
                .HasForeignKey(tc => tc.TeacherId);

            modelBuilder.Entity<TeacherClass>()
                .HasOne(tc => tc.Class)
                .WithMany(c => c.TeacherClasses)
                .HasForeignKey(tc => tc.ClassId);

            // Configure many-to-many relationship for Class-Student
            modelBuilder.Entity<Class>()
                .HasMany(c => c.Students)
                .WithMany(s => s.Classes);
                
            modelBuilder.Entity<AuthorizedUser>()
                .HasOne(au => au.Department)
                .WithMany()
                .HasForeignKey(au => au.DepartmentId);
        }
    }
}
