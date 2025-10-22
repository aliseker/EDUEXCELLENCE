using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using EduExcellence.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace EduExcellence.Infrastructure.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly EduExcellenceDbContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(EduExcellenceDbContext context)
        {
            _context = context;
            Admins = new Repository<Admin>(_context);
            Courses = new Repository<Course>(_context);
            Blogs = new Repository<Blog>(_context);
            Contacts = new Repository<Contact>(_context);
            ContactMessages = new Repository<ContactMessage>(_context);
            CourseLearningOutcomes = new Repository<CourseLearningOutcome>(_context);
            CourseDailyPrograms = new Repository<CourseDailyProgram>(_context);
            BlogImages = new Repository<BlogImage>(_context);
            Ka2Projects = new Repository<Ka2Project>(_context);
            SocialMediaRepository = new Repository<SocialMedia>(_context);
            ReviewRepository = new Repository<Review>(_context);
            HeroRepository = new HeroRepository(_context);
            HeroItemRepository = new HeroItemRepository(_context);
            Meetings = new MeetingRepository(_context);
        }

        public IRepository<Admin> Admins { get; }
        public IRepository<Course> Courses { get; }
        public IRepository<Blog> Blogs { get; }
        public IRepository<Contact> Contacts { get; }
        public IRepository<ContactMessage> ContactMessages { get; }
        public IRepository<CourseLearningOutcome> CourseLearningOutcomes { get; }
        public IRepository<CourseDailyProgram> CourseDailyPrograms { get; }
        public IRepository<BlogImage> BlogImages { get; }
        public IRepository<Ka2Project> Ka2Projects { get; }
        public IRepository<SocialMedia> SocialMediaRepository { get; }
        public IRepository<Review> ReviewRepository { get; }
        public IHeroRepository HeroRepository { get; }
        public IHeroItemRepository HeroItemRepository { get; }
        public IMeetingRepository Meetings { get; }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
