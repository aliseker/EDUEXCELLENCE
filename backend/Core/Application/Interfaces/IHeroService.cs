using EduExcellence.Application.DTOs.Hero;

namespace EduExcellence.Application.Interfaces
{
    public interface IHeroService
    {
        Task<HeroDto?> GetActiveHeroAsync();
        Task<HeroDto?> GetHeroByIdAsync(int id);
        Task<List<HeroDto>> GetAllHeroesAsync();
        Task<HeroDto> CreateHeroAsync(CreateHeroDto createHeroDto);
        Task<HeroDto> UpdateHeroAsync(UpdateHeroDto updateHeroDto);
        Task<bool> DeleteHeroAsync(int id);
        Task<bool> SetActiveHeroAsync(int id);
    }
}
