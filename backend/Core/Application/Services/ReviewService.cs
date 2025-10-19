using EduExcellence.Application.DTOs.Review;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EduExcellence.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ReviewService> _logger;

        public ReviewService(IUnitOfWork unitOfWork, ILogger<ReviewService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<IEnumerable<ReviewDto>> GetAllReviewsAsync()
        {
            var reviews = await _unitOfWork.ReviewRepository.GetAllAsync();
            return reviews.Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetActiveReviewsAsync()
        {
            var reviews = await _unitOfWork.ReviewRepository.FindAsync(r => r.IsActive);
            return reviews.OrderBy(r => r.Order).Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetApprovedReviewsAsync()
        {
            var reviews = await _unitOfWork.ReviewRepository.FindAsync(r => r.IsActive && r.IsApproved);
            return reviews.OrderBy(r => r.Order).Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetFeaturedReviewsAsync()
        {
            var reviews = await _unitOfWork.ReviewRepository.FindAsync(r => r.IsActive && r.IsApproved && r.IsFeatured);
            return reviews.OrderBy(r => r.Order).Select(MapToDto);
        }

        public async Task<IEnumerable<ReviewDto>> GetReviewsByTypeAsync(string type)
        {
            var reviews = await _unitOfWork.ReviewRepository.FindAsync(r => 
                r.IsActive && r.IsApproved && r.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
            return reviews.OrderBy(r => r.Order).Select(MapToDto);
        }

        public async Task<ReviewDto?> GetReviewByIdAsync(int id)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(id);
            return review == null ? null : MapToDto(review);
        }

        public async Task<ReviewDto> AddReviewAsync(CreateReviewDto reviewDto)
        {
            var review = new Review
            {
                Name = reviewDto.Name,
                Title = reviewDto.Title,
                Content = reviewDto.Content,
                Company = reviewDto.Company,
                Position = reviewDto.Position,
                ImageUrl = reviewDto.ImageUrl,
                VideoUrl = reviewDto.VideoUrl,
                Rating = reviewDto.Rating,
                Type = reviewDto.Type,
                IsFeatured = reviewDto.IsFeatured,
                IsApproved = reviewDto.IsApproved,
                Order = reviewDto.Order,
                IsActive = reviewDto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.ReviewRepository.AddAsync(review);
            await _unitOfWork.SaveChangesAsync();
            return MapToDto(review);
        }

        public async Task<ReviewDto?> UpdateReviewAsync(UpdateReviewDto reviewDto)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(reviewDto.Id);
            if (review == null)
            {
                _logger.LogWarning("Review with ID {Id} not found for update.", reviewDto.Id);
                return null;
            }

            review.Name = reviewDto.Name;
            review.Title = reviewDto.Title;
            review.Content = reviewDto.Content;
            review.Company = reviewDto.Company;
            review.Position = reviewDto.Position;
            review.ImageUrl = reviewDto.ImageUrl;
            review.VideoUrl = reviewDto.VideoUrl;
            review.Rating = reviewDto.Rating;
            review.Type = reviewDto.Type;
            review.IsFeatured = reviewDto.IsFeatured;
            review.IsApproved = reviewDto.IsApproved;
            review.Order = reviewDto.Order;
            review.IsActive = reviewDto.IsActive;
            review.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.ReviewRepository.Update(review);
            await _unitOfWork.SaveChangesAsync();
            return MapToDto(review);
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            var review = await _unitOfWork.ReviewRepository.GetByIdAsync(id);
            if (review == null)
            {
                _logger.LogWarning("Review with ID {Id} not found for deletion.", id);
                return false;
            }

            _unitOfWork.ReviewRepository.Delete(review);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private static ReviewDto MapToDto(Review review)
        {
            return new ReviewDto
            {
                Id = review.Id,
                Name = review.Name,
                Title = review.Title,
                Content = review.Content,
                Company = review.Company,
                Position = review.Position,
                ImageUrl = review.ImageUrl,
                VideoUrl = review.VideoUrl,
                Rating = review.Rating,
                Type = review.Type,
                IsFeatured = review.IsFeatured,
                IsApproved = review.IsApproved,
                Order = review.Order,
                IsActive = review.IsActive,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt ?? DateTime.UtcNow
            };
        }
    }
}


