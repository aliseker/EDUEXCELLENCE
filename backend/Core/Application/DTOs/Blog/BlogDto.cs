using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Application.DTOs.Blog
{
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string FullContent { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int ReadTime { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime PublishedAt { get; set; }
        public List<string> Images { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateBlogDto
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
        public string Type { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;

        [MaxLength(500000)]
        public string? ImageUrl { get; set; }

        [Range(1, 60)]
        public int ReadTime { get; set; } = 5;

        public bool IsFeatured { get; set; } = false;

        public DateTime? PublishedAt { get; set; }

        public List<string> Images { get; set; } = new();
    }

    public class UpdateBlogDto : CreateBlogDto
    {
        [Required]
        public int Id { get; set; }
    }
}

