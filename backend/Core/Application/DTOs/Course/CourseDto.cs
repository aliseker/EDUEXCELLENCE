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
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(500, ErrorMessage = "Title cannot exceed 500 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fee is required.")]
        [MaxLength(100, ErrorMessage = "Fee cannot exceed 100 characters.")]
        public string Fee { get; set; } = string.Empty;

        [Required(ErrorMessage = "Duration is required.")]
        [MaxLength(50, ErrorMessage = "Duration cannot exceed 50 characters.")]
        public string Duration { get; set; } = string.Empty;

        [DataType(DataType.Date, ErrorMessage = "Please enter a valid start date.")]
        public DateTime? StartDate { get; set; }

        [DataType(DataType.Date, ErrorMessage = "Please enter a valid end date.")]
        public DateTime? EndDate { get; set; }

        [Required(ErrorMessage = "Location is required.")]
        [MaxLength(100, ErrorMessage = "Location cannot exceed 100 characters.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Level is required.")]
        [MaxLength(50, ErrorMessage = "Level cannot exceed 50 characters.")]
        public string Level { get; set; } = string.Empty;

        [Required(ErrorMessage = "Maximum participants is required.")]
        [Range(1, 1000, ErrorMessage = "Maximum participants must be between 1 and 1000.")]
        public int MaxParticipants { get; set; }

        [Range(0, 1000, ErrorMessage = "Current participants must be between 0 and 1000.")]
        public int CurrentParticipants { get; set; } = 0;

        public bool IsApproved { get; set; } = false;

        [Url(ErrorMessage = "Please enter a valid image URL.")]
        [MaxLength(500, ErrorMessage = "Image URL cannot exceed 500 characters.")]
        public string? ImageUrl { get; set; }

        public List<string> LearningOutcomes { get; set; } = new();
        public List<string> DailyPrograms { get; set; } = new();
    }

    public class UpdateCourseDto : CreateCourseDto
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }
    }
}

