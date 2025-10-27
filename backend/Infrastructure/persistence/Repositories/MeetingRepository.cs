using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using EduExcellence.Infrastructure.Persistence.Context;

namespace EduExcellence.Infrastructure.Persistence.Repositories
{
    public class MeetingRepository : Repository<Meeting>, IMeetingRepository
    {
        public MeetingRepository(EduExcellenceDbContext context) : base(context)
        {
        }
    }
}


















