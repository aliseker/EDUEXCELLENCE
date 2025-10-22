using EduExcellence.Domain.Entities;

namespace EduExcellence.Domain.Entities
{
    public class Ka2Project : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // KA210-VET, KA210-YOU, etc.
        public string Location { get; set; } = string.Empty;
        public string Coordinator { get; set; } = string.Empty;
        public string PartnerCountries { get; set; } = string.Empty;
        public string Objectives { get; set; } = string.Empty;
        public string Activities { get; set; } = string.Empty; // JSON string of activities
        public string Results { get; set; } = string.Empty; // JSON string of results
        public string TargetGroup { get; set; } = string.Empty;
        public string Budget { get; set; } = string.Empty;
        public new bool IsActive { get; set; } = true;
        public string? ImageUrl { get; set; }
        public List<string> Tags { get; set; } = new();
        
        // Navigation property for Meetings
        public ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
    }
}

