using EduExcellence.Application.DTOs.Blog;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Application.Services
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHtmlSanitizerService _sanitizer;

        public BlogService(IUnitOfWork unitOfWork, IHtmlSanitizerService sanitizer)
        {
            _unitOfWork = unitOfWork;
            _sanitizer = sanitizer;
        }

        public async Task<IEnumerable<BlogDto>> GetAllBlogsAsync()
        {
            var blogs = await _unitOfWork.Blogs.GetAllAsync();
            var blogDtos = new List<BlogDto>();
            
            foreach (var blog in blogs)
            {
                var blogImages = await _unitOfWork.BlogImages.FindAsync(bi => bi.BlogId == blog.Id);
                blog.Images = blogImages.ToList();
                blogDtos.Add(MapToDto(blog));
            }
            
            return blogDtos;
        }

        public async Task<BlogDto?> GetBlogByIdAsync(int id)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog == null) return null;

            var blogImages = await _unitOfWork.BlogImages.FindAsync(bi => bi.BlogId == blog.Id);
            blog.Images = blogImages.ToList();

            return MapToDto(blog);
        }

        public async Task<BlogDto> CreateBlogAsync(CreateBlogDto dto)
        {
            try
            {
                var blog = new Blog
                {
                    Title = _sanitizer.SanitizeToPlainText(dto.Title),
                    Excerpt = _sanitizer.SanitizeToPlainText(dto.Excerpt),
                    FullContent = _sanitizer.SanitizeRichText(dto.FullContent),
                    Category = _sanitizer.SanitizeToPlainText(dto.Category ?? "General"),
                    Type = _sanitizer.SanitizeToPlainText(dto.Type),
                    Author = _sanitizer.SanitizeToPlainText(dto.Author),
                    ImageUrl = _sanitizer.SanitizeToPlainText(dto.ImageUrl),
                    ReadTime = dto.ReadTime,
                    IsFeatured = dto.IsFeatured,
                    PublishedAt = dto.PublishedAt ?? DateTime.UtcNow
                };

                await _unitOfWork.Blogs.AddAsync(blog);
                await _unitOfWork.SaveChangesAsync();

                // Add images if any
                if (dto.Images != null && dto.Images.Count > 0)
                {
                    for (int i = 0; i < dto.Images.Count; i++)
                    {
                        // Skip empty or null image URLs
                        var safeUrl = _sanitizer.SanitizeToPlainText(dto.Images[i]);
                        if (!string.IsNullOrWhiteSpace(safeUrl))
                        {
                            var blogImage = new BlogImage
                            {
                                BlogId = blog.Id,
                                ImageUrl = safeUrl,
                                Order = i + 1
                            };
                            await _unitOfWork.BlogImages.AddAsync(blogImage);
                        }
                    }
                    await _unitOfWork.SaveChangesAsync();
                }

                // Reload blog with images
                var createdBlog = await _unitOfWork.Blogs.GetByIdAsync(blog.Id);
                var blogImages = await _unitOfWork.BlogImages.FindAsync(bi => bi.BlogId == blog.Id);
                if (createdBlog != null)
                {
                    createdBlog.Images = blogImages.ToList();
                }

                return MapToDto(createdBlog ?? blog);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating blog: {ex.Message}. Inner exception: {ex.InnerException?.Message}. Stack trace: {ex.StackTrace}", ex);
            }
        }

        public async Task<BlogDto> UpdateBlogAsync(UpdateBlogDto dto)
        {
            try
            {
                var blog = await _unitOfWork.Blogs.GetByIdAsync(dto.Id);
                if (blog == null)
                    throw new ArgumentException("Blog not found");

                blog.Title = _sanitizer.SanitizeToPlainText(dto.Title);
                blog.Excerpt = _sanitizer.SanitizeToPlainText(dto.Excerpt);
                blog.FullContent = _sanitizer.SanitizeRichText(dto.FullContent);
                blog.Category = _sanitizer.SanitizeToPlainText(dto.Category ?? "General");
                blog.Type = _sanitizer.SanitizeToPlainText(dto.Type);
                blog.Author = _sanitizer.SanitizeToPlainText(dto.Author);
                blog.ImageUrl = _sanitizer.SanitizeToPlainText(dto.ImageUrl);
                blog.ReadTime = dto.ReadTime;
                blog.IsFeatured = dto.IsFeatured;
                blog.PublishedAt = dto.PublishedAt ?? blog.PublishedAt;

                await _unitOfWork.Blogs.UpdateAsync(blog);

                // Update images
                var existingImages = await _unitOfWork.BlogImages.FindAsync(bi => bi.BlogId == blog.Id);
                foreach (var existing in existingImages)
                {
                    await _unitOfWork.BlogImages.DeleteAsync(existing.Id);
                }

                // Add new images if any
                if (dto.Images != null && dto.Images.Count > 0)
                {
                    for (int i = 0; i < dto.Images.Count; i++)
                    {
                        // Skip empty or null image URLs
                        var safeUrl = _sanitizer.SanitizeToPlainText(dto.Images[i]);
                        if (!string.IsNullOrWhiteSpace(safeUrl))
                        {
                            var blogImage = new BlogImage
                            {
                                BlogId = blog.Id,
                                ImageUrl = safeUrl,
                                Order = i + 1
                            };
                            await _unitOfWork.BlogImages.AddAsync(blogImage);
                        }
                    }
                }

                await _unitOfWork.SaveChangesAsync();

                // Reload blog with images
                var updatedBlog = await _unitOfWork.Blogs.GetByIdAsync(blog.Id);
                var blogImages = await _unitOfWork.BlogImages.FindAsync(bi => bi.BlogId == blog.Id);
                if (updatedBlog != null)
                {
                    updatedBlog.Images = blogImages.ToList();
                }

                return MapToDto(updatedBlog ?? blog);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating blog: {ex.Message}", ex);
            }
        }

        public async Task<bool> DeleteBlogAsync(int id)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog == null) return false;

            await _unitOfWork.Blogs.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BlogDto>> GetBlogsByTypeAsync(string type)
        {
            var blogs = await _unitOfWork.Blogs.FindAsync(b => b.Type == type && b.IsActive);
            return blogs.Select(MapToDto);
        }

        public async Task<IEnumerable<BlogDto>> GetFeaturedBlogsAsync()
        {
            var blogs = await _unitOfWork.Blogs.FindAsync(b => b.IsFeatured && b.IsActive);
            return blogs.Select(MapToDto);
        }

        public async Task<IEnumerable<BlogDto>> GetBlogsByCategoryAsync(string category)
        {
            var blogs = await _unitOfWork.Blogs.FindAsync(b => b.Category == category && b.IsActive);
            return blogs.Select(MapToDto);
        }

        private BlogDto MapToDto(Blog blog)
        {
            return new BlogDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Excerpt = blog.Excerpt,
                FullContent = blog.FullContent,
                Category = blog.Category,
                Type = blog.Type,
                Author = blog.Author,
                ImageUrl = blog.ImageUrl,
                ReadTime = blog.ReadTime,
                IsFeatured = blog.IsFeatured,
                PublishedAt = blog.PublishedAt,
                Images = blog.Images?.Select(bi => bi.ImageUrl).ToList() ?? new List<string>(),
                CreatedAt = blog.CreatedAt,
                UpdatedAt = blog.UpdatedAt
            };
        }
    }
}

