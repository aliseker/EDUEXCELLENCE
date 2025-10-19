using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Domain.Entities
{
    public class SocialMedia : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Platform { get; set; } = string.Empty; // instagram, facebook, twitter, linkedin, youtube, etc.

        [Required]
        [MaxLength(500)]
        public string Url { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? DisplayName { get; set; } // Optional custom display name

        public int Order { get; set; } = 0;

        public new bool IsActive { get; set; } = true;
    }
}
