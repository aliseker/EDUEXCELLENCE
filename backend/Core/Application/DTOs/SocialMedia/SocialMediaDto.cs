using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Application.DTOs.SocialMedia
{
    public class SocialMediaDto
    {
        public int Id { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public int Order { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateSocialMediaDto
    {
        [Required(ErrorMessage = "Platform is required.")]
        [MaxLength(50, ErrorMessage = "Platform cannot exceed 50 characters.")]
        public string Platform { get; set; } = string.Empty;

        [Required(ErrorMessage = "URL is required.")]
        [Url(ErrorMessage = "Please enter a valid URL.")]
        [MaxLength(500, ErrorMessage = "URL cannot exceed 500 characters.")]
        public string Url { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Display name cannot exceed 100 characters.")]
        public string? DisplayName { get; set; }

        [Range(0, 1000, ErrorMessage = "Order must be between 0 and 1000.")]
        public int Order { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }

    public class UpdateSocialMediaDto
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Platform is required.")]
        [MaxLength(50, ErrorMessage = "Platform cannot exceed 50 characters.")]
        public string Platform { get; set; } = string.Empty;

        [Required(ErrorMessage = "URL is required.")]
        [Url(ErrorMessage = "Please enter a valid URL.")]
        [MaxLength(500, ErrorMessage = "URL cannot exceed 500 characters.")]
        public string Url { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Display name cannot exceed 100 characters.")]
        public string? DisplayName { get; set; }

        [Range(0, 1000, ErrorMessage = "Order must be between 0 and 1000.")]
        public int Order { get; set; }

        public bool IsActive { get; set; }
    }
}




