using AutoMapper;
using EduExcellence.Application.DTOs.Meeting;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Application.Services
{
    public class MeetingService : IMeetingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MeetingService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MeetingDto>> GetMeetingsByProjectIdAsync(int ka2ProjectId)
        {
            var meetings = await _unitOfWork.Meetings.FindAsync(m => m.Ka2ProjectId == ka2ProjectId);
            var meetingDtos = _mapper.Map<IEnumerable<MeetingDto>>(meetings);
            return meetingDtos.OrderByDescending(m => m.CreatedAt);
        }

        public async Task<MeetingDto?> GetMeetingByIdAsync(int id)
        {
            var meeting = await _unitOfWork.Meetings.GetByIdAsync(id);
            if (meeting == null) return null;

            return _mapper.Map<MeetingDto>(meeting);
        }

        public async Task<MeetingDto> CreateMeetingAsync(MeetingDto meetingDto)
        {
            var meeting = _mapper.Map<Domain.Entities.Meeting>(meetingDto);
            meeting.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.Meetings.AddAsync(meeting);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<MeetingDto>(meeting);
        }

        public async Task<MeetingDto> UpdateMeetingAsync(MeetingDto meetingDto)
        {
            var meeting = await _unitOfWork.Meetings.GetByIdAsync(meetingDto.Id);
            if (meeting == null)
                throw new KeyNotFoundException($"Meeting with ID {meetingDto.Id} not found");

            _mapper.Map(meetingDto, meeting);
            meeting.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Meetings.Update(meeting);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<MeetingDto>(meeting);
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

