using System.ComponentModel.DataAnnotations;
using EduExcellence.Domain.Common;

namespace EduExcellence.Domain.Entities
{
    public class Review : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Company { get; set; }

        [MaxLength(100)]
        public string? Position { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        [MaxLength(500)]
        public string? VideoUrl { get; set; }

        public int Rating { get; set; } = 5; // 1-5 arası

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = "text"; // "text", "video"

        public bool IsFeatured { get; set; } = false;

        public bool IsApproved { get; set; } = true;

        public int Order { get; set; } = 0;

        public new bool IsActive { get; set; } = true;
    }
}
