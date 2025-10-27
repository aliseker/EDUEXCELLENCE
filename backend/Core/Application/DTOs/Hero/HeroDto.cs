using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Application.DTOs.Hero
{
    public class HeroDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<HeroItemDto> Items { get; set; } = new List<HeroItemDto>();
        public bool IsDisplayedOnHomepage { get; set; } // Anasayfada gösteriliyor mu?
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class HeroItemDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int HeroId { get; set; }
    }

    public class CreateHeroDto : IValidatableObject
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters.")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "At least one item is required.")]
        [MinLength(1, ErrorMessage = "At least one item is required.")]
        public List<CreateHeroItemDto> Items { get; set; } = new List<CreateHeroItemDto>();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Items == null || Items.Count == 0)
            {
                yield return new ValidationResult(
                    "At least one hero item is required.",
                    new[] { nameof(Items) }
                );
            }

            if (Items != null && Items.Count > 10)
            {
                yield return new ValidationResult(
                    "Maximum 10 hero items are allowed.",
                    new[] { nameof(Items) }
                );
            }
        }
    }

    public class CreateHeroItemDto
    {
        [Required(ErrorMessage = "Item text is required.")]
        [MaxLength(500, ErrorMessage = "Item text cannot exceed 500 characters.")]
        [MinLength(1, ErrorMessage = "Item text cannot be empty.")]
        public string Text { get; set; } = string.Empty;
    }

    public class UpdateHeroDto : IValidatableObject
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters.")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "At least one item is required.")]
        [MinLength(1, ErrorMessage = "At least one item is required.")]
        public List<UpdateHeroItemDto> Items { get; set; } = new List<UpdateHeroItemDto>();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Items == null || Items.Count == 0)
            {
                yield return new ValidationResult(
                    "At least one hero item is required.",
                    new[] { nameof(Items) }
                );
            }

            if (Items != null && Items.Count > 10)
            {
                yield return new ValidationResult(
                    "Maximum 10 hero items are allowed.",
                    new[] { nameof(Items) }
                );
            }
        }
    }

    public class UpdateHeroItemDto
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Item text is required.")]
        [MaxLength(500, ErrorMessage = "Item text cannot exceed 500 characters.")]
        [MinLength(1, ErrorMessage = "Item text cannot be empty.")]
        public string Text { get; set; } = string.Empty;
    }
}
