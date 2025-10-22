using AutoMapper;
using EduExcellence.Application.DTOs.Hero;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Application.Services
{
    public class HeroService : IHeroService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public HeroService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<HeroDto?> GetActiveHeroAsync()
        {
            var hero = await _unitOfWork.HeroRepository.GetActiveHeroAsync();
            return hero != null ? _mapper.Map<HeroDto>(hero) : null;
        }

        public async Task<HeroDto?> GetHeroByIdAsync(int id)
        {
            var hero = await _unitOfWork.HeroRepository.GetByIdAsync(id);
            return hero != null ? _mapper.Map<HeroDto>(hero) : null;
        }

        public async Task<List<HeroDto>> GetAllHeroesAsync()
        {
            var heroes = await _unitOfWork.HeroRepository.GetAllAsync();
            return _mapper.Map<List<HeroDto>>(heroes);
        }

        public async Task<HeroDto> CreateHeroAsync(CreateHeroDto createHeroDto)
        {
            var hero = _mapper.Map<Hero>(createHeroDto);
            
            // Eğer ilk hero ise, otomatik olarak aktif yap
            var existingHeroes = await _unitOfWork.HeroRepository.GetAllAsync();
            if (!existingHeroes.Any())
            {
                hero.IsActive = true;
            }

            await _unitOfWork.HeroRepository.AddAsync(hero);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<HeroDto>(hero);
        }

        public async Task<HeroDto> UpdateHeroAsync(UpdateHeroDto updateHeroDto)
        {
            var existingHero = await _unitOfWork.HeroRepository.GetByIdAsync(updateHeroDto.Id);
            if (existingHero == null)
                throw new ArgumentException("Hero not found");

            // Mevcut items'ları sil
            var existingItems = await _unitOfWork.HeroItemRepository.GetByHeroIdAsync(updateHeroDto.Id);
            foreach (var item in existingItems)
            {
                await _unitOfWork.HeroItemRepository.DeleteAsync(item.Id);
            }

            // Yeni items'ları ekle
            existingHero.Title = updateHeroDto.Title;
            existingHero.Description = updateHeroDto.Description;
            existingHero.Items = _mapper.Map<List<HeroItem>>(updateHeroDto.Items);

            await _unitOfWork.HeroRepository.UpdateAsync(existingHero);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<HeroDto>(existingHero);
        }

        public async Task<bool> DeleteHeroAsync(int id)
        {
            var hero = await _unitOfWork.HeroRepository.GetByIdAsync(id);
            if (hero == null)
                return false;

            await _unitOfWork.HeroRepository.DeleteAsync(hero.Id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetActiveHeroAsync(int id)
        {
            var hero = await _unitOfWork.HeroRepository.GetByIdAsync(id);
            if (hero == null)
                return false;

            // Tüm hero'ları pasif yap
            var allHeroes = await _unitOfWork.HeroRepository.GetAllAsync();
            foreach (var h in allHeroes)
            {
                h.IsActive = false;
                await _unitOfWork.HeroRepository.UpdateAsync(h);
            }

            // Seçilen hero'yu aktif yap
            hero.IsActive = true;
            await _unitOfWork.HeroRepository.UpdateAsync(hero);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
