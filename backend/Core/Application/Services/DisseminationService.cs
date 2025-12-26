using EduExcellence.Application.DTOs.Dissemination;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Application.Services
{
    public class DisseminationService : IDisseminationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHtmlSanitizerService _sanitizer;

        public DisseminationService(IUnitOfWork unitOfWork, IHtmlSanitizerService sanitizer)
        {
            _unitOfWork = unitOfWork;
            _sanitizer = sanitizer;
        }

        public async Task<IEnumerable<DisseminationDto>> GetDisseminationsByProjectIdAsync(int ka2ProjectId)
        {
            var disseminations = await _unitOfWork.Disseminations.FindAsync(d => d.Ka2ProjectId == ka2ProjectId);
            return disseminations.Select(d => new DisseminationDto
            {
                Id = d.Id,
                Title = d.Title,
                Description = d.Description,
                Images = d.Images ?? new List<string>(),
                Ka2ProjectId = d.Ka2ProjectId,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt,
                IsActive = d.IsActive
            }).OrderByDescending(d => d.CreatedAt);
        }

        public async Task<DisseminationDto?> GetDisseminationByIdAsync(int id)
        {
            var dissemination = await _unitOfWork.Disseminations.GetByIdAsync(id);
            if (dissemination == null) return null;

            return new DisseminationDto
            {
                Id = dissemination.Id,
                Title = dissemination.Title,
                Description = dissemination.Description,
                Images = dissemination.Images ?? new List<string>(),
                Ka2ProjectId = dissemination.Ka2ProjectId,
                CreatedAt = dissemination.CreatedAt,
                UpdatedAt = dissemination.UpdatedAt,
                IsActive = dissemination.IsActive
            };
        }

        public async Task<DisseminationDto> CreateDisseminationAsync(CreateDisseminationDto createDisseminationDto)
        {
            var dissemination = new Domain.Entities.Dissemination
            {
                Title = _sanitizer.SanitizeToPlainText(createDisseminationDto.Title),
                Description = _sanitizer.SanitizeToPlainText(createDisseminationDto.Description),
                Images = createDisseminationDto.Images ?? new List<string>(),
                Ka2ProjectId = createDisseminationDto.Ka2ProjectId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _unitOfWork.Disseminations.AddAsync(dissemination);
            await _unitOfWork.SaveChangesAsync();

            return new DisseminationDto
            {
                Id = dissemination.Id,
                Title = dissemination.Title,
                Description = dissemination.Description,
                Images = dissemination.Images,
                Ka2ProjectId = dissemination.Ka2ProjectId,
                CreatedAt = dissemination.CreatedAt,
                UpdatedAt = dissemination.UpdatedAt,
                IsActive = dissemination.IsActive
            };
        }

        public async Task<DisseminationDto> UpdateDisseminationAsync(UpdateDisseminationDto updateDisseminationDto)
        {
            var dissemination = await _unitOfWork.Disseminations.GetByIdAsync(updateDisseminationDto.Id);
            if (dissemination == null)
                throw new KeyNotFoundException($"Dissemination with ID {updateDisseminationDto.Id} not found");

            dissemination.Title = _sanitizer.SanitizeToPlainText(updateDisseminationDto.Title);
            dissemination.Description = _sanitizer.SanitizeToPlainText(updateDisseminationDto.Description);
            dissemination.Images = updateDisseminationDto.Images ?? new List<string>();
            dissemination.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Disseminations.Update(dissemination);
            await _unitOfWork.SaveChangesAsync();

            return new DisseminationDto
            {
                Id = dissemination.Id,
                Title = dissemination.Title,
                Description = dissemination.Description,
                Images = dissemination.Images,
                Ka2ProjectId = dissemination.Ka2ProjectId,
                CreatedAt = dissemination.CreatedAt,
                UpdatedAt = dissemination.UpdatedAt,
                IsActive = dissemination.IsActive
            };
        }

        public async Task<bool> DeleteDisseminationAsync(int id)
        {
            var dissemination = await _unitOfWork.Disseminations.GetByIdAsync(id);
            if (dissemination == null) return false;

            _unitOfWork.Disseminations.Delete(dissemination);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}



