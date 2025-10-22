using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Domain.Entities
{
    public class Blog : BaseEntity
    {
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Excerpt { get; set; } = string.Empty;

        [Required]
        public string FullContent { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Category { get; set; } = "General";

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // news, event, blog, announcement

        [Required]
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public int ReadTime { get; set; } = 5; // in minutes

        public bool IsFeatured { get; set; } = false;

        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<BlogImage> Images { get; set; } = new List<BlogImage>();
    }

    public class BlogImage : BaseEntity
    {
        [Required]
        public int BlogId { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? AltText { get; set; }

        public int Order { get; set; }

        // Navigation property
        public virtual Blog Blog { get; set; } = null!;
    }
}

