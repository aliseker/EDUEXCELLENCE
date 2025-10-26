using EduExcellence.Application.DTOs.Review;

namespace EduExcellence.Application.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>> GetAllReviewsAsync();
        Task<IEnumerable<ReviewDto>> GetActiveReviewsAsync();
        Task<IEnumerable<ReviewDto>> GetApprovedReviewsAsync();
        Task<IEnumerable<ReviewDto>> GetFeaturedReviewsAsync();
        Task<IEnumerable<ReviewDto>> GetReviewsByTypeAsync(string type);
        Task<ReviewDto?> GetReviewByIdAsync(int id);
        Task<ReviewDto> AddReviewAsync(CreateReviewDto reviewDto);
        Task<ReviewDto?> UpdateReviewAsync(UpdateReviewDto reviewDto);
        Task<bool> DeleteReviewAsync(int id);
    }
}














