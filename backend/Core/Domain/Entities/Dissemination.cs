using EduExcellence.Domain.Entities;

namespace EduExcellence.Domain.Entities
{
    public class Dissemination : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new List<string>();
        public int Ka2ProjectId { get; set; }
        public Ka2Project? Ka2Project { get; set; }
    }
}



