using EduExcellence.Application.DTOs.SocialMedia;

namespace EduExcellence.Application.Interfaces
{
    public interface ISocialMediaService
    {
        Task<IEnumerable<SocialMediaDto>> GetAllAsync();
        Task<IEnumerable<SocialMediaDto>> GetActiveAsync();
        Task<SocialMediaDto?> GetByIdAsync(int id);
        Task<SocialMediaDto> CreateAsync(CreateSocialMediaDto dto);
        Task<SocialMediaDto> UpdateAsync(UpdateSocialMediaDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ToggleActiveAsync(int id);
    }
}



