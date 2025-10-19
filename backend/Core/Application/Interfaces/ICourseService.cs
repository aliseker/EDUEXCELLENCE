using EduExcellence.Application.DTOs.Course;

namespace EduExcellence.Application.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync();
        Task<CourseDto?> GetCourseByIdAsync(int id);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto dto);
        Task<CourseDto> UpdateCourseAsync(UpdateCourseDto dto);
        Task<bool> DeleteCourseAsync(int id);
        Task<IEnumerable<CourseDto>> GetUpcomingCoursesAsync();
        Task<IEnumerable<CourseDto>> GetApprovedCoursesAsync();
    }
}

