using EduExcellence.Application.DTOs.Meeting;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Application.Services
{
    public class MeetingService : IMeetingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MeetingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MeetingDto>> GetMeetingsByProjectIdAsync(int ka2ProjectId)
        {
            var meetings = await _unitOfWork.Meetings.FindAsync(m => m.Ka2ProjectId == ka2ProjectId);
            return meetings.Select(m => new MeetingDto
            {
                Id = m.Id,
                Title = m.Title,
                Description = m.Description,
                Images = m.Images ?? new List<string>(),
                Ka2ProjectId = m.Ka2ProjectId,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                IsActive = m.IsActive
            }).OrderByDescending(m => m.CreatedAt);
        }

        public async Task<MeetingDto?> GetMeetingByIdAsync(int id)
        {
            var meeting = await _unitOfWork.Meetings.GetByIdAsync(id);
            if (meeting == null) return null;

            return new MeetingDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                Images = meeting.Images ?? new List<string>(),
                Ka2ProjectId = meeting.Ka2ProjectId,
                CreatedAt = meeting.CreatedAt,
                UpdatedAt = meeting.UpdatedAt,
                IsActive = meeting.IsActive
            };
        }

        public async Task<MeetingDto> CreateMeetingAsync(CreateMeetingDto createMeetingDto)
        {
            var meeting = new Domain.Entities.Meeting
            {
                Title = createMeetingDto.Title,
                Description = createMeetingDto.Description,
                Images = createMeetingDto.Images ?? new List<string>(),
                Ka2ProjectId = createMeetingDto.Ka2ProjectId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _unitOfWork.Meetings.AddAsync(meeting);
            await _unitOfWork.SaveChangesAsync();

            return new MeetingDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                Images = meeting.Images,
                Ka2ProjectId = meeting.Ka2ProjectId,
                CreatedAt = meeting.CreatedAt,
                UpdatedAt = meeting.UpdatedAt,
                IsActive = meeting.IsActive
            };
        }

        public async Task<MeetingDto> UpdateMeetingAsync(UpdateMeetingDto updateMeetingDto)
        {
            var meeting = await _unitOfWork.Meetings.GetByIdAsync(updateMeetingDto.Id);
            if (meeting == null)
                throw new KeyNotFoundException($"Meeting with ID {updateMeetingDto.Id} not found");

            meeting.Title = updateMeetingDto.Title;
            meeting.Description = updateMeetingDto.Description;
            meeting.Images = updateMeetingDto.Images ?? new List<string>();
            meeting.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Meetings.Update(meeting);
            await _unitOfWork.SaveChangesAsync();

            return new MeetingDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                Images = meeting.Images,
                Ka2ProjectId = meeting.Ka2ProjectId,
                CreatedAt = meeting.CreatedAt,
                UpdatedAt = meeting.UpdatedAt,
                IsActive = meeting.IsActive
            };
        }

        public async Task<bool> DeleteMeetingAsync(int id)
        {
            var meeting = await _unitOfWork.Meetings.GetByIdAsync(id);
            if (meeting == null) return false;

            _unitOfWork.Meetings.Delete(meeting);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}

