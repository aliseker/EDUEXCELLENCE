using AutoMapper;
using EduExcellence.Application.DTOs.Hero;
using EduExcellence.Domain.Entities;

namespace EduExcellence.Application.Mappings
{
    public class HeroMappingProfile : Profile
    {
        public HeroMappingProfile()
        {
            CreateMap<Hero, HeroDto>();
            CreateMap<HeroItem, HeroItemDto>();
            CreateMap<CreateHeroDto, Hero>();
            CreateMap<CreateHeroItemDto, HeroItem>();
            CreateMap<UpdateHeroDto, Hero>();
            CreateMap<UpdateHeroItemDto, HeroItem>();
        }
    }
}
