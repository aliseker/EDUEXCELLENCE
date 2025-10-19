using EduExcellence.Application.DTOs.Ka2;

namespace EduExcellence.Application.Interfaces
{
    public interface IKa2Service
    {
        Task<IEnumerable<Ka2ProjectDto>> GetAllProjectsAsync();
        Task<Ka2ProjectDto?> GetProjectByIdAsync(int id);
        Task<IEnumerable<Ka2ProjectDto>> GetProjectsByTypeAsync(string type);
        Task<IEnumerable<Ka2ProjectDto>> GetActiveProjectsAsync();
        Task<Ka2ProjectDto> CreateProjectAsync(CreateKa2ProjectDto dto);
        Task<Ka2ProjectDto> UpdateProjectAsync(UpdateKa2ProjectDto dto);
        Task<bool> DeleteProjectAsync(int id);
    }
}

