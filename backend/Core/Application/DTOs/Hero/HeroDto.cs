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

    public class CreateHeroDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<CreateHeroItemDto> Items { get; set; } = new List<CreateHeroItemDto>();
        // IsDisplayedOnHomepage backend'de otomatik false set edilir
    }

    public class CreateHeroItemDto
    {
        public string Text { get; set; } = string.Empty;
    }

    public class UpdateHeroDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<UpdateHeroItemDto> Items { get; set; } = new List<UpdateHeroItemDto>();
    }

    public class UpdateHeroItemDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
