using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Application.DTOs.Ka2
{
    public class Ka2ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string PartnerCountries { get; set; } = string.Empty;
        public string Objectives { get; set; } = string.Empty;
        public List<string> Activities { get; set; } = new();
        public List<string> Results { get; set; } = new();
        public string TargetGroup { get; set; } = string.Empty;
        public string Budget { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateKa2ProjectDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(500, ErrorMessage = "Title cannot exceed 500 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Type is required.")]
        [MaxLength(100, ErrorMessage = "Type cannot exceed 100 characters.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Location is required.")]
        [MaxLength(100, ErrorMessage = "Location cannot exceed 100 characters.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Partner countries is required.")]
        [MaxLength(500, ErrorMessage = "Partner countries cannot exceed 500 characters.")]
        public string PartnerCountries { get; set; } = string.Empty;

        [Required(ErrorMessage = "Objectives is required.")]
        public string Objectives { get; set; } = string.Empty;

        public List<string> Activities { get; set; } = new();
        public List<string> Results { get; set; } = new();

        [Required(ErrorMessage = "Target group is required.")]
        [MaxLength(200, ErrorMessage = "Target group cannot exceed 200 characters.")]
        public string TargetGroup { get; set; } = string.Empty;

        [Required(ErrorMessage = "Budget is required.")]
        [MaxLength(100, ErrorMessage = "Budget cannot exceed 100 characters.")]
        public string Budget { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }

    public class UpdateKa2ProjectDto : CreateKa2ProjectDto
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }
    }
}

