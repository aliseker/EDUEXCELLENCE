using EduExcellence.Application.DTOs.SocialMedia;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EduExcellence.Application.Services
{
    public class SocialMediaService : ISocialMediaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<SocialMediaService> _logger;

        public SocialMediaService(IUnitOfWork unitOfWork, ILogger<SocialMediaService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<IEnumerable<SocialMediaDto>> GetAllAsync()
        {
            try
            {
                var socialMedias = await _unitOfWork.SocialMediaRepository.GetAllAsync();
                return socialMedias.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all social media links");
                throw;
            }
        }

        public async Task<IEnumerable<SocialMediaDto>> GetActiveAsync()
        {
            try
            {
                var socialMedias = await _unitOfWork.SocialMediaRepository.GetAllAsync();
                return socialMedias
                    .Where(sm => sm.IsActive)
                    .OrderBy(sm => sm.Order)
                    .Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active social media links");
                throw;
            }
        }

        public async Task<SocialMediaDto?> GetByIdAsync(int id)
        {
            try
            {
                var socialMedia = await _unitOfWork.SocialMediaRepository.GetByIdAsync(id);
                return socialMedia != null ? MapToDto(socialMedia) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting social media by id {Id}", id);
                throw;
            }
        }

        public async Task<SocialMediaDto> CreateAsync(CreateSocialMediaDto dto)
        {
            try
            {
                var socialMedia = new SocialMedia
                {
                    Platform = dto.Platform.ToLower(),
                    Url = dto.Url,
                    DisplayName = dto.DisplayName,
                    Order = dto.Order,
                    IsActive = dto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _unitOfWork.SocialMediaRepository.AddAsync(socialMedia);
                await _unitOfWork.SaveChangesAsync();

                return MapToDto(socialMedia);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating social media link");
                throw;
            }
        }

        public async Task<SocialMediaDto> UpdateAsync(UpdateSocialMediaDto dto)
        {
            try
            {
                var socialMedia = await _unitOfWork.SocialMediaRepository.GetByIdAsync(dto.Id);
                if (socialMedia == null)
                    throw new ArgumentException("Social media link not found");

                socialMedia.Platform = dto.Platform.ToLower();
                socialMedia.Url = dto.Url;
                socialMedia.DisplayName = dto.DisplayName;
                socialMedia.Order = dto.Order;
                socialMedia.IsActive = dto.IsActive;
                socialMedia.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.SocialMediaRepository.Update(socialMedia);
                await _unitOfWork.SaveChangesAsync();

                return MapToDto(socialMedia);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating social media link {Id}", dto.Id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var socialMedia = await _unitOfWork.SocialMediaRepository.GetByIdAsync(id);
                if (socialMedia == null)
                    return false;

                _unitOfWork.SocialMediaRepository.Delete(socialMedia);
                await _unitOfWork.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting social media link {Id}", id);
                throw;
            }
        }

        public async Task<bool> ToggleActiveAsync(int id)
        {
            try
            {
                var socialMedia = await _unitOfWork.SocialMediaRepository.GetByIdAsync(id);
                if (socialMedia == null)
                    return false;

                socialMedia.IsActive = !socialMedia.IsActive;
                socialMedia.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.SocialMediaRepository.Update(socialMedia);
                await _unitOfWork.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling active status for social media link {Id}", id);
                throw;
            }
        }

        private static SocialMediaDto MapToDto(SocialMedia socialMedia)
        {
            return new SocialMediaDto
            {
                Id = socialMedia.Id,
                Platform = socialMedia.Platform,
                Url = socialMedia.Url,
                DisplayName = socialMedia.DisplayName,
                Order = socialMedia.Order,
                IsActive = socialMedia.IsActive,
                CreatedAt = socialMedia.CreatedAt,
                UpdatedAt = socialMedia.UpdatedAt ?? DateTime.UtcNow
            };
        }
    }
}
