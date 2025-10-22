using AutoMapper;
using EduExcellence.Application.DTOs.Meeting;
using EduExcellence.Domain.Entities;

namespace EduExcellence.Application.Mappings
{
    public class MeetingMappingProfile : Profile
    {
        public MeetingMappingProfile()
        {
            CreateMap<Meeting, MeetingDto>();
            CreateMap<MeetingDto, Meeting>();
        }
    }
}

