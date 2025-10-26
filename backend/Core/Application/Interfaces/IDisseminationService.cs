using EduExcellence.Application.DTOs.Dissemination;

namespace EduExcellence.Application.Interfaces
{
    public interface IDisseminationService
    {
        Task<IEnumerable<DisseminationDto>> GetDisseminationsByProjectIdAsync(int ka2ProjectId);
        Task<DisseminationDto?> GetDisseminationByIdAsync(int id);
        Task<DisseminationDto> CreateDisseminationAsync(CreateDisseminationDto createDisseminationDto);
        Task<DisseminationDto> UpdateDisseminationAsync(UpdateDisseminationDto updateDisseminationDto);
        Task<bool> DeleteDisseminationAsync(int id);
    }
}



