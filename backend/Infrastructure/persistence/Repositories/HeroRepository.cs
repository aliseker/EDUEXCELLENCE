using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using EduExcellence.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EduExcellence.Infrastructure.Persistence.Repositories
{
    public class HeroRepository : Repository<Hero>, IHeroRepository
    {
        public HeroRepository(EduExcellenceDbContext context) : base(context)
        {
        }

        // Override GetByIdAsync to include Items
        public override async Task<Hero?> GetByIdAsync(int id)
        {
            return await _context.Heroes
                .Include(h => h.Items)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        // Override GetAllAsync to include Items
        public override async Task<IEnumerable<Hero>> GetAllAsync()
        {
            return await _context.Heroes
                .Include(h => h.Items)
                .Where(h => h.IsActive)
                .ToListAsync();
        }

        public async Task<Hero?> GetDisplayedHeroAsync()
        {
            return await _context.Heroes
                .Include(h => h.Items)
                .FirstOrDefaultAsync(h => h.IsActive && h.IsDisplayedOnHomepage);
        }
    }

    public class HeroItemRepository : Repository<HeroItem>, IHeroItemRepository
    {
        public HeroItemRepository(EduExcellenceDbContext context) : base(context)
        {
        }

        public async Task<List<HeroItem>> GetByHeroIdAsync(int heroId)
        {
            return await _context.HeroItems
                .Where(hi => hi.HeroId == heroId)
                .ToListAsync();
        }
    }
}
