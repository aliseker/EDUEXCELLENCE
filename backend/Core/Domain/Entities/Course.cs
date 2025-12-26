using System.ComponentModel.DataAnnotations;

namespace EduExcellence.Domain.Entities
{
    public class Course : BaseEntity
    {
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
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
        public int MaxParticipants { get; set; }

        public int CurrentParticipants { get; set; } = 0;

        public bool IsApproved { get; set; } = false;

        public string? ImageUrl { get; set; }

        // Navigation properties
        public virtual ICollection<CourseLearningOutcome> LearningOutcomes { get; set; } = new List<CourseLearningOutcome>();
        public virtual ICollection<CourseDailyProgram> DailyPrograms { get; set; } = new List<CourseDailyProgram>();
    }

    public class CourseLearningOutcome : BaseEntity
    {
        [Required]
        public int CourseId { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Outcome { get; set; } = string.Empty;

        public int Order { get; set; }

        // Navigation property
        public virtual Course Course { get; set; } = null!;
    }

    public class CourseDailyProgram : BaseEntity
    {
        [Required]
        public int CourseId { get; set; }

        [Required]
        public int Day { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Program { get; set; } = string.Empty;

        // Navigation property
        public virtual Course Course { get; set; } = null!;
    }
}

