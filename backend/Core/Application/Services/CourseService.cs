using EduExcellence.Application.DTOs.Course;
using EduExcellence.Application.Interfaces;
using EduExcellence.Domain.Entities;
using EduExcellence.Domain.Interfaces;

namespace EduExcellence.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync()
        {
            var courses = await _unitOfWork.Courses.GetAllAsync();
            var courseDtos = new List<CourseDto>();
            
            foreach (var course in courses)
            {
                // Manually load related data for each course
                var learningOutcomes = await _unitOfWork.CourseLearningOutcomes.FindAsync(lo => lo.CourseId == course.Id);
                var dailyPrograms = await _unitOfWork.CourseDailyPrograms.FindAsync(dp => dp.CourseId == course.Id);
                
                course.LearningOutcomes = learningOutcomes.ToList();
                course.DailyPrograms = dailyPrograms.ToList();
                
                courseDtos.Add(MapToDto(course));
            }
            
            return courseDtos;
        }

        public async Task<CourseDto?> GetCourseByIdAsync(int id)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(id);
            if (course == null) return null;

            // Manually load related data
            var learningOutcomes = await _unitOfWork.CourseLearningOutcomes.FindAsync(lo => lo.CourseId == id);
            var dailyPrograms = await _unitOfWork.CourseDailyPrograms.FindAsync(dp => dp.CourseId == id);
            
            course.LearningOutcomes = learningOutcomes.ToList();
            course.DailyPrograms = dailyPrograms.ToList();

            return MapToDto(course);
        }

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto dto)
        {
            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                Fee = dto.Fee,
                Duration = dto.Duration,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Location = NormalizeLocation(dto.Location),
                Level = dto.Level,
                MaxParticipants = dto.MaxParticipants,
                CurrentParticipants = dto.CurrentParticipants,
                IsApproved = dto.IsApproved,
                ImageUrl = dto.ImageUrl
            };

            await _unitOfWork.Courses.AddAsync(course);
            await _unitOfWork.SaveChangesAsync();

            // Add learning outcomes
            foreach (var outcome in dto.LearningOutcomes)
            {
                var learningOutcome = new CourseLearningOutcome
                {
                    CourseId = course.Id,
                    Outcome = outcome,
                    Order = dto.LearningOutcomes.IndexOf(outcome) + 1
                };
                await _unitOfWork.CourseLearningOutcomes.AddAsync(learningOutcome);
            }

            // Add daily programs
            foreach (var program in dto.DailyPrograms)
            {
                var dailyProgram = new CourseDailyProgram
                {
                    CourseId = course.Id,
                    Day = dto.DailyPrograms.IndexOf(program) + 1,
                    Program = program
                };
                await _unitOfWork.CourseDailyPrograms.AddAsync(dailyProgram);
            }

            await _unitOfWork.SaveChangesAsync();
            return MapToDto(course);
        }

        public async Task<CourseDto> UpdateCourseAsync(UpdateCourseDto dto)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(dto.Id);
            if (course == null)
                throw new ArgumentException("Course not found");

            course.Title = dto.Title;
            course.Description = dto.Description;
            course.Fee = dto.Fee;
            course.Duration = dto.Duration;
            course.StartDate = dto.StartDate;
            course.EndDate = dto.EndDate;
            course.Location = NormalizeLocation(dto.Location);
            course.Level = dto.Level;
            course.MaxParticipants = dto.MaxParticipants;
            course.CurrentParticipants = dto.CurrentParticipants;
            course.IsApproved = dto.IsApproved;
            course.ImageUrl = dto.ImageUrl;

            await _unitOfWork.Courses.UpdateAsync(course);

            // Update learning outcomes
            var existingOutcomes = await _unitOfWork.CourseLearningOutcomes.FindAsync(co => co.CourseId == course.Id);
            foreach (var existing in existingOutcomes)
            {
                await _unitOfWork.CourseLearningOutcomes.DeleteAsync(existing.Id);
            }

            foreach (var outcome in dto.LearningOutcomes)
            {
                var learningOutcome = new CourseLearningOutcome
                {
                    CourseId = course.Id,
                    Outcome = outcome,
                    Order = dto.LearningOutcomes.IndexOf(outcome) + 1
                };
                await _unitOfWork.CourseLearningOutcomes.AddAsync(learningOutcome);
            }

            // Update daily programs
            var existingPrograms = await _unitOfWork.CourseDailyPrograms.FindAsync(cp => cp.CourseId == course.Id);
            foreach (var existing in existingPrograms)
            {
                await _unitOfWork.CourseDailyPrograms.DeleteAsync(existing.Id);
            }

            foreach (var program in dto.DailyPrograms)
            {
                var dailyProgram = new CourseDailyProgram
                {
                    CourseId = course.Id,
                    Day = dto.DailyPrograms.IndexOf(program) + 1,
                    Program = program
                };
                await _unitOfWork.CourseDailyPrograms.AddAsync(dailyProgram);
                Console.WriteLine($"Added daily program: Day {dailyProgram.Day}, Program: {dailyProgram.Program}");
            }

            await _unitOfWork.SaveChangesAsync();
            Console.WriteLine($"Saved {dto.DailyPrograms.Count} daily programs to database");
            return MapToDto(course);
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(id);
            if (course == null) return false;

            await _unitOfWork.Courses.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CourseDto>> GetUpcomingCoursesAsync()
        {
            var courses = await _unitOfWork.Courses.FindAsync(c => c.StartDate.HasValue && c.StartDate > DateTime.UtcNow);
            return courses.Select(MapToDto);
        }


        public async Task<IEnumerable<CourseDto>> GetApprovedCoursesAsync()
        {
            var courses = await _unitOfWork.Courses.FindAsync(c => c.IsApproved);
            var courseDtos = new List<CourseDto>();
            
            foreach (var course in courses)
            {
                // Manually load related data for each course
                var learningOutcomes = await _unitOfWork.CourseLearningOutcomes.FindAsync(lo => lo.CourseId == course.Id);
                var dailyPrograms = await _unitOfWork.CourseDailyPrograms.FindAsync(dp => dp.CourseId == course.Id);
                
                course.LearningOutcomes = learningOutcomes.ToList();
                course.DailyPrograms = dailyPrograms.ToList();
                
                courseDtos.Add(MapToDto(course));
            }
            
            return courseDtos;
        }

        private static string NormalizeLocation(string location)
        {
            if (string.IsNullOrWhiteSpace(location))
                return location;

            // Trim whitespace
            location = location.Trim();

            // Handle common location variations
            var normalizedLocation = location.ToLower() switch
            {
                "istanbul" or "i̇stanbul" => "İstanbul",
                "antalya" => "Antalya",
                "paris" => "Paris",
                "dortmund" => "Dortmund",
                "cologne" => "Cologne",
                "düsseldorf" or "dusseldorf" => "Düsseldorf",
                "berlin" => "Berlin",
                "madrid" => "Madrid",
                "rome" => "Rome",
                "london" => "London",
                "amsterdam" => "Amsterdam",
                "vienna" => "Vienna",
                "prague" => "Prague",
                "budapest" => "Budapest",
                "warsaw" => "Warsaw",
                "athens" => "Athens",
                "lisbon" => "Lisbon",
                "stockholm" => "Stockholm",
                "oslo" => "Oslo",
                "copenhagen" => "Copenhagen",
                "helsinki" => "Helsinki",
                _ => CapitalizeFirstLetter(location)
            };

            return normalizedLocation;
        }

        private static string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            return char.ToUpper(input[0]) + input.Substring(1).ToLower();
        }

        private CourseDto MapToDto(Course course)
        {
            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Fee = course.Fee,
                Duration = course.Duration,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Location = course.Location,
                Level = course.Level,
                MaxParticipants = course.MaxParticipants,
                CurrentParticipants = course.CurrentParticipants,
                IsApproved = course.IsApproved,
                ImageUrl = course.ImageUrl,
                LearningOutcomes = course.LearningOutcomes?.Select(lo => lo.Outcome).ToList() ?? new List<string>(),
                DailyPrograms = course.DailyPrograms?.Select(dp => dp.Program).ToList() ?? new List<string>(),
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt
            };
        }
    }
}

