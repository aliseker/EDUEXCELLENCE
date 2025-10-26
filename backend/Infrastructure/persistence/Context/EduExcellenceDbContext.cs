using EduExcellence.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduExcellence.Infrastructure.Persistence.Context
{
    public class EduExcellenceDbContext : DbContext
    {
        public EduExcellenceDbContext(DbContextOptions<EduExcellenceDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<WhatsAppSettings> WhatsAppSettings { get; set; }
        public DbSet<CourseLearningOutcome> CourseLearningOutcomes { get; set; }
        public DbSet<CourseDailyProgram> CourseDailyPrograms { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<Ka2Project> Ka2Projects { get; set; }
        public DbSet<SocialMedia> SocialMedias { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Hero> Heroes { get; set; }
        public DbSet<HeroItem> HeroItems { get; set; }
        public DbSet<Meeting> Meetings { get; set; }
        public DbSet<Dissemination> Disseminations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Admin configuration
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Course configuration
            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Fee).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Duration).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Level).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ImageUrl).HasColumnType("nvarchar(max)");
            });

            // Blog configuration
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Excerpt).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.FullContent).IsRequired();
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Author).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ImageUrl).HasColumnType("nvarchar(max)");
            });

            // Contact configuration
            modelBuilder.Entity<Contact>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Details).IsRequired();
            });

            // ContactMessage configuration
            modelBuilder.Entity<ContactMessage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Subject).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Message).IsRequired();
                entity.Property(e => e.AdminResponse).HasMaxLength(1000);
            });

            // CourseLearningOutcome configuration
            modelBuilder.Entity<CourseLearningOutcome>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Outcome).IsRequired().HasMaxLength(1000);
                entity.HasOne(e => e.Course)
                    .WithMany(c => c.LearningOutcomes)
                    .HasForeignKey(e => e.CourseId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // CourseDailyProgram configuration
            modelBuilder.Entity<CourseDailyProgram>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Program).IsRequired().HasMaxLength(2000);
                entity.HasOne(e => e.Course)
                    .WithMany(c => c.DailyPrograms)
                    .HasForeignKey(e => e.CourseId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // BlogImage configuration
            modelBuilder.Entity<BlogImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImageUrl).IsRequired().HasColumnType("nvarchar(max)");
                entity.Property(e => e.AltText).HasMaxLength(200);
                entity.HasOne(e => e.Blog)
                    .WithMany(b => b.Images)
                    .HasForeignKey(e => e.BlogId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Ka2Project configuration
            modelBuilder.Entity<Ka2Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Coordinator).IsRequired().HasMaxLength(200);
                entity.Property(e => e.PartnerCountries).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Objectives).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Activities).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Results).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.TargetGroup).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Budget).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ImageUrl).HasColumnType("nvarchar(max)");
            });

            // SocialMedia configuration
            modelBuilder.Entity<SocialMedia>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Platform).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Url).IsRequired().HasMaxLength(500);
                entity.Property(e => e.DisplayName).HasMaxLength(100);
                entity.HasIndex(e => e.Platform);
            });

            // Review configuration
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Company).HasMaxLength(100);
                entity.Property(e => e.Position).HasMaxLength(100);
                entity.Property(e => e.ImageUrl).HasColumnType("nvarchar(max)");
                entity.Property(e => e.VideoUrl).HasMaxLength(500);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.IsFeatured);
                entity.HasIndex(e => e.IsApproved);
            });

            // Hero configuration
            modelBuilder.Entity<Hero>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.HasIndex(e => e.IsActive);
            });

            // HeroItem configuration
            modelBuilder.Entity<HeroItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Text).IsRequired().HasMaxLength(200);
                entity.HasOne(e => e.Hero)
                    .WithMany(h => h.Items)
                    .HasForeignKey(e => e.HeroId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Meeting configuration
            modelBuilder.Entity<Meeting>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Images)
                    .HasConversion(
                        v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                        v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
                    )
                    .HasColumnType("nvarchar(max)");
                entity.HasOne(e => e.Ka2Project)
                    .WithMany(k => k.Meetings)
                    .HasForeignKey(e => e.Ka2ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Dissemination configuration
            modelBuilder.Entity<Dissemination>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Images)
                    .HasConversion(
                        v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                        v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
                    )
                    .HasColumnType("nvarchar(max)");
                entity.HasOne(e => e.Ka2Project)
                    .WithMany(k => k.Disseminations)
                    .HasForeignKey(e => e.Ka2ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // WhatsAppSettings configuration
            modelBuilder.Entity<WhatsAppSettings>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.WelcomeMessage).IsRequired().HasMaxLength(500);
                entity.Property(e => e.IsEnabled).IsRequired();
            });

        }
    }
}
