'use client';

import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
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
  image?: string;
  learningOutcomes: string[];
  dailyProgram: string[];
  createdAt?: string;
}

interface FilterState {
  search: string;
  location: string;
  level: string;
  approved: string;
}

const LatestCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    level: '',
    approved: 'all'
  });


  // Sample data - fallback if API fails
  const sampleCourses: Course[] = [
    {
      id: 1,
      title: "CONTENT AND LANGUAGE INTEGRATED LEARNING – CLIL",
      fee: "80 EURO PER DAY",
      duration: "5 DAYS",
      startDate: "2025-01-15",
      endDate: "2025-01-19",
      location: "İstanbul",
      category: "Language Teaching",
      level: "Intermediate",
      maxParticipants: 20,
      currentParticipants: 15,
      isApproved: true,
      description: "It is called Content and Language Integrated Learning (CLIL) when a subject is taught in English to learners with a distinct primary language (such as math, science, or geography). The content of the class and an aspect of the English language are the two main points of concentration for each lesson. EMI (English as the Medium of Instruction) is a close cousin of this course, which focuses primarily on teaching the subject matter, and both techniques benefit from this course.",
      learningOutcomes: [
        "Learn how to incorporate the four abilities of English or any other foreign language into the classroom and school curriculum",
        "Create learning activities that are both fun and effective in achieving language and subject goals",
        "It is important to create an engaging classroom environment where learning is pleasant and focused on relevant information",
        "Learn how to effectively use English in the classroom so that students can work together and communicate with one another",
        "New concepts for raising student interest and motivation in the acquisition of languages by employing interesting and 'genuine' materials from the real world can be implemented in the classroom"
      ],
      dailyProgram: [
        "Day 1: Soft and hard CLIL definitions and models, Aims of CLIL: a dual focus on content and language, What is the role of a CLIL teacher in education?, Theory: CLIL is based on four C's and three D'S, How does CLIL work in practice?",
        "Day 2: Specifying educational goals, From the beginning to the end of the process, Knowing what a student's academic language needs are, Constructing a framework for content and constructing a framework for language",
        "Day 3: Choosing CLIL resources, In the context of the CLIL classroom, adapting materials, Developing CLIL resources, Recognizing and addressing cognitive and language difficulties",
        "Day 4: What are we testing? Is it content, skills, or language?, What makes a good test question, in terms of summative assessment?, Tips and approaches for doing formative assessments, The design was done the wrong way around",
        "Day 5: The evaluation of the course includes a review of the skills and knowledge students have gained, as well as comments from the instructor and class discussion, The giving of the Certificate of Attendance upon course completion, Adventures and other cultural activities"
      ]
    },
    {
      id: 2,
      title: "DIGITAL TEACHING AND LEARNING",
      fee: "90 EURO PER DAY",
      duration: "7 DAYS",
      startDate: "2025-02-10",
      endDate: "2025-02-16",
      location: "Porto",
      category: "Digital Education",
      level: "Beginner",
      maxParticipants: 18,
      currentParticipants: 12,
      isApproved: true,
      description: "This course focuses on modern digital teaching methods and tools that can be integrated into educational practices. Participants will learn about various digital platforms, interactive tools, and online assessment methods.",
      learningOutcomes: [
        "Master digital teaching tools and platforms",
        "Create interactive online content",
        "Implement digital assessment methods",
        "Understand online learning management systems",
        "Develop digital literacy skills for educators"
      ],
      dailyProgram: [
        "Day 1: Introduction to digital education and current trends",
        "Day 2: Learning Management Systems (LMS) overview",
        "Day 3: Interactive content creation tools",
        "Day 4: Digital assessment and feedback methods",
        "Day 5: Online collaboration and communication tools",
        "Day 6: Mobile learning and apps for education",
        "Day 7: Course evaluation and certificate presentation"
      ]
    },
    {
      id: 3,
      title: "STEM EDUCATION METHODOLOGY",
      fee: "85 EURO PER DAY",
      duration: "6 DAYS",
      startDate: "2025-01-20",
      endDate: "2025-01-25",
      location: "Amsterdam",
      category: "STEM Education",
      level: "Advanced",
      maxParticipants: 15,
      currentParticipants: 8,
      isApproved: true,
      description: "This course provides comprehensive training in STEM (Science, Technology, Engineering, and Mathematics) education methodologies. Participants will learn innovative approaches to teaching STEM subjects and integrating technology into the classroom.",
      learningOutcomes: [
        "Understand modern STEM education principles",
        "Learn to integrate technology in STEM teaching",
        "Develop hands-on learning activities",
        "Master project-based learning approaches",
        "Create engaging STEM lesson plans"
      ],
      dailyProgram: [
        "Day 1: Introduction to STEM education and current trends",
        "Day 2: Science teaching methodologies and experiments",
        "Day 3: Technology integration in education",
        "Day 4: Engineering design thinking and problem-solving",
        "Day 5: Mathematics teaching strategies",
        "Day 6: Project-based learning and assessment"
      ]
    },
    {
      id: 4,
      title: "INCLUSIVE EDUCATION STRATEGIES",
      fee: "75 EURO PER DAY",
      duration: "5 DAYS",
      startDate: "2025-03-05",
      endDate: "2025-03-09",
      location: "Antalya",
      category: "Special Education",
      level: "Intermediate",
      maxParticipants: 25,
      currentParticipants: 18,
      isApproved: true,
      description: "This course focuses on inclusive education strategies to support students with diverse learning needs. Participants will learn about differentiated instruction, assistive technologies, and creating inclusive classroom environments.",
      learningOutcomes: [
        "Understand principles of inclusive education",
        "Learn differentiated instruction techniques",
        "Master assistive technology tools",
        "Develop inclusive classroom management strategies",
        "Create accessible learning materials"
      ],
      dailyProgram: [
        "Day 1: Understanding inclusive education principles",
        "Day 2: Differentiated instruction strategies",
        "Day 3: Assistive technologies and tools",
        "Day 4: Classroom management for inclusion",
        "Day 5: Assessment and evaluation in inclusive settings"
      ]
    },
    {
      id: 5,
      title: "ENVIRONMENTAL EDUCATION AND SUSTAINABILITY",
      fee: "80 EURO PER DAY",
      duration: "6 DAYS",
      startDate: "2025-04-15",
      endDate: "2025-04-20",
      location: "Granada",
      category: "Environmental Education",
      level: "Beginner",
      maxParticipants: 20,
      currentParticipants: 14,
      isApproved: true,
      description: "This course explores environmental education and sustainability practices in schools. Participants will learn how to integrate environmental awareness into their curriculum and promote sustainable practices among students.",
      learningOutcomes: [
        "Understand environmental education principles",
        "Learn sustainability practices for schools",
        "Develop environmental awareness activities",
        "Master outdoor learning techniques",
        "Create green school initiatives"
      ],
      dailyProgram: [
        "Day 1: Introduction to environmental education",
        "Day 2: Sustainability in school settings",
        "Day 3: Outdoor learning and nature-based education",
        "Day 4: Climate change education strategies",
        "Day 5: Green school initiatives and projects",
        "Day 6: Community engagement and environmental action"
      ]
    },
    {
      id: 6,
      title: "CRITICAL THINKING AND PROBLEM SOLVING",
      fee: "85 EURO PER DAY",
      duration: "5 DAYS",
      startDate: "2025-05-10",
      endDate: "2025-05-14",
      location: "Dortmund",
      category: "Critical Thinking",
      level: "Advanced",
      maxParticipants: 18,
      currentParticipants: 12,
      isApproved: true,
      description: "This course focuses on developing critical thinking and problem-solving skills in students. Participants will learn various methodologies to enhance students' analytical thinking and decision-making abilities.",
      learningOutcomes: [
        "Master critical thinking teaching methods",
        "Learn problem-solving frameworks",
        "Develop analytical thinking activities",
        "Understand decision-making processes",
        "Create engaging thinking exercises"
      ],
      dailyProgram: [
        "Day 1: Introduction to critical thinking",
        "Day 2: Problem-solving methodologies",
        "Day 3: Analytical thinking techniques",
        "Day 4: Decision-making processes",
        "Day 5: Assessment of thinking skills"
      ]
    }
  ];


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Courses`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const apiCourses = await response.json();
          
          // Tarihe göre en yeniden en eskiye sırala
          apiCourses.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
          
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
            dailyProgram: course.dailyPrograms || [],
            createdAt: course.createdAt
          }));
          
        setCourses(convertedCourses);
        // Apply current filters to the new courses
        handleFilterChange(filters, convertedCourses);
        } else {
          // Fallback to sample data if API fails
          setCourses(sampleCourses);
          // Apply current filters to the sample courses
          handleFilterChange(filters, sampleCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to sample data if API fails
        setCourses(sampleCourses);
        // Apply current filters to the sample courses
        handleFilterChange(filters, sampleCourses);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  // Get courses that are not past (based on end date)
  const getNotPastCourses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return courses.filter(course => {
      // If no end date, keep it
      if (!course.endDate) return true;
      
      // Check if end date is today or in the future
      const courseEndDate = new Date(course.endDate);
      courseEndDate.setHours(0, 0, 0, 0);
      
      return courseEndDate >= today;
    });
  };

  // Get unique locations from not-past courses (case insensitive)
  const getUniqueLocations = () => {
    const notPastCourses = getNotPastCourses();
    const locations = notPastCourses.map(course => course.location).filter(location => location);
    const uniqueLocations = [...new Set(locations.map(location => location.toLowerCase()))];
    return uniqueLocations.map(location => 
      locations.find(orig => orig.toLowerCase() === location) || location
    ).sort();
  };

  // Get unique levels from not-past courses
  const getUniqueLevels = () => {
    const notPastCourses = getNotPastCourses();
    const levels = notPastCourses.map(course => course.level).filter(level => level);
    return [...new Set(levels)].sort();
  };

  const handleFilterChange = (newFilters: any, coursesToFilter?: Course[]) => {
    setFilters(newFilters);
    const coursesToUse = coursesToFilter || courses;
    
    // First, filter out courses with past end dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = coursesToUse.filter(course => {
      // If no end date, keep it
      if (!course.endDate) return true;
      
      // Check if end date is today or in the future
      const courseEndDate = new Date(course.endDate);
      courseEndDate.setHours(0, 0, 0, 0);
      
      return courseEndDate >= today;
    });

    // Search filter
    if (newFilters.search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    // Location filter (case insensitive)
    if (newFilters.location) {
      filtered = filtered.filter(course => 
        course.location.toLowerCase() === newFilters.location.toLowerCase()
      );
    }

    // Level filter
    if (newFilters.level) {
      filtered = filtered.filter(course => course.level === newFilters.level);
    }

    // Approved filter
    if (newFilters.approved !== 'all') {
      if (newFilters.approved === 'approved') {
        filtered = filtered.filter(course => course.isApproved);
      } else if (newFilters.approved === 'pending') {
        filtered = filtered.filter(course => !course.isApproved);
      }
    }

    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take your career to the next level with Erasmus programs and professional development courses
          </p>
        </div>

        {/* Course Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Course Filters</h3>
            <button
              onClick={() => {
                setFilters({ search: '', location: '', level: '', approved: 'all' });
                handleFilterChange({ search: '', location: '', level: '', approved: 'all' });
              }}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange({ ...filters, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">All Locations</option>
                {getUniqueLocations().map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange({ ...filters, level: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">All Levels</option>
                {getUniqueLevels().map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.approved}
                onChange={(e) => handleFilterChange({ ...filters, approved: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Courses</option>
                <option value="approved">Approved Courses</option>
                <option value="pending">Pending Courses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Courses ({filteredCourses.length})</h2>
          <p className="text-gray-600">
            All courses matching the filters are listed below
          </p>
        </div>

        {/* Courses Grid - Show only 3 courses */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.slice(0, 3).map((course) => (
              <CourseCard
                key={course.id}
                {...course}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-gray-500">No courses match your search criteria.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/ka1-courses" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-block shadow-lg hover:shadow-xl">
            View All Courses ({filteredCourses.length})
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestCourses;
