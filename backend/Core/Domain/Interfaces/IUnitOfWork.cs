using EduExcellence.Domain.Entities;

namespace EduExcellence.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Admin> Admins { get; }
        IRepository<Course> Courses { get; }
        IRepository<Blog> Blogs { get; }
        IRepository<Contact> Contacts { get; }
        IRepository<ContactMessage> ContactMessages { get; }
        IRepository<CourseLearningOutcome> CourseLearningOutcomes { get; }
        IRepository<CourseDailyProgram> CourseDailyPrograms { get; }
        IRepository<BlogImage> BlogImages { get; }
        IRepository<Ka2Project> Ka2Projects { get; }
        IRepository<SocialMedia> SocialMediaRepository { get; }
        IRepository<Review> ReviewRepository { get; }
        IHeroRepository HeroRepository { get; }
        IHeroItemRepository HeroItemRepository { get; }
        IMeetingRepository Meetings { get; }
        IDisseminationRepository Disseminations { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
