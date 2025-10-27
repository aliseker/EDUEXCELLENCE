using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Domain.Entities
{
    public class Admin : BaseEntity
    {
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public bool IsSuperAdmin { get; set; } = false;
        public DateTime? LastLoginAt { get; set; }

        // Password Reset Fields
        [MaxLength(500)]
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiresAt { get; set; }
        public bool PasswordResetTokenUsed { get; set; } = false;
        public DateTime? TokensValidFrom { get; set; }
    }
}

