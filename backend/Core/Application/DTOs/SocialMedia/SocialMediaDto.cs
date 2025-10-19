namespace EduExcellence.Application.DTOs.SocialMedia
{
    public class SocialMediaDto
    {
        public int Id { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public int Order { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateSocialMediaDto
    {
        public string Platform { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public int Order { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateSocialMediaDto
    {
        public int Id { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public int Order { get; set; }
        public bool IsActive { get; set; }
    }
}



