using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using EduExcellence.Infrastructure.Persistence.Context;

namespace EduExcellence.Infrastructure.Persistence.Repositories
{
    public class DisseminationRepository : Repository<Dissemination>, IDisseminationRepository
    {
        public DisseminationRepository(EduExcellenceDbContext context) : base(context)
        {
        }
    }
}



