'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: number;
  title: string;
  description: string;
  fee: string;
  duration: string;
  startDate: string | null;
  endDate: string | null;
  location: string;
  level: string;
  maxParticipants: number;
  currentParticipants: number;
  isApproved: boolean;
  learningOutcomes: string[];
  dailyProgram: string[];
  imageUrl?: string;
}

const KA1CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    level: '',
    approved: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await fetch('https://localhost:7166/api/Courses');
      if (response.ok) {
        const apiCourses = await response.json();
        // Convert API data to component format
        const convertedCourses = apiCourses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          fee: course.fee,
          duration: course.duration,
          startDate: course.startDate,
          endDate: course.endDate,
          location: course.location,
          category: course.category,
          level: course.level,
          maxParticipants: course.maxParticipants,
          currentParticipants: course.currentParticipants,
          isApproved: course.isApproved,
          learningOutcomes: course.learningOutcomes || [],
          dailyProgram: course.dailyPrograms || []
        }));
        
        setCourses(convertedCourses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Refresh courses every 30 seconds to get latest data
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCourses();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Get all courses (no date filtering)
  const upcomingCourses = courses;

  // Get most recent 4 courses (sorted by start date, all courses)
  const recentCourses = upcomingCourses
    .sort((a, b) => {
      // Handle null dates - put courses without dates at the end
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    })
    .slice(0, 4);

  // Group upcoming courses by month
  const coursesByMonth = upcomingCourses.reduce((acc, course) => {
    if (!course.startDate) {
      // Put courses without dates in "Tarih Belirtilmemiş" group
      const monthKey = 'Tarih Belirtilmemiş';
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(course);
      return acc;
    }
    
    const courseDate = new Date(course.startDate);
    const monthKey = courseDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  // Generate all months for the next 12 months, starting from current month
  const generateAllMonths = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthKey = monthDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      months.push(monthKey);
    }
    
    return months;
  };

  const allMonths = generateAllMonths();
  
  // Add "Tarih Belirtilmemiş" to months if there are courses without dates
  const hasCoursesWithoutDates = courses.some(course => !course.startDate);
  if (hasCoursesWithoutDates) {
    allMonths.push('Tarih Belirtilmemiş');
  }
  
  // Debug logs
  console.log('All months:', allMonths);
  console.log('Courses by month:', coursesByMonth);
  console.log('Upcoming courses:', upcomingCourses.map(c => ({ title: c.title, startDate: c.startDate })));
  
  // Set current month as default selected
  useEffect(() => {
    if (allMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(allMonths[0]); // Current month (first in array)
    }
  }, [allMonths, selectedMonth]);

  // Filter courses based on current filters (all courses, including upcoming ones)
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         course.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLocation = !filters.location || course.location.toLowerCase() === filters.location.toLowerCase();
    const matchesLevel = !filters.level || course.level === filters.level;
    const matchesApproved = filters.approved === 'all' || 
                           (filters.approved === 'approved' && course.isApproved) ||
                           (filters.approved === 'pending' && !course.isApproved);
    
    return matchesSearch && matchesLocation && matchesLevel && matchesApproved;
  });

  // Get unique values for filter options
  const allLocations = [...new Set(courses.map(course => course.location))].sort();
  const levels = [...new Set(courses.map(course => course.level))];

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      level: '',
      approved: 'all'
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2">KA1 Course Catalog</h1>
          <p className="text-sm md:text-base mb-2">Discover upcoming courses and find the perfect learning opportunity for your professional development</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Upcoming Courses - Single Dynamic Block */}
        {upcomingCourses.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-orange-200">
              {/* Header with Calendar Toggle */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 border-b border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-orange-800 mb-1">🗓️ Upcoming and Approved Courses</h2>
                    <p className="text-orange-600 text-xs">
                      {selectedMonth && coursesByMonth[selectedMonth] 
                        ? `${selectedMonth} - ${Math.min(coursesByMonth[selectedMonth].length, 4)} courses`
                        : `Latest ${recentCourses.length} courses`
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMonthSelector(!showMonthSelector)}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                
                {/* Month Selector Row - Toggleable */}
                {showMonthSelector && (
                  <div className="mt-4 bg-white rounded-lg shadow-sm border border-orange-200 p-2">
                    <div className="grid grid-cols-12 gap-1">
                      {allMonths.map((month) => {
                        const hasCourses = coursesByMonth[month] && coursesByMonth[month].length > 0;
                        const courseCount = hasCourses ? coursesByMonth[month].length : 0;
                        const isSelected = selectedMonth === month;
                        const isHovered = hoveredMonth === month;
                        
                        return (
                          <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            onMouseEnter={() => setHoveredMonth(month)}
                            onMouseLeave={() => setHoveredMonth(null)}
                            className={`px-2 py-3 rounded-lg border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50 shadow-md'
                                : isHovered
                                ? hasCourses
                                  ? 'border-orange-300 bg-orange-100 shadow-lg'
                                  : 'border-gray-300 bg-gray-100 shadow-md'
                                : hasCourses
                                ? 'border-orange-200 bg-orange-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="text-center">
                              <div className={`text-xs font-medium ${
                                isSelected ? 'text-orange-800' : hasCourses ? 'text-orange-700' : 'text-gray-600'
                              }`}>
                                {month.split(' ')[0]}
                              </div>
                              <div className={`text-xs ${
                                isSelected ? 'text-orange-600' : hasCourses ? 'text-orange-600' : 'text-gray-500'
                              }`}>
                                {month.split(' ')[1]}
                              </div>
                              <div className={`text-xs font-bold mt-1 ${
                                isSelected ? 'text-orange-700' : hasCourses ? 'text-orange-700' : 'text-gray-500'
                              }`}>
                                {courseCount}
                              </div>
                              {hasCourses && (
                                <div className="text-orange-600 text-xs">✓</div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dynamic Courses Content */}
              <div className="p-4">
                {(() => {
                  const displayCourses = selectedMonth && coursesByMonth[selectedMonth] 
                    ? coursesByMonth[selectedMonth].slice(0, 4)
                    : recentCourses;
                  
                  // If selected month has no courses, show message
                  if (selectedMonth && (!coursesByMonth[selectedMonth] || coursesByMonth[selectedMonth].length === 0)) {
                    return (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No upcoming courses for this month</h3>
                        <p className="text-gray-500">There are no approved courses scheduled for {selectedMonth}</p>
                      </div>
                    );
                  }
                  
                  // If no recent courses available, show message
                  if (!selectedMonth && recentCourses.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No upcoming courses available</h3>
                        <p className="text-gray-500">There are no approved courses scheduled for the upcoming months</p>
                      </div>
                    );
                  }
                  
                  // Show courses in grid
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {displayCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {course.category}
                          </span>
                          <span className="text-sm font-bold text-gray-800">{course.fee}</span>
                        </div>
                        
                        <h4 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                          {course.title}
                        </h4>
                        
                        <div className="text-sm text-gray-600 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {course.location}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {course.startDate ? new Date(course.startDate).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }) : 'Tarih Belirtilmemiş'}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Level: {course.level}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Participants: {course.currentParticipants}/{course.maxParticipants}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Approved
                          </span>
                          <Link 
                            href={`/ka1-courses/${course.id}`}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200 flex items-center"
                          >
                            Details
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Course Filters</h3>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">All Locations</option>
                {allLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
              <select
                value={filters.approved}
                onChange={(e) => handleFilterChange('approved', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Courses</option>
                <option value="approved">Approved Courses</option>
                <option value="pending">Pending Courses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">All Courses ({filteredCourses.length})</h2>
          <p className="text-gray-600 mb-6">All courses matching the filters are listed below</p>

          {currentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border border-gray-200 flex flex-col h-full">
                  {/* Course Cover Image */}
                  {course.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded">
                        KA1 Course
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{course.fee}</div>
                        <div className="text-xs opacity-90">{course.duration}</div>
                      </div>
                    </div>
                    <h3 className="text-base font-bold leading-tight mb-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs">
                      <span>📍 {course.location}</span>
                      <span>📅 {course.startDate ? new Date(course.startDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }) : 'Tarih Belirtilmemiş'}</span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Level: {course.level}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        Participants: {course.currentParticipants}/{course.maxParticipants}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {course.learningOutcomes.length} Learning Outcomes
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {course.isApproved ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Approved Course
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pending Approval
                        </span>
                      )}
                    </div>

                    {/* Action Buttons - Fixed at bottom */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/ka1-courses/${course.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
              <p className="text-gray-600">No courses match your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default KA1CoursesPage;