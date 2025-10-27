'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

interface Course {
  id: number;
  title: string;
  description: string;
  fee: string;
  duration: string;
  startDate: string | null;
  endDate: string | null;
  location: string;
  category: string;
  level: string;
  maxParticipants: number;
  currentParticipants: number;
  isApproved: boolean;
  imageUrl?: string;
  learningOutcomes: string[];
  dailyPrograms: string[];
  createdAt: string;
  updatedAt?: string;
}

const UpcomingApprovedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/approved`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Get all approved courses with start dates in the future (upcoming)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  
  const upcomingCourses = courses.filter(course => {
    // Must be approved (double check even though API should only return approved)
    if (course.isApproved !== true) return false;
    
    // Must have a start date
    if (!course.startDate) return false;
    
    // Start date must be in the future (not started yet)
    const courseStartDate = new Date(course.startDate);
    courseStartDate.setHours(0, 0, 0, 0);
    
    return courseStartDate >= today;
  });

  // Group courses by month
  const coursesByMonth: { [key: string]: Course[] } = {};
  upcomingCourses.forEach(course => {
    const courseDate = new Date(course.startDate!);
    const monthKey = courseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!coursesByMonth[monthKey]) {
      coursesByMonth[monthKey] = [];
    }
    coursesByMonth[monthKey].push(course);
  });

  // Generate all 12 months for the current year and next year
  const generateAllMonths = () => {
    const months = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Start from current month and go 12 months ahead
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, currentMonth + i, 1);
      const monthKey = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.push(monthKey);
    }
    
    return months;
  };

  const allMonths = generateAllMonths();

  // Get recent courses (latest 4, sorted by createdAt)
  const recentCourses = upcomingCourses
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Most recent first
    })
    .slice(0, 4);

  if (loading) {
    return (
      <section className="py-8 bg-white min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-300 rounded-xl"></div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (upcomingCourses.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white min-h-[500px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
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
                          className={`px-1 py-2 rounded-lg border-2 transition-all duration-200 text-xs ${
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
                                {month.split(' ')[0].substring(0, 3)}
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

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayCourses.map((course) => {
                      let courseDate = null;
                      let daysUntil = null;
                      
                      if (course.startDate) {
                        courseDate = new Date(course.startDate);
                        const today = new Date();
                        // Set today to start of day for comparison
                        today.setHours(0, 0, 0, 0);
                        daysUntil = Math.ceil((courseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      }
                      
                      return (
                        <div key={course.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow duration-200">
                          {courseDate && (
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-medium text-orange-800">
                                {courseDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </div>
                              <div className="text-xs text-orange-600">
                                {daysUntil !== null && (daysUntil > 0 ? `${daysUntil} days left` : daysUntil === 0 ? 'Starts today' : 'Started')}
                              </div>
                            </div>
                          )}
                          
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Approved
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight">
                            {course.title}
                          </h3>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {course.location}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {course.duration}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              {course.fee}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Link 
                              href={`/ka1-courses/${course.id}`}
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-center block"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingApprovedCourses;
