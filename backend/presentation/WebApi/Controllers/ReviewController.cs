using EduExcellence.Application.DTOs.Review;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduExcellence.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(IReviewService reviewService, ILogger<ReviewController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAllReviews()
        {
            var reviews = await _reviewService.GetAllReviewsAsync();
            return Ok(reviews);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetActiveReviews()
        {
            var reviews = await _reviewService.GetActiveReviewsAsync();
            return Ok(reviews);
        }

        [HttpGet("approved")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetApprovedReviews()
        {
            var reviews = await _reviewService.GetApprovedReviewsAsync();
            return Ok(reviews);
        }

        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetFeaturedReviews()
        {
            var reviews = await _reviewService.GetFeaturedReviewsAsync();
            return Ok(reviews);
        }

        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByType(string type)
        {
            var reviews = await _reviewService.GetReviewsByTypeAsync(type);
            return Ok(reviews);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> GetReviewById(int id)
        {
            var review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(review);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> AddReview([FromBody] CreateReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newReview = await _reviewService.AddReviewAsync(reviewDto);
            return CreatedAtAction(nameof(GetReviewById), new { id = newReview.Id }, newReview);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> UpdateReview(int id, [FromBody] UpdateReviewDto reviewDto)
        {
            if (id != reviewDto.Id)
            {
                return BadRequest("ID mismatch.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedReview = await _reviewService.UpdateReviewAsync(reviewDto);
            if (updatedReview == null)
            {
                return NotFound();
            }
            return Ok(updatedReview);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<bool>> DeleteReview(int id)
        {
            var result = await _reviewService.DeleteReviewAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
