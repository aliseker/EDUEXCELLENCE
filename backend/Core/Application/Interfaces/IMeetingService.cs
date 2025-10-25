using EduExcellence.Application.DTOs.Meeting;

namespace EduExcellence.Application.Interfaces
{
    public interface IMeetingService
    {
        Task<IEnumerable<MeetingDto>> GetMeetingsByProjectIdAsync(int ka2ProjectId);
        Task<MeetingDto?> GetMeetingByIdAsync(int id);
        Task<MeetingDto> CreateMeetingAsync(CreateMeetingDto createMeetingDto);
        Task<MeetingDto> UpdateMeetingAsync(UpdateMeetingDto updateMeetingDto);
        Task<bool> DeleteMeetingAsync(int id);
    }
}



