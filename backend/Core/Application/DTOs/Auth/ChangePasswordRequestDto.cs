using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace EduExcellence.Application.DTOs.Auth
{
    public class ChangePasswordRequestDto
    {
        [Required(ErrorMessage = "Current password is required")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "New password is required")]
        [MinLength(8, ErrorMessage = "New password must be at least 8 characters long")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", 
            ErrorMessage = "New password must contain at least one uppercase letter, one lowercase letter, and one number")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirm password is required")]
        [Compare(nameof(NewPassword), ErrorMessage = "Confirm password does not match new password")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
