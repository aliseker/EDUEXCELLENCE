using EduExcellence.Application.DTOs.Blog;

namespace EduExcellence.Application.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogDto>> GetAllBlogsAsync();
        Task<BlogDto?> GetBlogByIdAsync(int id);
        Task<BlogDto> CreateBlogAsync(CreateBlogDto dto);
        Task<BlogDto> UpdateBlogAsync(UpdateBlogDto dto);
        Task<bool> DeleteBlogAsync(int id);
        Task<IEnumerable<BlogDto>> GetBlogsByTypeAsync(string type);
        Task<IEnumerable<BlogDto>> GetFeaturedBlogsAsync();
        Task<IEnumerable<BlogDto>> GetBlogsByCategoryAsync(string category);
    }
}

