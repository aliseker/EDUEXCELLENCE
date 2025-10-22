using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Domain.Interfaces
{
    public interface IHeroRepository : IRepository<Hero>
    {
        Task<Hero?> GetActiveHeroAsync();
    }

    public interface IHeroItemRepository : IRepository<HeroItem>
    {
        Task<List<HeroItem>> GetByHeroIdAsync(int heroId);
    }
}
