using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Application.DTOs.Review
{
    public class ReviewDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content is required.")]
        [MaxLength(1000, ErrorMessage = "Content cannot exceed 1000 characters.")]
        public string Content { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Company cannot exceed 100 characters.")]
        public string? Company { get; set; }

        [MaxLength(100, ErrorMessage = "Position cannot exceed 100 characters.")]
        public string? Position { get; set; }

        [MaxLength(500, ErrorMessage = "Image URL cannot exceed 500 characters.")]
        public string? ImageUrl { get; set; }

        [MaxLength(500, ErrorMessage = "Video URL cannot exceed 500 characters.")]
        public string? VideoUrl { get; set; }

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; } = 5;

        [Required(ErrorMessage = "Type is required.")]
        [MaxLength(50, ErrorMessage = "Type cannot exceed 50 characters.")]
        public string Type { get; set; } = "text";

        public bool IsFeatured { get; set; } = false;

        public bool IsApproved { get; set; } = true;

        public int Order { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateReviewDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content is required.")]
        [MaxLength(1000, ErrorMessage = "Content cannot exceed 1000 characters.")]
        public string Content { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Company cannot exceed 100 characters.")]
        public string? Company { get; set; }

        [MaxLength(100, ErrorMessage = "Position cannot exceed 100 characters.")]
        public string? Position { get; set; }

        [MaxLength(500, ErrorMessage = "Image URL cannot exceed 500 characters.")]
        public string? ImageUrl { get; set; }

        [MaxLength(500, ErrorMessage = "Video URL cannot exceed 500 characters.")]
        public string? VideoUrl { get; set; }

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; } = 5;

        [Required(ErrorMessage = "Type is required.")]
        [MaxLength(50, ErrorMessage = "Type cannot exceed 50 characters.")]
        public string Type { get; set; } = "text";

        public bool IsFeatured { get; set; } = false;

        public bool IsApproved { get; set; } = true;

        public int Order { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }

    public class UpdateReviewDto
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content is required.")]
        [MaxLength(1000, ErrorMessage = "Content cannot exceed 1000 characters.")]
        public string Content { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Company cannot exceed 100 characters.")]
        public string? Company { get; set; }

        [MaxLength(100, ErrorMessage = "Position cannot exceed 100 characters.")]
        public string? Position { get; set; }

        [MaxLength(500, ErrorMessage = "Image URL cannot exceed 500 characters.")]
        public string? ImageUrl { get; set; }

        [MaxLength(500, ErrorMessage = "Video URL cannot exceed 500 characters.")]
        public string? VideoUrl { get; set; }

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; } = 5;

        [Required(ErrorMessage = "Type is required.")]
        [MaxLength(50, ErrorMessage = "Type cannot exceed 50 characters.")]
        public string Type { get; set; } = "text";

        public bool IsFeatured { get; set; } = false;

        public bool IsApproved { get; set; } = true;

        public int Order { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}

































