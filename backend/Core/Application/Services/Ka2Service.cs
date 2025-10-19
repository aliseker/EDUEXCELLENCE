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

        public Ka2Service(IUnitOfWork unitOfWork, ILogger<Ka2Service> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
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
                    Title = dto.Title,
                    Description = dto.Description,
                    Type = dto.Type,
                    Location = dto.Location,
                    PartnerCountries = dto.PartnerCountries,
                    Objectives = dto.Objectives,
                    Activities = string.Join("|", dto.Activities),
                    Results = string.Join("|", dto.Results),
                    TargetGroup = dto.TargetGroup,
                    Budget = dto.Budget,
                    IsActive = dto.IsActive,
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

                project.Title = dto.Title;
                project.Description = dto.Description;
                project.Type = dto.Type;
                project.Location = dto.Location;
                project.PartnerCountries = dto.PartnerCountries;
                project.Objectives = dto.Objectives;
                project.Activities = string.Join("|", dto.Activities);
                project.Results = string.Join("|", dto.Results);
                project.TargetGroup = dto.TargetGroup;
                project.Budget = dto.Budget;
                project.IsActive = dto.IsActive;
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
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt
            };
        }
    }
}
