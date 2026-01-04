using EduExcellence.Application.DTOs.Ka2;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EduExcellence.Application.Services
{
    public class Ka2Service : IKa2Service
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<Ka2Service> _logger;
        private readonly IHtmlSanitizerService _sanitizer;

        public Ka2Service(IUnitOfWork unitOfWork, ILogger<Ka2Service> logger, IHtmlSanitizerService sanitizer)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _sanitizer = sanitizer;
        }

        public async Task<IEnumerable<Ka2ProjectDto>> GetAllProjectsAsync()
        {
            try
            {
                var projects = await _unitOfWork.Ka2Projects.GetAllAsync();
                return projects.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all KA2 projects");
                throw;
            }
        }

        public async Task<Ka2ProjectDto?> GetProjectByIdAsync(int id)
        {
            try
            {
                var project = await _unitOfWork.Ka2Projects.GetByIdAsync(id);
                return project != null ? MapToDto(project) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting KA2 project with id {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Ka2ProjectDto>> GetProjectsByTypeAsync(string type)
        {
            try
            {
                var projects = await _unitOfWork.Ka2Projects.FindAsync(p => 
                    p.Type.Equals(type, StringComparison.OrdinalIgnoreCase) && p.IsActive);
                return projects.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting KA2 projects by type {Type}", type);
                throw;
            }
        }

        public async Task<IEnumerable<Ka2ProjectDto>> GetActiveProjectsAsync()
        {
            try
            {
                var projects = await _unitOfWork.Ka2Projects.GetAllAsync();
                return projects.Where(p => p.IsActive)
                              .Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active KA2 projects");
                throw;
            }
        }

        public async Task<Ka2ProjectDto> CreateProjectAsync(CreateKa2ProjectDto dto)
        {
            try
            {
                var project = new Ka2Project
                {
                    Title = _sanitizer.SanitizeToPlainText(dto.Title),
                    Description = _sanitizer.SanitizeRichText(dto.Description),
                    Type = _sanitizer.SanitizeToPlainText(dto.Type),
                    Location = _sanitizer.SanitizeToPlainText(dto.Location),
                    PartnerCountries = _sanitizer.SanitizeToPlainText(dto.PartnerCountries),
                    Objectives = _sanitizer.SanitizeRichText(dto.Objectives),
                    Activities = string.Join("|", (dto.Activities ?? new List<string>())
                        .Select(a => _sanitizer.SanitizeToPlainText(a))
                        .Where(a => !string.IsNullOrWhiteSpace(a))),
                    Results = string.Join("|", (dto.Results ?? new List<string>())
                        .Select(r => _sanitizer.SanitizeToPlainText(r))
                        .Where(r => !string.IsNullOrWhiteSpace(r))),
                    TargetGroup = _sanitizer.SanitizeToPlainText(dto.TargetGroup),
                    Budget = _sanitizer.SanitizeToPlainText(dto.Budget),
                    IsActive = dto.IsActive,
                    LogoBase64 = dto.LogoBase64,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Ka2Projects.AddAsync(project);
                await _unitOfWork.SaveChangesAsync();

                return MapToDto(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating KA2 project");
                throw;
            }
        }

        public async Task<Ka2ProjectDto> UpdateProjectAsync(UpdateKa2ProjectDto dto)
        {
            try
            {
                var project = await _unitOfWork.Ka2Projects.GetByIdAsync(dto.Id);
                if (project == null)
                {
                    throw new ArgumentException($"KA2 project with id {dto.Id} not found");
                }

                project.Title = _sanitizer.SanitizeToPlainText(dto.Title);
                project.Description = _sanitizer.SanitizeRichText(dto.Description);
                project.Type = _sanitizer.SanitizeToPlainText(dto.Type);
                project.Location = _sanitizer.SanitizeToPlainText(dto.Location);
                project.PartnerCountries = _sanitizer.SanitizeToPlainText(dto.PartnerCountries);
                project.Objectives = _sanitizer.SanitizeRichText(dto.Objectives);
                project.Activities = string.Join("|", (dto.Activities ?? new List<string>())
                    .Select(a => _sanitizer.SanitizeToPlainText(a))
                    .Where(a => !string.IsNullOrWhiteSpace(a)));
                project.Results = string.Join("|", (dto.Results ?? new List<string>())
                    .Select(r => _sanitizer.SanitizeToPlainText(r))
                    .Where(r => !string.IsNullOrWhiteSpace(r)));
                project.TargetGroup = _sanitizer.SanitizeToPlainText(dto.TargetGroup);
                project.Budget = _sanitizer.SanitizeToPlainText(dto.Budget);
                project.IsActive = dto.IsActive;
                project.LogoBase64 = dto.LogoBase64;
                project.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.Ka2Projects.UpdateAsync(project);
                await _unitOfWork.SaveChangesAsync();

                return MapToDto(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating KA2 project with id {Id}", dto.Id);
                throw;
            }
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            try
            {
                var ka2Project = await _unitOfWork.Ka2Projects.GetByIdAsync(id);
                if (ka2Project == null)
                    return false;

                _unitOfWork.Ka2Projects.Delete(ka2Project);
                await _unitOfWork.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting KA2 project with id {Id}", id);
                throw;
            }
        }

        private static Ka2ProjectDto MapToDto(Ka2Project project)
        {
            return new Ka2ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                Type = project.Type,
                Location = project.Location,
                PartnerCountries = project.PartnerCountries,
                Objectives = project.Objectives,
                Activities = project.Activities.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList(),
                Results = project.Results.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList(),
                TargetGroup = project.TargetGroup,
                Budget = project.Budget,
                IsActive = project.IsActive,
                LogoBase64 = project.LogoBase64,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt
            };
        }
    }
}
