using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Domain.Interfaces
{
    public interface IHeroRepository : IRepository<Hero>
    {
        Task<Hero?> GetDisplayedHeroAsync(); // Anasayfada gösterilen hero
    }

    public interface IHeroItemRepository : IRepository<HeroItem>
    {
        Task<List<HeroItem>> GetByHeroIdAsync(int heroId);
    }
}
