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
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Type { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string PartnerCountries { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Objectives { get; set; } = string.Empty;

        public List<string> Activities { get; set; } = new();
        public List<string> Results { get; set; } = new();

        [Required]
        [MaxLength(200)]
        public string TargetGroup { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Budget { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }

    public class UpdateKa2ProjectDto : CreateKa2ProjectDto
    {
        [Required]
        public int Id { get; set; }
    }
}

