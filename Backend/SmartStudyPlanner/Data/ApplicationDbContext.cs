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
        }
    }
}