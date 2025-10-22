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
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(500, ErrorMessage = "Title cannot exceed 500 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Excerpt is required.")]
        [MaxLength(2000, ErrorMessage = "Excerpt cannot exceed 2000 characters.")]
        public string Excerpt { get; set; } = string.Empty;

        [Required(ErrorMessage = "Full content is required.")]
        public string FullContent { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Category cannot exceed 100 characters.")]
        public string? Category { get; set; } = "General";

        [Required(ErrorMessage = "Type is required.")]
        [MaxLength(50, ErrorMessage = "Type cannot exceed 50 characters.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required.")]
        [MaxLength(100, ErrorMessage = "Author cannot exceed 100 characters.")]
        public string Author { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        [Range(1, 60, ErrorMessage = "Read time must be between 1 and 60 minutes.")]
        public int ReadTime { get; set; } = 5;

        public bool IsFeatured { get; set; } = false;

        [DataType(DataType.DateTime, ErrorMessage = "Please enter a valid publish date.")]
        public DateTime? PublishedAt { get; set; }

        public List<string> Images { get; set; } = new();
    }

    public class UpdateBlogDto : CreateBlogDto
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }
    }
}

