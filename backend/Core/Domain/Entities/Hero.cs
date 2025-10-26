using System.ComponentModel.DataAnnotations;
using EduExcellence.Domain.Common;

namespace EduExcellence.Domain.Entities
{
    public class Hero : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public List<HeroItem> Items { get; set; } = new List<HeroItem>();
        
        // Anasayfada gösterilip gösterilmeyeceğini kontrol eder (sadece 1 tane true olabilir)
        public bool IsDisplayedOnHomepage { get; set; } = false;
        
        // BaseEntity'deki IsActive soft delete için kullanılır (true = aktif, false = silinmiş)
    }

    public class HeroItem : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Text { get; set; } = string.Empty;

        [Required]
        public int HeroId { get; set; }
        public Hero Hero { get; set; } = null!;
    }
}
