using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Application.DTOs.Course
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Fee { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public bool IsApproved { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> LearningOutcomes { get; set; } = new();
        public List<string> DailyPrograms { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateCourseDto
    {
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Fee { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Duration { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Level { get; set; } = string.Empty;

        [Required]
        [Range(1, 1000)]
        public int MaxParticipants { get; set; }

        public int CurrentParticipants { get; set; } = 0;

        public bool IsApproved { get; set; } = false;

        public string? ImageUrl { get; set; }

        public List<string> LearningOutcomes { get; set; } = new();
        public List<string> DailyPrograms { get; set; } = new();
    }

    public class UpdateCourseDto : CreateCourseDto
    {
        [Required]
        public int Id { get; set; }
    }
}

