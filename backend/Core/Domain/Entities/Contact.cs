using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Domain.Entities
{
    public class Contact : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // address, phone, email, social

        [Required]
        public string Details { get; set; } = string.Empty; // JSON string for multiple details

        public int Order { get; set; } = 0;

        public bool IsPrimary { get; set; } = false;
    }

    public class ContactMessage : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required]
        [MaxLength(500)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime? ReadAt { get; set; }

        [MaxLength(1000)]
        public string? AdminResponse { get; set; }

        public DateTime? RespondedAt { get; set; }
    }
}

